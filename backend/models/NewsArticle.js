const mongoose = require('mongoose');

const NewsArticleSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  content: { type: String, required: true },
  excerpt: { type: String, required: true },
  author: { type: String, required: true },
  date: { type: Date, default: Date.now }, // Or rely on timestamps.createdAt
  categories: [{ type: String, required: true }],
  // addedBy: { type: String }, // Later: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('NewsArticle', NewsArticleSchema);
