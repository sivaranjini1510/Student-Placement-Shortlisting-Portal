const express = require('express');
const router = express.Router();
const {
  createCompany,
  getCompanies,
  getCompany,
  filterStudents,
  getShortlist,
  downloadShortlist,
  getFeedbacks,
  getPlacedStudents,
  getNotPlacedStudents
} = require('../controllers/staffController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Protect all routes and authorize only staff
router.use(protect);
router.use(authorize('staff', 'admin'));

// @route   POST /api/staff/companies
// @desc    Create a new company drive
// @access  Private/Staff
router.post('/companies', createCompany);

// @route   GET /api/staff/companies
// @desc    Get all company drives
// @access  Private/Staff
router.get('/companies', getCompanies);

// @route   GET /api/staff/companies/:id
// @desc    Get a single company drive
// @access  Private/Staff
router.get('/companies/:id', getCompany);

// @route   POST /api/staff/filter
// @desc    Filter students based on company criteria
// @access  Private/Staff
router.post('/filter', filterStudents);

// @route   GET /api/staff/companies/:id/shortlisted
// @desc    Get shortlisted students for a drive
// @access  Private/Staff
router.get('/companies/:id/shortlisted', getShortlist);

// @route   GET /api/staff/companies/:id/download
// @desc    Download shortlisted students as PDF
// @access  Private/Staff
router.get('/companies/:id/download', downloadShortlist);

// @route   GET /api/staff/feedbacks
// @desc    View all placement feedbacks
// @access  Private/Staff
router.get('/feedbacks', getFeedbacks);

// @route   GET /api/staff/placed-students
// @desc    Get placed students
// @access  Private/Staff
router.get('/placed-students', getPlacedStudents);

// @route   GET /api/staff/not-placed-students
// @desc    Get not placed students
// @access  Private/Staff
router.get('/not-placed-students', getNotPlacedStudents);

module.exports = router;
