const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  // Company Details
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
  jobDescription: {
    type: String,
    trim: true
  },
  ctc: {
    type: Number,
    required: true
  },
  location: {
    type: String,
    trim: true
  },

  // Eligibility Criteria
  criteria: {
    departments: [{
      type: String,
      enum: ['CSE', 'ECE', 'IT', 'AI&DS', 'MECH', 'CIVIL', 'EEE']
    }],
    minCGPA: {
      type: Number,
      required: true,
      min: 0,
      max: 10
    },
    minSSLC: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    minHSC: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    allowedArrears: [{
      type: String,
      enum: ['No Backlog', 'Active Backlog', 'History of Arrears'],
      default: ['No Backlog', 'Active Backlog', 'History of Arrears']
    }],
    diplomaAllowed: {
      type: Boolean,
      default: true
    },
    requiredSkills: [{
      type: String,
      trim: true
    }],
    yearOfPassing: {
      type: Number
    }
  },

  // Drive Details
  driveDate: {
    type: Date,
    required: true
  },
  registrationDeadline: {
    type: Date,
    required: true
  },
  venue: {
    type: String
  },

  // Staff who created this drive
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff',
    required: true
  },

  // Shortlisted Students
  shortlistedStudents: [{
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student'
    },
    shortlistedDate: {
      type: Date,
      default: Date.now
    }
  }],

  // Drive Status
  status: {
    type: String,
    enum: ['Upcoming', 'Active', 'Completed', 'Cancelled'],
    default: 'Upcoming'
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

module.exports = mongoose.model('Company', companySchema);