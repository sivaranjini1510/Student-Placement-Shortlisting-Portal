const validator = require('validator');

// @desc    Validate email format
const isValidEmail = (email) => {
  return validator.isEmail(email);
};

// @desc    Validate NEC college email
const isNECEmail = (email) => {
  const necEmailRegex = /^[^\s@]+@nec\.edu\.in$/;
  return necEmailRegex.test(email);
};

// @desc    Validate phone number (10 digits)
const isValidPhone = (phone) => {
  const phoneRegex = /^[0-9]{10}$/;
  return phoneRegex.test(phone);
};

// @desc    Validate Aadhaar number (12 digits)
const isValidAadhaar = (aadhaar) => {
  const aadhaarRegex = /^[0-9]{12}$/;
  return aadhaarRegex.test(aadhaar);
};

// @desc    Validate PAN number
const isValidPAN = (pan) => {
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  return panRegex.test(pan);
};

// @desc    Validate GitHub URL
const isValidGitHubURL = (url) => {
  const githubRegex = /^https?:\/\/(www\.)?github\.com\/.+$/;
  return githubRegex.test(url);
};

// @desc    Validate LinkedIn URL
const isValidLinkedInURL = (url) => {
  const linkedinRegex = /^https?:\/\/(www\.)?linkedin\.com\/.+$/;
  return linkedinRegex.test(url);
};

// @desc    Validate percentage (0-100)
const isValidPercentage = (percentage) => {
  return typeof percentage === 'number' && percentage >= 0 && percentage <= 100;
};

// @desc    Validate CGPA (0-10)
const isValidCGPA = (cgpa) => {
  return typeof cgpa === 'number' && cgpa >= 0 && cgpa <= 10;
};

// @desc    Validate GPA (0-10)
const isValidGPA = (gpa) => {
  return typeof gpa === 'number' && gpa >= 0 && gpa <= 10;
};

// @desc    Validate date of birth (should be in past, reasonable age)
const isValidDOB = (dob) => {
  const birthDate = new Date(dob);
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();
  return age >= 16 && age <= 30; // Reasonable age range for students
};

// @desc    Validate pincode (6 digits)
const isValidPincode = (pincode) => {
  const pincodeRegex = /^[0-9]{6}$/;
  return pincodeRegex.test(pincode.toString());
};

// @desc    Validate student profile completeness
const validateStudentProfile = (profile) => {
  const errors = [];

  // Required fields
  const requiredFields = [
    'fullName', 'degree', 'department', 'gender', 'dateOfBirth',
    'studentContact', 'collegeEmail', 'personalEmail'
  ];

  requiredFields.forEach(field => {
    if (!profile[field]) {
      errors.push(`${field} is required`);
    }
  });

  // Email validations
  if (profile.collegeEmail && !isNECEmail(profile.collegeEmail)) {
    errors.push('College email must be a valid NEC email (@nec.edu.in)');
  }

  if (profile.personalEmail && !isValidEmail(profile.personalEmail)) {
    errors.push('Personal email must be valid');
  }

  // Phone validation
  if (profile.studentContact && !isValidPhone(profile.studentContact)) {
    errors.push('Student contact must be 10 digits');
  }

  // DOB validation
  if (profile.dateOfBirth && !isValidDOB(profile.dateOfBirth)) {
    errors.push('Invalid date of birth');
  }

  // Academic validations
  if (profile.sslc) {
    if (!isValidPercentage(profile.sslc.percentage)) {
      errors.push('SSLC percentage must be between 0-100');
    }
  }

  if (profile.hsc) {
    if (!isValidPercentage(profile.hsc.percentage)) {
      errors.push('HSC percentage must be between 0-100');
    }
  }

  if (profile.diploma && profile.diploma.percentage) {
    if (!isValidPercentage(profile.diploma.percentage)) {
      errors.push('Diploma percentage must be between 0-100');
    }
  }

  if (profile.cgpa && !isValidCGPA(profile.cgpa)) {
    errors.push('CGPA must be between 0-10');
  }

  if (profile.semesterGPA) {
    profile.semesterGPA.forEach((sem, index) => {
      if (!isValidGPA(sem.gpa)) {
        errors.push(`Semester ${sem.semester} GPA must be between 0-10`);
      }
    });
  }

  // Other validations
  if (profile.aadhaarNumber && !isValidAadhaar(profile.aadhaarNumber)) {
    errors.push('Aadhaar number must be 12 digits');
  }

  if (profile.panNumber && !isValidPAN(profile.panNumber)) {
    errors.push('PAN number format is invalid');
  }

  if (profile.githubProfile && !isValidGitHubURL(profile.githubProfile)) {
    errors.push('GitHub profile must be a valid URL');
  }

  if (profile.linkedinProfile && !isValidLinkedInURL(profile.linkedinProfile)) {
    errors.push('LinkedIn profile must be a valid URL');
  }

  if (profile.address && profile.address.pincode && !isValidPincode(profile.address.pincode)) {
    errors.push('Pincode must be 6 digits');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

module.exports = {
  isValidEmail,
  isNECEmail,
  isValidPhone,
  isValidAadhaar,
  isValidPAN,
  isValidGitHubURL,
  isValidLinkedInURL,
  isValidPercentage,
  isValidCGPA,
  isValidGPA,
  isValidDOB,
  isValidPincode,
  validateStudentProfile
};
