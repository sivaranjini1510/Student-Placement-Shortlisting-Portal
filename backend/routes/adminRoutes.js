const express = require('express');
const router = express.Router();
const { login } = require('../controllers/authController');
const {
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
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

// @route   POST /api/admin/login
// @desc    Admin login
// @access  Public
router.post('/login', login);

// Protect all routes
router.use(protect);

// Admin-only routes
// @route   GET /api/admin/dashboard
// @desc    Get admin dashboard statistics
// @access  Private/Admin
router.get('/dashboard', authorize('admin'), getDashboardStats);

// Student Management Routes
// @route   POST /api/admin/create-student
// @desc    Register a new student
// @access  Private/Admin
router.post('/create-student', authorize('admin'), registerStudent);

// @route   GET /api/admin/students
// @desc    Get all students
// @access  Private/Admin
router.get('/students', authorize('admin'), getAllStudents);

// @route   PUT /api/admin/student/:id
// @desc    Update student
// @access  Private/Admin
router.put('/student/:id', authorize('admin'), updateStudent);

// @route   DELETE /api/admin/student/:id
// @desc    Delete student
// @access  Private/Admin
router.delete('/student/:id', authorize('admin'), deleteStudent);

// Staff Management Routes
// @route   POST /api/admin/create-staff
// @desc    Register a new staff member
// @access  Private/Admin
router.post('/create-staff', authorize('admin'), registerStaff);

// @route   GET /api/admin/staff
// @desc    Get all staff members
// @access  Private/Admin
router.get('/staff', authorize('admin'), getAllStaff);

// @route   PUT /api/admin/staff/:id
// @desc    Update staff member
// @access  Private/Admin
router.put('/staff/:id', authorize('admin'), updateStaff);

// @route   DELETE /api/admin/staff/:id
// @desc    Delete staff member
// @access  Private/Admin
router.delete('/staff/:id', authorize('admin'), deleteStaff);

// Admin and Staff routes
// @route   GET /api/admin/placed-students
// @desc    Get placed students
// @access  Private/Admin/Staff
router.get('/placed-students', authorize('staff', 'admin'), getPlacedStudents);

// @route   GET /api/admin/not-placed-students
// @desc    Get not placed students
// @access  Private/Admin/Staff
router.get('/not-placed-students', authorize('staff', 'admin'), getNotPlacedStudents);

// @route   GET /api/admin/export-resumes
// @desc    Export student resumes as ZIP
// @access  Private/Admin/Staff
router.get('/export-resumes', authorize('staff', 'admin'), exportStudentResumes);

// @route   GET /api/admin/export-placed-resumes
// @desc    Export placed student resumes as ZIP
// @access  Private/Admin/Staff
router.get('/export-placed-resumes', authorize('staff', 'admin'), exportPlacedStudentResumes);

// @route   GET /api/admin/export-not-placed-resumes
// @desc    Export not placed student resumes as ZIP
// @access  Private/Admin/Staff
router.get('/export-not-placed-resumes', authorize('staff', 'admin'), exportNotPlacedStudentResumes);

// @route   GET /api/admin/export-placed-students-list
// @desc    Export placed students list as PDF
// @access  Private/Admin/Staff
router.get('/export-placed-students-list', authorize('staff', 'admin'), exportPlacedStudentsList);

// @route   GET /api/admin/export-not-placed-students-list
// @desc    Export not placed students list as PDF
// @access  Private/Admin/Staff
router.get('/export-not-placed-students-list', authorize('staff', 'admin'), exportNotPlacedStudentsList);

module.exports = router;
