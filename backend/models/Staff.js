const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const staffSchema = new mongoose.Schema({
  // Authentication
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: 'staff'
  },

  // Basic Information
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  dateOfBirth: {
    type: Date,
    required: false, // Allow null for invalid dates
    set: function (date) {
      // Accepts DD/MM/YYYY or Date
      if (date instanceof Date) return date;
      if (typeof date === 'string' && date.includes('/')) {
        const [day, month, year] = date.split('/').map(num => parseInt(num, 10));
        // Create date at midnight local time to avoid timezone conversion issues
        const d = new Date();
        d.setFullYear(year, month - 1, day);
        d.setHours(0, 0, 0, 0);
        return d;
      }
      return new Date(date);
    },
    get: function (date) {
      if (!date) return null;
      const d = new Date(date);
      return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
    }
  },
  department: {
    type: String,
    required: true,
    enum: ['CSE', 'ECE', 'IT', 'AI&DS', 'MECH', 'CIVIL', 'EEE', 'Placement Cell']
  },
  contactNumber: {
    type: String,
    required: true,
    match: /^[0-9]{10}$/
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  designation: {
    type: String,
    required: true
  },
}, {
  timestamps: true,
  toJSON: { getters: true },
  toObject: { getters: true }
});


// 🔒 Hash password before saving
staffSchema.pre('save', async function (next) {
  if (!this.isModified('password') || this.skipHash) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});


// 🔒 Hash password for update operations (if applicable)
staffSchema.pre(['updateOne', 'findOneAndUpdate'], async function (next) {
  const update = this.getUpdate();
  if (update && update.$set && update.$set.password && !update.$set.skipHash) {
    const salt = await bcrypt.genSalt(10);
    update.$set.password = await bcrypt.hash(update.$set.password, salt);
  }
  next();
});


// ✅ Password comparison method (for login)
staffSchema.methods.matchPassword = async function(enteredPassword) {
  try {
    console.log("Using Staff model password validation");

    // Check if a hashed password exists
    if (this.password && this.password.startsWith("$2a$")) {
      return await bcrypt.compare(enteredPassword, this.password);
    }

    // Safely handle DOB-based password validation
    let dobDate = null;

    // Convert DOB to valid Date object
    if (this.dateOfBirth instanceof Date) {
      dobDate = this.dateOfBirth;
    } else if (this.dateOfBirth) {
      dobDate = new Date(this.dateOfBirth);
    }

    // Check for valid DOB
    if (!dobDate || isNaN(dobDate)) {
      console.log("⚠️ DOB invalid or null for user:", this.username, "Raw value:", this.dateOfBirth);
      return false;
    }

    // Format DOB as DD/MM/YYYY
    const formattedDOB = `${dobDate.getDate().toString().padStart(2, '0')}/${(dobDate.getMonth() + 1)
      .toString().padStart(2, '0')}/${dobDate.getFullYear()}`;

    console.log("Expected DOB password:", formattedDOB);
    console.log("Entered password:", enteredPassword);
    console.log("DOB date object:", dobDate);
    console.log("DOB date components - day:", dobDate.getDate(), "month:", dobDate.getMonth() + 1, "year:", dobDate.getFullYear());

    // Compare entered password with DOB
    const match = enteredPassword === formattedDOB;
    console.log("Password match result:", match);
    return match;
  } catch (err) {
    console.error("Error in Staff.matchPassword:", err);
    return false;
  }
};


// ✅ Helper (for bulk upload)
// Convert DOB (DD/MM/YYYY) → hashed password
staffSchema.statics.generateHashedPassword = async function (dobString) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(dobString, salt);
};


module.exports = mongoose.model('Staff', staffSchema);
