const Feedback = require('../models/Feedback');
const Student = require('../models/Student');

// @desc    Submit placement feedback
// @route   POST /api/feedback/upload
// @access  Private (Student)
const submitFeedback = async (req, res) => {
  try {
    const student = await Student.findById(req.user._id);

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    if (student.placementStatus !== 'Placed') {
      return res.status(400).json({ message: 'Only placed students can submit feedback' });
    }

    // Check if student has already submitted feedback
    const existingFeedback = await Feedback.findOne({ student: req.user._id });
    if (existingFeedback) {
      return res.status(400).json({ message: 'Feedback already submitted. Each student can submit only one feedback.' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Feedback document is required' });
    }

    const feedback = await Feedback.create({
      student: req.user._id,
      companyName: req.body.companyName,
      jobRole: req.body.role,
      ctc: parseFloat(req.body.package) || 0,
      placementDate: new Date(),
      feedbackDocument: req.file.path,
      status: 'Submitted'
    });

    res.status(201).json({ message: 'Feedback submitted successfully', feedback });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// @desc    Get student's feedback status
// @route   GET /api/feedback
// @access  Private (Student)
const getFeedbackStatus = async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ student: req.user._id }).sort({ submittedDate: -1 });

    if (feedbacks.length === 0) {
      return res.json({ status: 'Not Submitted', feedbacks: [] });
    }

    res.json({
      status: 'Submitted',
      feedbacks: feedbacks
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all feedbacks (Admin/Staff)
// @route   GET /api/feedbacks
// @access  Private (Admin/Staff)
const getAllFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find({})
      .populate('student', 'fullName username department collegeEmail placementStatus')
      .sort({ submittedDate: -1 });

    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Export feedbacks as PDF
// @route   GET /api/feedbacks/export
// @access  Private (Admin/Staff)
const exportFeedbacksPDF = async (req, res) => {
  try {
    const feedbacks = await Feedback.find({})
      .populate('student', 'fullName username department collegeEmail placementStatus')
      .sort({ submittedDate: -1 });

    const { generateFeedbacksPDF } = require('../utils/pdfGenerator');
    const filename = `feedbacks_${Date.now()}.pdf`;
    const filePath = await generateFeedbacksPDF(feedbacks, filename);

    res.download(filePath, filename, (err) => {
      if (err) {
        console.error('Error downloading file:', err);
        res.status(500).json({ message: 'Error downloading file' });
      }
      // Optionally delete the file after download
      // fs.unlinkSync(filePath);
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get feedback by ID
// @route   GET /api/feedbacks/:id
// @access  Private (Admin/Staff)
const getFeedbackById = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id)
      .populate('student', 'fullName username department collegeEmail');

    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    res.json(feedback);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify feedback
// @route   PUT /api/feedbacks/:id/verify
// @access  Private (Admin/Staff)
const verifyFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    feedback.status = 'Verified';
    await feedback.save();

    res.json({ message: 'Feedback verified successfully', feedback });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get pending feedbacks (for reminders)
// @route   GET /api/feedbacks/pending
// @access  Private (Admin/Staff)
const getPendingFeedbacks = async (req, res) => {
  try {
    const pendingFeedbacks = await Feedback.find({
      status: 'Pending',
      $expr: { $gt: [new Date(), { $add: ['$placementDate', 3 * 24 * 60 * 60 * 1000] }] } // 3 days after placement
    }).populate('student', 'fullName collegeEmail');

    res.json(pendingFeedbacks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get feedbacks by student
// @route   GET /api/feedbacks/student/:studentId
// @access  Private (Admin/Staff)
const getFeedbacksByStudent = async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ student: req.params.studentId })
      .sort({ submittedDate: -1 });

    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update feedback
// @route   PUT /api/feedback/:id
// @access  Private (Student)
const updateFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    if (feedback.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this feedback' });
    }

    feedback.companyName = req.body.companyName || feedback.companyName;
    feedback.jobRole = req.body.role || feedback.jobRole;
    feedback.ctc = parseFloat(req.body.package) || feedback.ctc;

    if (req.file) {
      feedback.feedbackDocument = req.file.path;
    }

    await feedback.save();
    res.json({ message: 'Feedback updated successfully', feedback });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Download feedback document
// @route   GET /api/feedbacks/:id/download
// @access  Private (Admin/Staff)
const downloadFeedbackDocument = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    if (!feedback.feedbackDocument) {
      return res.status(404).json({ message: 'No document attached to this feedback' });
    }

    const filePath = feedback.feedbackDocument;
    const fs = require('fs');
    const path = require('path');

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'File not found on server' });
    }

    // Send the file
    res.download(filePath, path.basename(filePath), (err) => {
      if (err) {
        console.error('Error downloading file:', err);
        res.status(500).json({ message: 'Error downloading file' });
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete feedback
// @route   DELETE /api/feedback/:id
// @access  Private (Student/Admin)
const deleteFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    // Allow student to delete their own feedback or admin to delete any
    if (req.user.role !== 'admin' && feedback.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this feedback' });
    }

    await Feedback.findByIdAndDelete(req.params.id);
    res.json({ message: 'Feedback deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
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
};
