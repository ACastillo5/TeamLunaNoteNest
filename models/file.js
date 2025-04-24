const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  fieldname: String,
  filename: String,
  filepath: String,
  mimetype: String,
  size: Number,
  uploadedAt: { type: Date, default: Date.now },
  course: String,
  professor: String,
  description: String,
});

module.exports = mongoose.model('File', fileSchema);