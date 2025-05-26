const express = require('express');
const NewsArticle = require('../models/NewsArticle'); // Import NewsArticle model
const { isAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

// GET /api/news - List all articles
router.get('/', async (req, res) => {
  try {
    // Sort by date descending (newest first)
    const articles = await NewsArticle.find().sort({ date: -1 }); 
    res.json(articles);
  } catch (err) {
    console.error('Error fetching news articles:', err.message);
    res.status(500).json({ message: 'Server error while fetching news articles.' });
  }
});

// GET /api/news/:id - Get a specific article
router.get('/:id', async (req, res) => {
  try {
    const article = await NewsArticle.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ message: 'Article not found.' });
    }
    res.json(article);
  } catch (err) {
    console.error('Error fetching article by ID:', err.message);
    if (err.name === 'CastError' && err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Article not found (invalid ID format).' });
    }
    res.status(500).json({ message: 'Server error while fetching article.' });
  }
});

// POST /api/news - Create a new article (admin only)
router.post('/', isAdmin, async (req, res) => {
  const { title, content, author, categories, excerpt } = req.body;

  // Basic validation (already present, can be enhanced)
  if (!title || !content || !author || !categories || !Array.isArray(categories) || categories.length === 0 || !excerpt) {
    return res.status(400).json({ message: 'Missing or invalid required fields.' });
  }
  
  try {
    // Assuming req.user.id is available if real auth is implemented for 'addedBy'
    // const newArticleData = { ...req.body, addedBy: req.user.id }; 
    const newArticleData = { ...req.body }; // Using schema defaults for now

    const article = await NewsArticle.create(newArticleData);
    res.status(201).json(article);
  } catch (err) {
    console.error('Error creating news article:', err.message);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: 'Server error while creating news article.' });
  }
});

// PUT /api/news/:id - Update an article (admin only)
router.put('/:id', isAdmin, async (req, res) => {
  try {
    const updatedArticle = await NewsArticle.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedArticle) {
      return res.status(404).json({ message: 'Article not found.' });
    }
    res.json(updatedArticle);
  } catch (err) {
    console.error('Error updating news article:', err.message);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    if (err.name === 'CastError' && err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Article not found (invalid ID format).' });
    }
    res.status(500).json({ message: 'Server error while updating news article.' });
  }
});

// DELETE /api/news/:id - Delete an article (admin only)
router.delete('/:id', isAdmin, async (req, res) => {
  try {
    const deletedArticle = await NewsArticle.findByIdAndDelete(req.params.id);
    if (!deletedArticle) {
      return res.status(404).json({ message: 'Article not found.' });
    }
    res.json({ message: 'Article deleted successfully.' });
  } catch (err) {
    console.error('Error deleting news article:', err.message);
    if (err.name === 'CastError' && err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Article not found (invalid ID format).' });
    }
    res.status(500).json({ message: 'Server error while deleting news article.' });
  }
});

module.exports = router;
