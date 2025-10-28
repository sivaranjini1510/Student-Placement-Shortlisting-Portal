const express = require('express');
const router = express.Router();
const { bulkUploadStudents, bulkUploadStaff } = require('../controllers/bulkUploadController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { uploadFile } = require('../middleware/uploadMiddleware');

// Protect all routes
router.use(protect);

// Bulk Upload Routes
// @route   POST /api/admin/bulk-upload/students
// @desc    Bulk upload students from CSV/Excel
// @access  Private/Admin
router.post('/bulk-upload/students', authorize('admin'), uploadFile('file', ['text/csv', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'], 10), bulkUploadStudents);

// @route   POST /api/admin/bulk-upload/staff
// @desc    Bulk upload staff from CSV/Excel
// @access  Private/Admin
router.post('/bulk-upload/staff', authorize('admin'), uploadFile('file', ['text/csv', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'], 10), bulkUploadStaff);

module.exports = router;
