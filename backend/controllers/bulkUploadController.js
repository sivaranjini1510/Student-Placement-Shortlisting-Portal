const Student = require('../models/Student');
const Staff = require('../models/Staff');
const { parseFile, validateStudentData, validateStaffData } = require('../utils/bulkUploadParser');
const { sendEmail } = require('../utils/emailService');
const fs = require('fs');
const path = require('path');

// @desc    Bulk upload students
// @route   POST /api/admin/bulk-upload/students
// @access  Private (Admin only)
const bulkUploadStudents = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const filePath = req.file.path;

    // Parse the file
    const rawData = await parseFile(filePath);

    // Validate the data
    const { validData, errors } = validateStudentData(rawData);

    if (validData.length === 0) {
      // Clean up uploaded file
      fs.unlinkSync(filePath);
      return res.status(400).json({
        message: 'No valid data found in the file',
        errors
      });
    }

    // Check for duplicates
    const usernames = validData.map(item => item.username);
    const collegeEmails = validData.map(item => item.collegeEmail);

    const existingUsers = await Student.find({
      $or: [
        { username: { $in: usernames } },
        { collegeEmail: { $in: collegeEmails } }
      ]
    });

    const duplicateUsernames = existingUsers.map(user => user.username);
    const duplicateEmails = existingUsers.map(user => user.collegeEmail);

    // Filter out duplicates
    const filteredData = validData.filter(item =>
      !duplicateUsernames.includes(item.username) &&
      !duplicateEmails.includes(item.collegeEmail)
    );

    const duplicates = validData.filter(item =>
      duplicateUsernames.includes(item.username) ||
      duplicateEmails.includes(item.collegeEmail)
    );

    console.log('Bulk upload stats:');
    console.log('Total parsed rows:', rawData.length);
    console.log('Valid data after validation:', validData.length);
    console.log('Duplicates found:', duplicates.length);
    console.log('Filtered data (non-duplicates):', filteredData.length);
    console.log('Validation errors:', errors.length);
    console.log('Duplicates details:', duplicates.map(d => ({ username: d.username, collegeEmail: d.collegeEmail })));
    console.log('First 5 errors:', errors.slice(0, 5));

    if (filteredData.length === 0) {
      // Clean up uploaded file
      fs.unlinkSync(filePath);
      return res.status(400).json({
        message: 'All records are duplicates',
        duplicates: duplicates.map(d => ({ username: d.username, collegeEmail: d.collegeEmail }))
      });
    }

    // Prepare data for insertion
    const studentsToInsert = filteredData.map(student => {
      const dob = new Date(student.dateOfBirth);
      // Store only the date part, removing time component
      const normalizedDob = new Date(dob.getFullYear(), dob.getMonth(), dob.getDate());
      
      return {
        ...student,
        dateOfBirth: normalizedDob
      };
    });

    // Create students. The Student model hashes passwords in a pre-save hook,
    // so we should pass the plain DOB-derived password here and let the model
    // handle hashing exactly once.
    const insertedStudents = await Promise.all(
      studentsToInsert.map(async (studentData) => {
        const student = new Student({
          ...studentData,
          // password is plain (e.g. DD/MM/YYYY) here; model will hash it
          password: studentData.password
        });
        return await student.save();
      })
    );



    // Clean up uploaded file
    fs.unlinkSync(filePath);

    res.status(201).json({
      message: `Successfully uploaded ${insertedStudents.length} students`,
      successful: insertedStudents.length,
      failed: errors.length + duplicates.length,
      errors: errors.slice(0, 10), // Limit errors shown
      duplicates: duplicates.slice(0, 10) // Limit duplicates shown
    });

  } catch (error) {
    console.error('Bulk upload error:', error);

    // Clean up uploaded file if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({ message: error.message });
  }
};

// @desc    Bulk upload staff
// @route   POST /api/admin/bulk-upload/staff
// @access  Private (Admin only)
const bulkUploadStaff = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const filePath = req.file.path;

    // Parse the file
    const rawData = await parseFile(filePath);

    // Validate the data
    const { validData, errors } = validateStaffData(rawData);

    if (validData.length === 0) {
      // Clean up uploaded file
      fs.unlinkSync(filePath);
      return res.status(400).json({
        message: 'No valid data found in the file',
        errors
      });
    }

    // Check for duplicates
    const usernames = validData.map(item => item.username);
    const emails = validData.map(item => item.email);

    const existingUsers = await Staff.find({
      $or: [
        { username: { $in: usernames } },
        { email: { $in: emails } }
      ]
    });

    const duplicateUsernames = existingUsers.map(user => user.username);
    const duplicateEmails = existingUsers.map(user => user.email);

    // Filter out duplicates
    const filteredData = validData.filter(item =>
      !duplicateUsernames.includes(item.username) &&
      !duplicateEmails.includes(item.email)
    );

    const duplicates = validData.filter(item =>
      duplicateUsernames.includes(item.username) ||
      duplicateEmails.includes(item.email)
    );

    if (filteredData.length === 0) {
      // Clean up uploaded file
      fs.unlinkSync(filePath);
      return res.status(400).json({
        message: 'All records are duplicates',
        duplicates: duplicates.map(d => ({ username: d.username, email: d.email }))
      });
    }

    // Prepare data for insertion
    const staffToInsert = filteredData.map(staff => {
      const dob = new Date(staff.dateOfBirth);
      // Store only the date part, removing time component
      const normalizedDob = new Date(dob.getFullYear(), dob.getMonth(), dob.getDate());

      return {
        ...staff,
        dateOfBirth: normalizedDob
      };
    });

    // Create staff members. Let the Staff model hash passwords via its
    // pre-save hook to avoid double-hashing.
    const insertedStaff = await Promise.all(
      staffToInsert.map(async (staffData) => {
        const staff = new Staff({
          ...staffData,
          password: staffData.password
        });
        return await staff.save();
      })
    );

    // Welcome emails disabled as requested
    // Staff will receive login credentials through other means

    // Clean up uploaded file
    fs.unlinkSync(filePath);

    res.status(201).json({
      message: `Successfully uploaded ${insertedStaff.length} staff members`,
      successful: insertedStaff.length,
      failed: errors.length + duplicates.length,
      errors: errors.slice(0, 10), // Limit errors shown
      duplicates: duplicates.slice(0, 10) // Limit duplicates shown
    });

  } catch (error) {
    console.error('Bulk upload error:', error);

    // Clean up uploaded file if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  bulkUploadStudents,
  bulkUploadStaff
};
