const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema({
  // Authentication
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    match: /^[^\s@]+@nec\.edu\.in$/
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: 'admin'
  },

  // Basic Information
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  dateOfBirth: {
    type: Date
  },
  contactNumber: {
    type: String,
    match: /^[0-9]{10}$/
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^[^\s@]+@nec\.edu\.in$/
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

// Hash password before saving
adminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (err) {
    return next(err);
  }
});

// Match password
adminSchema.methods.matchPassword = async function(enteredPassword) {
  // try bcrypt first (normal case)
  const bcryptMatch = await bcrypt.compare(enteredPassword, this.password);
  if (bcryptMatch) return true;

  // fallback to DOB-based password (for admin convenience in this deployment)
  if (this.dateOfBirth) {
    const dobDate = this.dateOfBirth instanceof Date ? this.dateOfBirth : new Date(this.dateOfBirth);
    if (!isNaN(dobDate.getTime())) {
      const formattedDOB = `${dobDate.getDate().toString().padStart(2, '0')}/${(dobDate.getMonth() + 1).toString().padStart(2, '0')}/${dobDate.getFullYear()}`;
      if (enteredPassword.trim() === formattedDOB) return true;
    }
  }

  return false;
};

module.exports = mongoose.model('Admin', adminSchema);