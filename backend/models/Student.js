const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const studentSchema = new mongoose.Schema({
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
    default: 'student'
  },
  
  // Basic Information
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  degree: {
    type: String,
    required: true,
    enum: ['B.E.', 'B.Tech', 'M.E.', 'M.Tech']
  },
  department: {
    type: String,
    required: true,
    enum: ['CSE', 'ECE', 'IT', 'AI&DS', 'MECH', 'CIVIL', 'EEE']
  },
  gender: {
    type: String,
    required: true,
    enum: ['Male', 'Female', 'Other']
  },
  tutorName: {
    type: String,
    trim: true
  },
  dateOfBirth: {
    type: Date,
    required: false // Allow null for invalid dates
  },
  studentContact: {
    type: String,
    required: true,
    match: /^[0-9]{10}$/
  },
  collegeEmail: {
    type: String,
    required: true,
    unique: true,
    match: /^[^\s@]+@nec\.edu\.in$/
  },
  personalEmail: {
    type: String,
    required: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },

  // SSLC (10th) Details
  sslc: {
    percentage: { type: Number, min: 0, max: 100 },
    schoolName: { type: String },
    medium: { type: String, enum: ['Tamil', 'English'] },
    board: { type: String, enum: ['State', 'Matric', 'CBSE'] },
    yearOfPassing: { type: Number }
  },

  // HSC (12th) Details
  hsc: {
    percentage: { type: Number, min: 0, max: 100 },
    cutoffMarks: { type: Number },
    yearOfPassing: { type: Number },
    schoolName: { type: String },
    medium: { type: String, enum: ['Tamil', 'English'] },
    board: { type: String, enum: ['State', 'Matric', 'CBSE'] }
  },

  // Diploma Details (Optional)
  diploma: {
    percentage: { type: Number, min: 0, max: 100 },
    yearOfPassing: { type: Number },
    collegeName: { type: String },
    quota: { type: String, enum: ['Government', 'Management'] }
  },

  // Academic Records
  semesterGPA: [{
    semester: { type: Number, required: true, min: 1, max: 8 },
    gpa: { type: Number, required: true, min: 0, max: 10 }
  }],
  cgpa: {
    type: Number,
    min: 0,
    max: 10
  },
  degreeYearOfPassing: {
    type: Number
  },
  arrears: {
    type: String,
    enum: ['No Backlog', 'Active Backlog', 'History of Arrears'],
    default: 'No Backlog'
  },

  // Other Details
  keySkills: [{
    type: String,
    trim: true
  }],
  aadhaarNumber: {
    type: String,
    match: /^[0-9]{12}$/
  },
  panNumber: {
    type: String,
    match: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/
  },
  bloodGroup: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
  },
  accommodation: {
    type: String,
    enum: ['Hostel', 'Day Scholar']
  },

  // Parent Details
  father: {
    name: { type: String },
    occupation: { type: String },
    annualIncome: { type: Number },
    contactNumber: { type: String, match: /^[0-9]{10}$/ }
  },
  mother: {
    name: { type: String },
    occupation: { type: String },
    annualIncome: { type: Number },
    contactNumber: { type: String, match: /^[0-9]{10}$/ }
  },

  // Address Details
  address: {
    permanentAddress: { type: String },
    city: { type: String },
    district: { type: String },
    pincode: { type: String, match: /^[0-9]{6}$/ },
    state: { type: String },
    nativePlace: { type: String }
  },

  // Additional Profile Uploads
  profilePhoto: {
    type: String // URL or file path
  },
  githubProfile: {
    type: String,
    match: /^https?:\/\/(www\.)?github\.com\/.+$/
  },
  linkedinProfile: {
    type: String,
    match: /^https?:\/\/(www\.)?linkedin\.com\/.+$/
  },
  resume: {
    type: String // URL or file path
  },

  // Placement Status
  placementStatus: {
    type: String,
    enum: ['Not Placed', 'Placed'],
    default: 'Not Placed'
  },
  placedCompany: {
    type: String
  },
  placementDate: {
    type: Date
  },

  // Profile Completion
  profileCompleted: {
    type: Boolean,
    default: false
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
studentSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new) and skipHash is not set
  if (!this.isModified('password') || this.skipHash) {
    return next();
  }

  try {
    // Generate salt and hash password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Also hash password on updateOne and findOneAndUpdate
studentSchema.pre(['updateOne', 'findOneAndUpdate'], async function(next) {
  const update = this.getUpdate();
  if (update && update.$set && update.$set.password && !update.$set.skipHash) {
    try {
      const salt = await bcrypt.genSalt(10);
      update.$set.password = await bcrypt.hash(update.$set.password, salt);
    } catch (err) {
      next(err);
    }
  }
  next();
});

// Match password
studentSchema.methods.matchPassword = async function(enteredPassword) {
  console.log('matchPassword called with enteredPassword:', enteredPassword);
  console.log('stored password hash:', this.password);

  // If password is not hashed (plain DOB), compare directly
  if (this.password && !this.password.startsWith('$2')) {
    console.log('Using plain text comparison for DOB password');
    const result = enteredPassword === this.password;
    console.log('Plain text compare result:', result);
    return result;
  }

  // Otherwise, use bcrypt comparison
  const result = await bcrypt.compare(enteredPassword, this.password);
  console.log('bcrypt.compare result:', result);
  return result;
};

// Auto-calculate CGPA
studentSchema.pre('save', function(next) {
  if (this.semesterGPA && this.semesterGPA.length > 0) {
    const totalGPA = this.semesterGPA.reduce((sum, sem) => sum + sem.gpa, 0);
    this.cgpa = totalGPA / this.semesterGPA.length;
  }
  next();
});

module.exports = mongoose.model('Student', studentSchema);