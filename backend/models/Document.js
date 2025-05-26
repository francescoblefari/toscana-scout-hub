const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  filename: { type: String, required: true }, // Filename as stored on server
  originalname: { type: String, required: true },
  mimetype: { type: String, required: true },
  size: { type: Number, required: true },
  // category: { type: String }, // From frontend, consider adding
  uploadDate: { type: Date, default: Date.now }, // Or rely on timestamps.createdAt
  // uploadedBy: { type: String }, // Later: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Document', DocumentSchema);
