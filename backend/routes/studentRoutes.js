const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  uploadProfilePhoto,
  uploadResume,
  submitFeedback,
  getFeedbackStatus,
  viewResume,
  getCompanies
} = require('../controllers/studentController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { uploadFile } = require('../middleware/uploadMiddleware');

// Protect all routes and authorize only students
router.use(protect);
router.use(authorize('student', 'admin'));

// @route   GET /api/student/profile
// @desc    Get student profile
// @access  Private/Student
router.get('/profile', getProfile);

const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for profile update
const profileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath;
    if (file.fieldname === 'profilePhoto') {
      uploadPath = 'uploads/photos/';
    } else if (file.fieldname === 'resume') {
      uploadPath = 'uploads/resumes/';
    } else {
      uploadPath = 'uploads/';
    }
    // Ensure directory exists
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const profileUpload = multer({
  storage: profileStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'profilePhoto' && file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else if (file.fieldname === 'resume' && (file.mimetype === 'application/pdf' || file.mimetype === 'application/msword' || file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type for ' + file.fieldname));
    }
  }
});

// @route   PUT /api/student/profile
// @desc    Update student profile
// @access  Private/Student
router.put('/profile', profileUpload.fields([
  { name: 'profilePhoto', maxCount: 1 },
  { name: 'resume', maxCount: 1 }
]), updateProfile);

// @route   POST /api/student/photo
// @desc    Upload/Update profile photo
// @access  Private/Student
router.post('/photo', uploadFile('photo', 'jpg,jpeg,png', 2), uploadProfilePhoto);

// @route   POST /api/student/resume
// @desc    Upload/Update resume
// @access  Private/Student
router.post('/resume', uploadFile('resume', 'pdf,doc,docx', 5), uploadResume);

// @route   POST /api/student/feedback
// @desc    Submit placement feedback
// @access  Private/Student
router.post('/feedback', uploadFile('feedback', 'pdf,doc,docx', 5), submitFeedback);

// @route   GET /api/student/feedback
// @desc    Get feedback status
// @access  Private/Student
router.get('/feedback', getFeedbackStatus);

// @route   GET /api/student/resume
// @desc    View student resume inline
// @access  Private/Student
router.get('/resume', viewResume);

// @route   GET /api/student/companies
// @desc    Get available companies
// @access  Private/Student
router.get('/companies', getCompanies);

module.exports = router;
