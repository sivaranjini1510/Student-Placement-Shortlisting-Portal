const Student = require('../models/Student');
const Staff = require('../models/Staff');
const Admin = require('../models/Admin');
const Company = require('../models/Company');
const Feedback = require('../models/Feedback');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

// @desc    Register a new student
// @route   POST /api/admin/students
// @access  Private (Admin only)
const registerStudent = async (req, res) => {
  try {
    const {
      username,
      fullName,
      degree,
      department,
      gender,
      tutorName,
      dateOfBirth,
      studentContact,
      collegeEmail,
      personalEmail
    } = req.body;

    // Check if student already exists
    const studentExists = await Student.findOne({ $or: [{ username }, { collegeEmail }] });
    if (studentExists) {
      return res.status(400).json({ message: 'Student with this username or email already exists' });
    }

    // Password is DOB in DD/MM/YYYY format
    const dob = new Date(dateOfBirth);
    // Store only the date part, removing time component
    const normalizedDob = new Date(dob.getFullYear(), dob.getMonth(), dob.getDate());
    const password = `${normalizedDob.getDate().toString().padStart(2, '0')}/${(normalizedDob.getMonth() + 1).toString().padStart(2, '0')}/${normalizedDob.getFullYear()}`;

    // Hash the password before creating the student
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create student with hashed password
    const student = new Student({
      username,
      password: hashedPassword,
      fullName,
      degree,
      department,
      gender,
      tutorName,
      dateOfBirth,
      studentContact,
      collegeEmail,
      personalEmail
    });

    const savedStudent = await student.save();

    if (savedStudent) {
      res.status(201).json({
        _id: student._id,
        username: student.username,
        fullName: student.fullName,
        department: student.department,
        collegeEmail: student.collegeEmail,
        profileCompleted: student.profileCompleted
      });
    } else {
      res.status(400).json({ message: 'Invalid student data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Register a new staff member
// @route   POST /api/admin/staff
// @access  Private (Admin only)
const registerStaff = async (req, res) => {
  try {
    const {
      username,
      fullName,
      dateOfBirth,
      department,
      contactNumber,
      email,
      designation
    } = req.body;

    // Check if staff already exists
    const staffExists = await Staff.findOne({ $or: [{ username }, { email }] });
    if (staffExists) {
      return res.status(400).json({ message: 'Staff with this username or email already exists' });
    }

    // Password is DOB in DD/MM/YYYY format
    const dob = new Date(dateOfBirth);
    // Store only the date part, removing time component
    const normalizedDob = new Date(dob.getFullYear(), dob.getMonth(), dob.getDate());
    const password = `${normalizedDob.getDate().toString().padStart(2, '0')}/${(normalizedDob.getMonth() + 1).toString().padStart(2, '0')}/${normalizedDob.getFullYear()}`;

    // Hash the password before creating the staff
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create staff with hashed password
    const staff = new Staff({
      username,
      password: hashedPassword,
      fullName,
      dateOfBirth,
      department,
      contactNumber,
      email,
      designation
    });

    const savedStaff = await staff.save();

    if (savedStaff) {
      res.status(201).json({
        _id: staff._id,
        username: staff.username,
        fullName: staff.fullName,
        department: staff.department,
        email: staff.email,
        designation: staff.designation
      });
    } else {
      res.status(400).json({ message: 'Invalid staff data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all students
// @route   GET /api/admin/students
// @access  Private (Admin only)
const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find({})
      .select('-password')
      .sort({ createdAt: -1 });
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all staff
// @route   GET /api/admin/staff
// @access  Private (Admin only)
const getAllStaff = async (req, res) => {
  try {
    const staff = await Staff.find({})
      .select('-password')
      .sort({ createdAt: -1 });
    res.json(staff);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get student by ID
// @route   GET /api/admin/students/:id
// @access  Private (Admin only)
const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).select('-password');
    if (student) {
      res.json(student);
    } else {
      res.status(404).json({ message: 'Student not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get staff by ID
// @route   GET /api/admin/staff/:id
// @access  Private (Admin only)
const getStaffById = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id).select('-password');
    if (staff) {
      res.json(staff);
    } else {
      res.status(404).json({ message: 'Staff not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update student
// @route   PUT /api/admin/students/:id
// @access  Private (Admin only)
const updateStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Only allow updating specific fields from admin edit form
    const allowedFields = [
      'fullName', 'collegeEmail', 'department', 'contactNumber',
      'rollNumber', 'yearOfStudy', 'cgpa', 'placementStatus', 'placedCompany', 'placementDate'
    ];

    const updateData = {};

    // Only update fields that are provided and not empty
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined && req.body[field] !== null && req.body[field] !== '') {
        if (field === 'cgpa') {
          updateData[field] = parseFloat(req.body[field]);
        } else if (field === 'yearOfStudy') {
          updateData[field] = parseInt(req.body[field]);
        } else {
          updateData[field] = req.body[field];
        }
      }
    });

    // If placementStatus is being set to 'Not Placed', clear placedCompany
    if (updateData.placementStatus === 'Not Placed') {
      updateData.placedCompany = undefined;
    }

    // If no valid data to update, return current student
    if (Object.keys(updateData).length === 0) {
      return res.json(student);
    }

    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    res.json(updatedStudent);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error: ' + Object.values(error.errors).map(e => e.message).join(', ') });
    }
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update staff
// @route   PUT /api/admin/staff/:id
// @access  Private (Admin only)
const updateStaff = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);
    if (!staff) {
      return res.status(404).json({ message: 'Staff not found' });
    }

    const updatedStaff = await Staff.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).select('-password');

    res.json(updatedStaff);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete student
// @route   DELETE /api/admin/students/:id
// @access  Private (Admin only)
const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: 'Student removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete staff
// @route   DELETE /api/admin/staff/:id
// @access  Private (Admin only)
const deleteStaff = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);
    if (!staff) {
      return res.status(404).json({ message: 'Staff not found' });
    }

    await Staff.findByIdAndDelete(req.params.id);
    res.json({ message: 'Staff removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get placed students
// @route   GET /api/admin/placed-students
// @access  Private (Admin only)
const getPlacedStudents = async (req, res) => {
  try {
    const { department } = req.query;
    let matchCondition = { placementStatus: 'Placed' };

    if (department) {
      matchCondition.department = department;
    }

    const students = await Student.aggregate([
      { $match: matchCondition },
      {
        $lookup: {
          from: 'feedbacks',
          localField: '_id',
          foreignField: 'student',
          as: 'feedback'
        }
      },
      {
        $addFields: {
          feedbackStatus: {
            $cond: {
              if: { $gt: [{ $size: '$feedback' }, 0] },
              then: {
                $cond: {
                  if: { $in: [{ $arrayElemAt: ['$feedback.status', 0] }, ['Submitted', 'Verified']] },
                  then: 'Completed',
                  else: 'Pending'
                }
              },
              else: 'Pending'
            }
          }
        }
      },
      { $sort: { createdAt: -1 } },
      { $project: { password: 0, feedback: 0 } }
    ]);
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get not placed students
// @route   GET /api/admin/not-placed-students
// @access  Private (Admin only)
const getNotPlacedStudents = async (req, res) => {
  try {
    const { department } = req.query;
    let query = { placementStatus: 'Not Placed' };

    if (department) {
      query.department = department;
    }

    const students = await Student.find(query)
      .select('-password')
      .sort({ createdAt: -1 });
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard
// @access  Private (Admin only)
const getDashboardStats = async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    const totalStaff = await Staff.countDocuments();
    const placedStudents = await Student.countDocuments({ placementStatus: 'Placed' });
    const notPlacedStudents = await Student.countDocuments({ placementStatus: 'Not Placed' });
    const totalCompanies = await Company.countDocuments();
    const totalFeedbacks = await Feedback.countDocuments();

    res.json({
      totalStudents,
      totalStaff,
      placedStudents,
      notPlacedStudents,
      totalCompanies,
      totalFeedbacks
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Export student resumes as ZIP
// @route   GET /api/admin/export-resumes
// @access  Private (Admin only)
const exportStudentResumes = async (req, res) => {
  try {
    const students = await Student.find({}).select('fullName resume username');

    if (!students || students.length === 0) {
      return res.status(404).json({ message: 'No students found' });
    }

    const zipFileName = `student_resumes_${new Date().toISOString().split('T')[0]}.zip`;
    const zipPath = path.join(__dirname, '..', 'downloads', zipFileName);

    // Ensure downloads directory exists
    const dir = path.dirname(zipPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip', {
      zlib: { level: 9 } // Sets the compression level
    });

    output.on('close', () => {
      console.log(archive.pointer() + ' total bytes');
      console.log('Archiver has been finalized and the output file descriptor has closed.');

      // Send the ZIP file
      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', `attachment; filename="${zipFileName}"`);
      res.sendFile(zipPath, (err) => {
        if (err) {
          console.error('Error sending file:', err);
          res.status(500).json({ message: 'Error sending file' });
        } else {
          // Optionally delete the file after sending
          fs.unlink(zipPath, (unlinkErr) => {
            if (unlinkErr) console.error('Error deleting temp file:', unlinkErr);
          });
        }
      });
    });

    archive.on('error', (err) => {
      throw err;
    });

    archive.pipe(output);

    let fileCount = 0;
    for (const student of students) {
      if (student.resume) {
        const resumePath = path.join(__dirname, '..', student.resume);
        if (fs.existsSync(resumePath)) {
          const fileName = `${student.fullName.replace(/[^a-zA-Z0-9]/g, '_')}_${student.username}.pdf`;
          archive.file(resumePath, { name: fileName });
          fileCount++;
        }
      }
    }

    if (fileCount === 0) {
      archive.abort();
      return res.status(404).json({ message: 'No resume files found to export' });
    }

    archive.finalize();
  } catch (error) {
    console.error('Error exporting resumes:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Export placed student resumes as ZIP
// @route   GET /api/admin/export-placed-resumes
// @access  Private (Admin only)
const exportPlacedStudentResumes = async (req, res) => {
  try {
    const students = await Student.find({ placementStatus: 'Placed' }).select('fullName resume username');

    if (!students || students.length === 0) {
      return res.status(404).json({ message: 'No placed students found' });
    }

    const zipFileName = `placed_student_resumes_${new Date().toISOString().split('T')[0]}.zip`;
    const zipPath = path.join(__dirname, '..', 'downloads', zipFileName);

    // Ensure downloads directory exists
    const dir = path.dirname(zipPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip', {
      zlib: { level: 9 } // Sets the compression level
    });

    output.on('close', () => {
      console.log(archive.pointer() + ' total bytes');
      console.log('Archiver has been finalized and the output file descriptor has closed.');

      // Send the ZIP file
      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', `attachment; filename="${zipFileName}"`);
      res.sendFile(zipPath, (err) => {
        if (err) {
          console.error('Error sending file:', err);
          res.status(500).json({ message: 'Error sending file' });
        } else {
          // Optionally delete the file after sending
          fs.unlink(zipPath, (unlinkErr) => {
            if (unlinkErr) console.error('Error deleting temp file:', unlinkErr);
          });
        }
      });
    });

    archive.on('error', (err) => {
      throw err;
    });

    archive.pipe(output);

    let fileCount = 0;
    for (const student of students) {
      if (student.resume) {
        const resumePath = path.join(__dirname, '..', student.resume);
        if (fs.existsSync(resumePath)) {
          const fileName = `${student.fullName.replace(/[^a-zA-Z0-9]/g, '_')}_${student.username}.pdf`;
          archive.file(resumePath, { name: fileName });
          fileCount++;
        }
      }
    }

    if (fileCount === 0) {
      archive.abort();
      return res.status(404).json({ message: 'No resume files found to export' });
    }

    archive.finalize();
  } catch (error) {
    console.error('Error exporting placed student resumes:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Export not placed student resumes as ZIP
// @route   GET /api/admin/export-not-placed-resumes
// @access  Private (Admin only)
const exportNotPlacedStudentResumes = async (req, res) => {
  try {
    const students = await Student.find({ placementStatus: 'Not Placed' }).select('fullName resume username');

    if (!students || students.length === 0) {
      return res.status(404).json({ message: 'No not placed students found' });
    }

    const zipFileName = `not_placed_student_resumes_${new Date().toISOString().split('T')[0]}.zip`;
    const zipPath = path.join(__dirname, '..', 'downloads', zipFileName);

    // Ensure downloads directory exists
    const dir = path.dirname(zipPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip', {
      zlib: { level: 9 } // Sets the compression level
    });

    output.on('close', () => {
      console.log(archive.pointer() + ' total bytes');
      console.log('Archiver has been finalized and the output file descriptor has closed.');

      // Send the ZIP file
      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', `attachment; filename="${zipFileName}"`);
      res.sendFile(zipPath, (err) => {
        if (err) {
          console.error('Error sending file:', err);
          res.status(500).json({ message: 'Error sending file' });
        } else {
          // Optionally delete the file after sending
          fs.unlink(zipPath, (unlinkErr) => {
            if (unlinkErr) console.error('Error deleting temp file:', unlinkErr);
          });
        }
      });
    });

    archive.on('error', (err) => {
      throw err;
    });

    archive.pipe(output);

    let fileCount = 0;
    for (const student of students) {
      if (student.resume) {
        const resumePath = path.join(__dirname, '..', student.resume);
        if (fs.existsSync(resumePath)) {
          const fileName = `${student.fullName.replace(/[^a-zA-Z0-9]/g, '_')}_${student.username}.pdf`;
          archive.file(resumePath, { name: fileName });
          fileCount++;
        }
      }
    }

    if (fileCount === 0) {
      archive.abort();
      return res.status(404).json({ message: 'No resume files found to export' });
    }

    archive.finalize();
  } catch (error) {
    console.error('Error exporting not placed student resumes:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Export placed students list as PDF
// @route   GET /api/admin/export-placed-students-list
// @access  Private (Admin only)
const exportPlacedStudentsList = async (req, res) => {
  try {
    const { department } = req.query;
    let matchCondition = { placementStatus: 'Placed' };

    if (department) {
      matchCondition.department = department;
    }

    const students = await Student.aggregate([
      { $match: matchCondition },
      {
        $lookup: {
          from: 'feedbacks',
          localField: '_id',
          foreignField: 'student',
          as: 'feedback'
        }
      },
      {
        $addFields: {
          feedbackStatus: {
            $cond: {
              if: { $gt: [{ $size: '$feedback' }, 0] },
              then: {
                $cond: {
                  if: { $in: [{ $arrayElemAt: ['$feedback.status', 0] }, ['Submitted', 'Verified']] },
                  then: 'Completed',
                  else: 'Pending'
                }
              },
              else: 'Pending'
            }
          }
        }
      },
      { $sort: { createdAt: -1 } },
      { $project: { password: 0, feedback: 0 } }
    ]);

    if (!students || students.length === 0) {
      return res.status(404).json({ message: 'No placed students found' });
    }

    const pdfGenerator = require('../utils/pdfGenerator');
    const pdfBuffer = await pdfGenerator.generatePlacedStudentsListPDF(students);

    const fileName = `placed_students_list_${new Date().toISOString().split('T')[0]}.pdf`;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Error exporting placed students list:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Export not placed students list as PDF
// @route   GET /api/admin/export-not-placed-students-list
// @access  Private (Admin only)
const exportNotPlacedStudentsList = async (req, res) => {
  try {
    const { department } = req.query;
    let query = { placementStatus: 'Not Placed' };

    if (department) {
      query.department = department;
    }

    const students = await Student.find(query)
      .select('fullName collegeEmail department cgpa yearOfStudy')
      .sort({ createdAt: -1 });

    if (!students || students.length === 0) {
      return res.status(404).json({ message: 'No not placed students found' });
    }

    const pdfGenerator = require('../utils/pdfGenerator');
    const pdfBuffer = await pdfGenerator.generateNotPlacedStudentsListPDF(students);

    const fileName = `not_placed_students_list_${new Date().toISOString().split('T')[0]}.pdf`;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Error exporting not placed students list:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerStudent,
  registerStaff,
  getAllStudents,
  getAllStaff,
  getStudentById,
  getStaffById,
  updateStudent,
  updateStaff,
  deleteStudent,
  deleteStaff,
  getPlacedStudents,
  getNotPlacedStudents,
  getDashboardStats,
  exportStudentResumes,
  exportPlacedStudentResumes,
  exportNotPlacedStudentResumes,
  exportPlacedStudentsList,
  exportNotPlacedStudentsList
};
