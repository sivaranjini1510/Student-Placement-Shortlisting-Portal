const express = require('express');
const router = express.Router();
const {
  submitFeedback,
  getFeedbackStatus,
  getAllFeedbacks,
  exportFeedbacksPDF,
  getFeedbackById,
  verifyFeedback,
  getPendingFeedbacks,
  getFeedbacksByStudent,
  updateFeedback,
  downloadFeedbackDocument,
  deleteFeedback
} = require('../controllers/feedbackController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { uploadFile } = require('../middleware/uploadMiddleware');

// @route   POST /api/feedback/upload
// @desc    Upload placement feedback
// @access  Private/Student
router.post(
  '/upload',
  protect,
  authorize('student'),
  uploadFile('file', 'pdf', 10),
  submitFeedback
);

// @route   GET /api/feedback
// @desc    Get student's own feedback
// @access  Private/Student
router.get('/', protect, authorize('student'), getFeedbackStatus);

// @route   GET /api/feedback/all
// @desc    Get all feedbacks (for staff/admin)
// @access  Private/Staff/Admin
router.get('/all', protect, authorize('staff', 'admin'), getAllFeedbacks);

// @route   GET /api/feedback/export
// @desc    Export feedbacks as PDF
// @access  Private/Staff/Admin
router.get('/export', protect, authorize('staff', 'admin'), exportFeedbacksPDF);

// @route   PUT /api/feedback/:id
// @desc    Update feedback
// @access  Private/Student
router.put('/:id', protect, authorize('student'), uploadFile('file', 'pdf', 10), updateFeedback);

// @route   GET /api/feedbacks/:id
// @desc    Get feedback by ID
// @access  Private/Staff/Admin
router.get('/:id', protect, authorize('staff', 'admin'), getFeedbackById);

// @route   PUT /api/feedbacks/:id/verify
// @desc    Verify feedback
// @access  Private/Staff/Admin
router.put('/:id/verify', protect, authorize('staff', 'admin'), verifyFeedback);

// @route   GET /api/feedbacks/pending
// @desc    Get pending feedbacks
// @access  Private/Staff/Admin
router.get('/pending', protect, authorize('staff', 'admin'), getPendingFeedbacks);

// @route   GET /api/feedbacks/student/:studentId
// @desc    Get feedbacks by student
// @access  Private/Staff/Admin
router.get('/student/:studentId', protect, authorize('staff', 'admin'), getFeedbacksByStudent);

// @route   GET /api/feedbacks/:id/download
// @desc    Download feedback document
// @access  Private/Staff/Admin
router.get('/:id/download', protect, authorize('staff', 'admin'), downloadFeedbackDocument);

// @route   DELETE /api/feedback/:id
// @desc    Delete feedback
// @access  Private/Student/Admin
router.delete('/:id', protect, authorize('student', 'admin'), deleteFeedback);

module.exports = router;
