const Student = require('../models/Student');
const Feedback = require('../models/Feedback');
const Company = require('../models/Company');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf' || file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and image files are allowed'));
    }
  }
});

// @desc    Get student profile
// @route   GET /api/students/profile
// @access  Private (Student only)
const getProfile = async (req, res) => {
  try {
    const student = await Student.findById(req.user._id).select('-password');
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const student = await Student.findById(req.user._id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Handle file uploads
    let profilePhotoPath = null;
    let resumePath = null;

    if (req.files) {
      if (req.files.profilePhoto && req.files.profilePhoto[0]) {
        profilePhotoPath = req.files.profilePhoto[0].path;
      }
      if (req.files.resume && req.files.resume[0]) {
        resumePath = req.files.resume[0].path;
      }
    }

    // Build updateData conditionally to only update provided fields
    const updateData = {};

    if (req.body.fullName !== undefined && req.body.fullName.trim() !== '') updateData.fullName = req.body.fullName;
    if (req.body.degree !== undefined && req.body.degree.trim() !== '') updateData.degree = req.body.degree;
    if (req.body.department !== undefined && req.body.department.trim() !== '') updateData.department = req.body.department;
    if (req.body.gender !== undefined && req.body.gender.trim() !== '') updateData.gender = req.body.gender;
    if (req.body.tutorName !== undefined && req.body.tutorName.trim() !== '') updateData.tutorName = req.body.tutorName;

    if (req.body.dob !== undefined && req.body.dob.trim() !== '') {
      const date = new Date(req.body.dob);
      if (!isNaN(date.getTime())) {
        updateData.dateOfBirth = date;
      }
    }

    if (req.body.studentContact !== undefined && req.body.studentContact.trim() !== '') updateData.studentContact = req.body.studentContact;
    if (req.body.collegeEmail !== undefined && req.body.collegeEmail.trim() !== '') updateData.collegeEmail = req.body.collegeEmail;
    if (req.body.personalEmail !== undefined && req.body.personalEmail.trim() !== '') updateData.personalEmail = req.body.personalEmail;

    // SSLC
    if ((req.body.sslcPercentage !== undefined && req.body.sslcPercentage !== '') ||
        (req.body.sslcSchoolName !== undefined && req.body.sslcSchoolName.trim() !== '') ||
        (req.body.sslcMedium !== undefined && req.body.sslcMedium !== '' && req.body.sslcMedium !== 'Medium of Study') ||
        (req.body.sslcBoard !== undefined && req.body.sslcBoard.trim() !== '') ||
        (req.body.sslcYear !== undefined && req.body.sslcYear !== '')) {
      updateData.sslc = {};
      if (req.body.sslcPercentage !== undefined && req.body.sslcPercentage !== '') updateData.sslc.percentage = parseFloat(req.body.sslcPercentage);
      if (req.body.sslcSchoolName !== undefined && req.body.sslcSchoolName.trim() !== '') updateData.sslc.schoolName = req.body.sslcSchoolName;
      if (req.body.sslcMedium !== undefined && req.body.sslcMedium !== '' && req.body.sslcMedium !== 'Medium of Study') updateData.sslc.medium = req.body.sslcMedium;
      if (req.body.sslcBoard !== undefined && req.body.sslcBoard.trim() !== '') updateData.sslc.board = req.body.sslcBoard;
      if (req.body.sslcYear !== undefined && req.body.sslcYear !== '') updateData.sslc.yearOfPassing = parseInt(req.body.sslcYear);
    }

    // HSC
    if ((req.body.hscPercentage !== undefined && req.body.hscPercentage !== '') ||
        (req.body.hscCutoff !== undefined && req.body.hscCutoff !== '') ||
        (req.body.hscYear !== undefined && req.body.hscYear !== '') ||
        (req.body.hscSchoolName !== undefined && req.body.hscSchoolName.trim() !== '') ||
        (req.body.hscMedium !== undefined && req.body.hscMedium !== '' && req.body.hscMedium !== 'Medium of Study') ||
        (req.body.hscBoard !== undefined && req.body.hscBoard.trim() !== '')) {
      updateData.hsc = {};
      if (req.body.hscPercentage !== undefined && req.body.hscPercentage !== '') updateData.hsc.percentage = parseFloat(req.body.hscPercentage);
      if (req.body.hscCutoff !== undefined && req.body.hscCutoff !== '') updateData.hsc.cutoffMarks = parseFloat(req.body.hscCutoff);
      if (req.body.hscYear !== undefined && req.body.hscYear !== '') updateData.hsc.yearOfPassing = parseInt(req.body.hscYear);
      if (req.body.hscSchoolName !== undefined && req.body.hscSchoolName.trim() !== '') updateData.hsc.schoolName = req.body.hscSchoolName;
      if (req.body.hscMedium !== undefined && req.body.hscMedium !== '' && req.body.hscMedium !== 'Medium of Study') updateData.hsc.medium = req.body.hscMedium;
      if (req.body.hscBoard !== undefined && req.body.hscBoard.trim() !== '') updateData.hsc.board = req.body.hscBoard;
    }

    // Diploma is optional - only include if any diploma fields are provided
    const hasDiplomaData = req.body.diplomaPercentage !== undefined || req.body.diplomaYear !== undefined || req.body.diplomaCollegeName !== undefined || req.body.diplomaQuota !== undefined;
    if (hasDiplomaData) {
      updateData.diploma = {
        percentage: req.body.diplomaPercentage ? parseFloat(req.body.diplomaPercentage) : (student.diploma ? student.diploma.percentage : null),
        yearOfPassing: req.body.diplomaYear ? parseInt(req.body.diplomaYear) : (student.diploma ? student.diploma.yearOfPassing : null),
        collegeName: req.body.diplomaCollegeName || (student.diploma ? student.diploma.collegeName : null),
        quota: (req.body.diplomaQuota && req.body.diplomaQuota !== 'Quota of Admission') ? req.body.diplomaQuota : (student.diploma ? student.diploma.quota : null)
      };
    }

    updateData.semesterGPA = [...(student.semesterGPA || [])];
    updateData.cgpa = req.body.cgpa ? parseFloat(req.body.cgpa) : student.cgpa;
    updateData.degreeYearOfPassing = req.body.degreeYearOfPassing ? parseInt(req.body.degreeYearOfPassing) : student.degreeYearOfPassing;
    updateData.arrears = req.body.arrears || student.arrears;
    updateData.keySkills = req.body.keySkills ? req.body.keySkills.split(',').map(skill => skill.trim()).filter(skill => skill) : student.keySkills;
    updateData.aadhaarNumber = req.body.aadhaarNumber || student.aadhaarNumber;
    updateData.panNumber = req.body.panNumber || student.panNumber;
    updateData.bloodGroup = req.body.bloodGroup || student.bloodGroup;
    updateData.accommodation = (req.body.accommodation && req.body.accommodation !== 'Hostel / Day Scholar') ? req.body.accommodation : student.accommodation;
    updateData.father = {
      name: req.body.fatherName || (student.father ? student.father.name : null),
      occupation: req.body.fatherOccupation || (student.father ? student.father.occupation : null),
      annualIncome: req.body.fatherAnnualIncome ? parseFloat(req.body.fatherAnnualIncome) : (student.father ? student.father.annualIncome : null),
      contactNumber: req.body.fatherContact || (student.father ? student.father.contactNumber : null)
    };
    updateData.mother = {
      name: req.body.motherName || (student.mother ? student.mother.name : null),
      occupation: req.body.motherOccupation || (student.mother ? student.mother.occupation : null),
      annualIncome: req.body.motherAnnualIncome ? parseFloat(req.body.motherAnnualIncome) : (student.mother ? student.mother.annualIncome : null),
      contactNumber: req.body.motherContact || (student.mother ? student.mother.contactNumber : null)
    };
    updateData.address = {
      permanentAddress: req.body.permanentAddress || (student.address ? student.address.permanentAddress : null),
      city: req.body.city || (student.address ? student.address.city : null),
      district: req.body.district || (student.address ? student.address.district : null),
      pincode: req.body.pincode || (student.address ? student.address.pincode : null),
      state: req.body.state || (student.address ? student.address.state : null),
      nativePlace: req.body.nativePlace || (student.address ? student.address.nativePlace : null)
    };
    updateData.githubProfile = req.body.githubProfile || student.githubProfile;
    updateData.linkedinProfile = req.body.linkedinProfile || student.linkedinProfile;

    if (profilePhotoPath) updateData.profilePhoto = profilePhotoPath;
    if (resumePath) updateData.resume = resumePath;

    // Set profileCompleted to true if not already
    if (!student.profileCompleted) {
      updateData.profileCompleted = true;
    }

    // Handle semester GPAs - update or add
    for (let i = 1; i <= 8; i++) {
      const gpaField = `sem${i}GPA`;
      if (req.body[gpaField] !== undefined) {
        const gpa = parseFloat(req.body[gpaField]);
        if (!isNaN(gpa)) {
          const existingIndex = updateData.semesterGPA.findIndex(s => s.semester === i);
          if (existingIndex > -1) {
            updateData.semesterGPA[existingIndex].gpa = gpa;
          } else {
            updateData.semesterGPA.push({ semester: i, gpa: gpa });
          }
        }
      }
    }

    // Remove undefined fields to avoid overwriting with null (skip nested objects)
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      } else if (typeof updateData[key] === 'object' && updateData[key] !== null && !Array.isArray(updateData[key])) {
        // Clean nested objects recursively for undefined values
        Object.keys(updateData[key]).forEach(nestedKey => {
          if (updateData[key][nestedKey] === undefined || updateData[key][nestedKey] === null || updateData[key][nestedKey] === '') {
            delete updateData[key][nestedKey];
          }
        });
        // If nested object is now empty and not required structure, delete
        if (Object.keys(updateData[key]).length === 0 && !['sslc', 'hsc', 'diploma', 'arrears', 'father', 'mother', 'address'].includes(key)) {
          delete updateData[key];
        }
      }
    });

    // If no data to update, return current profile
    if (Object.keys(updateData).length === 0 && Object.keys(req.body).length === 0 && !profilePhotoPath && !resumePath) {
      return res.json(student.select('-password'));
    }

    const updatedStudent = await Student.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    res.json(updatedStudent);
  } catch (error) {
    console.error('Update profile error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error: ' + Object.values(error.errors).map(e => e.message).join(', ') });
    }
    res.status(500).json({ message: error.message });
  }
};

