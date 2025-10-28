const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Student = require('../models/Student');
const Staff = require('../models/Staff');
const Admin = require('../models/Admin');

// Generate JWT Token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// Helper to format a Date object as DD/MM/YYYY
const formatDOB = (date) => {
  if (!date) return null;

  // If it's already a string in DD/MM/YYYY format, return it as-is
  if (typeof date === 'string' && /^\d{2}\/\d{2}\/\d{4}$/.test(date)) {
    return date;
  }

  const d = new Date(date);
  if (isNaN(d.getTime())) return null;
  return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { role: requestedRole, username, password } = req.body;

    // Trim whitespace from password
    const trimmedPassword = password.trim();
    
    console.log('=== New Login Attempt ===');
    console.log('Login credentials:', {
      requestedRole,
      username,
      passwordLength: password ? password.length : 0,
      trimmedPasswordLength: trimmedPassword ? trimmedPassword.length : 0,
      passwordFormat: password ? (password.includes('/') ? 'DOB-like' : 'regular') : 'none'
    });

    if (!username || !password) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'Please provide username and password' 
      });
    }

    // Find user based on role and username
    let user = null;
    let role = requestedRole;

    // Find user based on requested role
    if (requestedRole === 'staff') {
      user = await Staff.findOne({ username });
    } else if (requestedRole === 'admin') {
      user = await Admin.findOne({ username });
    } else if (requestedRole === 'student') {
      user = await Student.findOne({ username });
    }

    console.log('User lookup results:', {
      searchedUsername: username,
      foundRole: role,
      userFound: !!user
    });

    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid credentials'
      });
    }

    // Password validation
    console.log('Password validation context:', {
      storedPassword: user.password,
      storedPasswordLength: user.password ? user.password.length : 0,
      isStoredHashBcrypt: user.password ? user.password.startsWith('$2') : false,
      isStoredDOBFormat: user.password ? /^\d{2}\/\d{2}\/\d{4}$/.test(user.password) : false,
      enteredPasswordFormat: password.includes('/') ? 'DOB' : 'regular',
      userHasDateOfBirth: !!user.dateOfBirth
    });

    // For students and staff, use DOB-based password validation if dateOfBirth is available
    // For admin, use bcrypt compare
    let passwordMatch = false;
    if ((role === 'student' || role === 'staff') && user.dateOfBirth) {
      console.log('Using DOB-based password validation');
      const expectedDOB = formatDOB(user.dateOfBirth);
      console.log('Expected DOB password:', expectedDOB);
      console.log('Entered password:', trimmedPassword);
      console.log('DOB raw value:', user.dateOfBirth);
      console.log('DOB type:', typeof user.dateOfBirth);

      // Safely get date components
      let dobDate = null;
      if (user.dateOfBirth instanceof Date) {
        dobDate = user.dateOfBirth;
      } else if (typeof user.dateOfBirth === 'string') {
        dobDate = new Date(user.dateOfBirth);
      }

      if (dobDate && !isNaN(dobDate.getTime())) {
        console.log('DOB date components - day:', dobDate.getDate(), 'month:', dobDate.getMonth() + 1, 'year:', dobDate.getFullYear());
      } else {
        console.log('DOB is not a valid Date object');
      }

      passwordMatch = (trimmedPassword === expectedDOB);
      console.log('Password match result:', passwordMatch);
    } else {
      // For admin users, use bcrypt compare
      console.log('Using standard bcrypt validation');
      passwordMatch = await bcrypt.compare(trimmedPassword, user.password);
    }

    console.log('Password match result:', passwordMatch);

    if (!passwordMatch) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid credentials'
      });
    }

    // Create token
    const token = generateToken(user._id, role);
    console.log('Login successful, token generated');

    res.status(200).json({
      status: 'success',
      data: {
        token,
        user: {
          id: user._id,
          username: user.username,
          fullName: user.fullName,
          role: role,
          profileCompleted: user.profileCompleted || false
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
exports.logout = async (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Logged out successfully'
  });
};

// @desc    Get current user profile
// @route   GET /api/auth/profile
// @access  Private
exports.getProfile = async (req, res) => {
  try {
    res.status(200).json({
      status: 'success',
      data: {
        user: req.user
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};