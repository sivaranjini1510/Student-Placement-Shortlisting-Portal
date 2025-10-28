const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directories exist
const uploadDirs = ['./uploads/resumes', './uploads/photos', './uploads/feedbacks', './uploads/temp'];
uploadDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = './uploads/';

    if (file.fieldname === 'resume') {
      uploadPath += 'resumes/';
    } else if (file.fieldname === 'photo') {
      uploadPath += 'photos/';
    } else if (file.fieldname === 'file') {
      uploadPath += 'temp/';
    }

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter
const fileFilter = (allowedTypes) => {
  return (req, file, cb) => {
    if (Array.isArray(allowedTypes)) {
      // MIME types
      if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error(`Only ${allowedTypes.join(', ')} files are allowed`), false);
      }
    } else {
      // Extensions
      const ext = path.extname(file.originalname).toLowerCase().substring(1);
      const allowed = allowedTypes.split(',').map(type => type.trim());

      if (allowed.includes(ext)) {
        cb(null, true);
      } else {
        cb(new Error(`Only ${allowedTypes} files are allowed`), false);
      }
    }
  };
};

// Upload middleware factory
exports.uploadFile = (fieldName, allowedTypes, maxSizeMB) => {
  const upload = multer({
    storage: storage,
    limits: {
      fileSize: maxSizeMB * 1024 * 1024 // Convert MB to bytes
    },
    fileFilter: fileFilter(allowedTypes)
  }).single(fieldName);

  return (req, res, next) => {
    upload(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            status: 'error',
            message: `File size should not exceed ${maxSizeMB}MB`
          });
        }
        return res.status(400).json({
          status: 'error',
          message: err.message
        });
      } else if (err) {
        return res.status(400).json({
          status: 'error',
          message: err.message
        });
      }
      next();
    });
  };
};