// @desc    Upload profile photo
// @route   POST /api/students/upload-photo
// @access  Private (Student only)
const uploadProfilePhoto = async (req, res) => {
  try {
    upload.single('photo')(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: err.message });
      }

      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      const photoPath = req.file.path;
      await Student.findByIdAndUpdate(req.user._id, { profilePhoto: photoPath });

      res.json({ message: 'Profile photo uploaded successfully', photoPath });
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Upload resume
// @route   POST /api/students/upload-resume
// @access  Private (Student only)
const uploadResume = async (req, res) => {
  try {
    upload.single('resume')(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: err.message });
      }

      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      const resumePath = req.file.path;
      await Student.findByIdAndUpdate(req.user._id, { resume: resumePath });

      res.json({ message: 'Resume uploaded successfully', resumePath });
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Submit placement feedback
// @route   POST /api/students/feedback
// @access  Private (Student only)
const submitFeedback = async (req, res) => {
  try {
    const student = await Student.findById(req.user._id);
    if (!student || student.placementStatus !== 'Placed') {
      return res.status(400).json({ message: 'Student not placed or not found' });
    }

    upload.single('feedback')(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: err.message });
      }

      if (!req.file) {
        return res.status(400).json({ message: 'No feedback file uploaded' });
      }

      const feedbackDocument = req.file.path;

      // Create feedback record
      const feedback = await Feedback.create({
        student: req.user._id,
        companyName: student.placedCompany,
        jobRole: req.body.jobRole,
        ctc: req.body.ctc,
        placementDate: student.placementDate,
        feedbackDocument,
        status: 'Submitted'
      });

      // Update student placement status if needed
      await Student.findByIdAndUpdate(req.user._id, {
        placementStatus: 'Placed' // Ensure it's marked as placed
      });

      res.status(201).json({
        message: 'Feedback submitted successfully',
        feedback
      });
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get feedback status
// @route   GET /api/students/feedback
// @access  Private (Student only)
const getFeedbackStatus = async (req, res) => {
  try {
    const feedback = await Feedback.findOne({ student: req.user._id })
      .sort({ createdAt: -1 });

    if (!feedback) {
      return res.json({ status: 'Not Submitted' });
    }

    res.json({
      status: feedback.status,
      submittedDate: feedback.submittedDate,
      deadline: feedback.deadline,
      isOverdue: feedback.isOverdue
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    View student resume inline (no download)
// @route   GET /api/students/resume
// @access  Private (Student only)
const viewResume = async (req, res) => {
  try {
    const student = await Student.findById(req.user._id);
    if (!student || !student.resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    const resumePath = path.join(__dirname, '..', student.resume);
    if (!fs.existsSync(resumePath)) {
      return res.status(404).json({ message: 'Resume file not found' });
    }

    // Set headers to display inline instead of download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="' + path.basename(student.resume) + '"');

    // Stream the file
    const fileStream = fs.createReadStream(resumePath);
    fileStream.pipe(res);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get available companies
// @route   GET /api/students/companies
// @access  Private (Student only)
const getCompanies = async (req, res) => {
  try {
    const companies = await Company.find({ status: { $in: ['Upcoming', 'Active'] } })
      .populate('createdBy', 'fullName department')
      .sort({ driveDate: 1 });

    res.json(companies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



module.exports = {
  getProfile,
  updateProfile,
  uploadProfilePhoto,
  uploadResume,
  submitFeedback,
  getFeedbackStatus,
  viewResume,
  getCompanies
};
