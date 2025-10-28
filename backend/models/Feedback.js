const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  // Student Reference
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },

  // Placement Details
  companyName: {
    type: String,
    required: true,
    trim: true
  },
  jobRole: {
    type: String,
    required: true,
    trim: true
  },
  ctc: {
    type: Number,
    required: true
  },
  placementDate: {
    type: Date,
    required: true
  },

  // Feedback Document
  feedbackDocument: {
    type: String, // File path or URL
    required: true
  },

  // Submission Details
  submittedDate: {
    type: Date,
    default: Date.now
  },
  remindersSent: {
    type: Number,
    default: 0
  },
  lastReminderDate: {
    type: Date
  },

  // Status
  status: {
    type: String,
    enum: ['Pending', 'Submitted', 'Verified'],
    default: 'Pending'
  },

  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Create deadline field (3 days from placement date)
feedbackSchema.virtual('deadline').get(function() {
  const deadline = new Date(this.placementDate);
  deadline.setDate(deadline.getDate() + 3);
  return deadline;
});

// Check if feedback is overdue
feedbackSchema.virtual('isOverdue').get(function() {
  return this.status === 'Pending' && new Date() > this.deadline;
});

module.exports = mongoose.model('Feedback', feedbackSchema);