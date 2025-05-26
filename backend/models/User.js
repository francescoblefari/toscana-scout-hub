const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'editor', 'user'], default: 'user' },
  // Add other fields as necessary, e.g., name
}, { timestamps: true });

// Consider adding a pre-save hook for password hashing here in a real app
// UserSchema.pre('save', async function(next) { ... });

module.exports = mongoose.model('User', UserSchema);
