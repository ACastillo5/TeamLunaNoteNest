const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fileSchema = new mongoose.Schema({
  filename: String,
  filepath: String,
  mimetype: String,
  size: Number,
  uploadedAt: { type: Date, default: Date.now },
  course: String,
  professor: String,
  description: String,
  thumbnail: String,
  uploader: { type: Schema.Types.ObjectId, ref: 'User' },
});

module.exports = mongoose.model('File', fileSchema);