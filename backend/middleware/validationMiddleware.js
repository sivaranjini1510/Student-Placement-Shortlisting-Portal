const { body, validationResult } = require('express-validator');

// Validation result handler
exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'error',
      errors: errors.array()
    });
  }
  next();
};

// Student registration validation
exports.validateStudentRegistration = [
  body('username').notEmpty().withMessage('Username is required'),
  body('fullName').notEmpty().withMessage('Full name is required'),
  body('degree').isIn(['B.E.', 'B.Tech', 'M.E.', 'M.Tech']).withMessage('Invalid degree'),
  body('department').isIn(['CSE', 'ECE', 'IT', 'AI&DS', 'MECH', 'CIVIL', 'EEE']).withMessage('Invalid department'),
  body('dateOfBirth').isISO8601().withMessage('Invalid date of birth'),
  body('collegeEmail').isEmail().withMessage('Invalid college email')
    .matches(/@nec\.edu\.in$/).withMessage('Email must end with @nec.edu.in')
];

// Staff registration validation
exports.validateStaffRegistration = [
  body('username').notEmpty().withMessage('Username is required')
    .matches(/@nec\.edu\.in$/).withMessage('Username must end with @nec.edu.in'),
  body('fullName').notEmpty().withMessage('Full name is required'),
  body('department').notEmpty().withMessage('Department is required'),
  body('designation').notEmpty().withMessage('Designation is required'),
  body('dateOfBirth').isISO8601().withMessage('Invalid date of birth'),
  body('contactNumber').matches(/^[0-9]{10}$/).withMessage('Contact number must be 10 digits')
];

// Login validation
exports.validateLogin = [
  body('username').notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required')
];

// Profile update validation
exports.validateProfileUpdate = [
  body('studentContact').optional().matches(/^[0-9]{10}$/).withMessage('Contact number must be 10 digits'),
  body('collegeEmail').optional().isEmail().withMessage('Invalid email')
    .matches(/@nec\.edu\.in$/).withMessage('Email must end with @nec.edu.in'),
  body('personalEmail').optional().isEmail().withMessage('Invalid personal email'),
  body('githubProfile').optional().matches(/^https?:\/\/(www\.)?github\.com\/.+$/).withMessage('Invalid GitHub URL'),
  body('linkedinProfile').optional().matches(/^https?:\/\/(www\.)?linkedin\.com\/.+$/).withMessage('Invalid LinkedIn URL')
];

// Company drive validation
exports.validateCompanyDrive = [
  body('companyName').notEmpty().withMessage('Company name is required'),
  body('jobRole').notEmpty().withMessage('Job role is required'),
  body('ctc').isNumeric().withMessage('CTC must be a number'),
  body('criteria.minCGPA').isFloat({ min: 0, max: 10 }).withMessage('CGPA must be between 0 and 10'),
  body('criteria.minSSLC').isFloat({ min: 0, max: 100 }).withMessage('SSLC percentage must be between 0 and 100'),
  body('criteria.minHSC').isFloat({ min: 0, max: 100 }).withMessage('HSC percentage must be between 0 and 100'),
  body('driveDate').isISO8601().withMessage('Invalid drive date'),
  body('registrationDeadline').isISO8601().withMessage('Invalid registration deadline')
];