const multer = require('multer');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const File = require('./file'); // Import the File model

const documentDir = path.join(__dirname, '../public/uploads/documents');
try {
  if (!fs.existsSync(documentDir)) {
    fs.mkdirSync(documentDir, { recursive: true });
  }
} catch (err) {
  console.error('Error creating upload directory:', err.message);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, documentDir);
  },
  filename: (req, file, cb) => {
    const prefix = 'document-';
    cb(null, prefix + Date.now() + '-' + Math.round(Math.random() * 1e9) + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /pdf|doc|docx/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF, DOC, and DOCX files are allowed.'));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 100 }, // 100 MB limit
  fileFilter: fileFilter,
}).single('noteFile');

const uploadWithMongoDB = (req, res, next) => {
  upload(req, res, async (err) => {
    if (err) {
      return next(err); // Pass the error to the route handler
    }

    if (!req.file) {
      return next(new Error('No file was uploaded.'));
    }

    try {
      const { course, professor, description } = req.body;

      if (!course || !professor || !description) {
        return next(new Error('Missing required fields: course, professor, or description.'));
      }

      const fileData = new File({
        fieldname: req.file.fieldname,
        filename: req.file.filename,
        filepath: req.file.path,
        mimetype: req.file.mimetype,
        size: req.file.size,
        course: course,
        professor: professor,
        description: description,
      });

      await fileData.save();
      console.log('File metadata saved to MongoDB:', fileData);

      next(); // Call next without sending a response
    } catch (dbError) {
      console.error('Database error:', dbError);
      return next(dbError); // Pass the error to the route handler
    }
  });
};

module.exports = uploadWithMongoDB;