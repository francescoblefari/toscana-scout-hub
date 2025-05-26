const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
  phone: { type: String, required: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  responsible: { type: String, required: true },
}, { _id: false });

const CampSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  province: { type: String, required: true, uppercase: true, trim: true, minlength: 2, maxlength: 2 },
  contact: { type: ContactSchema, required: true },
  capacity: { type: Number, required: true, min: 1 },
  services: [{ type: String }],
  status: { type: String, enum: ['approved', 'pending', 'rejected'], default: 'pending', required: true },
  images: [{ type: String }], // URLs to images
  addedBy: { type: String }, // Later: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  addedDate: { type: Date, default: Date.now }, // Or rely on timestamps.createdAt
}, { timestamps: true });

module.exports = mongoose.model('Camp', CampSchema);
