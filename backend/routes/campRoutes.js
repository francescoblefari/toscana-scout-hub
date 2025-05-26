const express = require('express');
const Camp = require('../models/Camp'); // Import Camp model
const { isAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

// GET /api/camps - List approved camps
router.get('/', async (req, res) => {
  try {
    const camps = await Camp.find({ status: 'approved' });
    res.json(camps);
  } catch (err) {
    console.error('Error fetching approved camps:', err.message);
    res.status(500).json({ message: 'Server error while fetching camps.' });
  }
});

// GET /api/camps/all - List all camps (admin only)
router.get('/all', isAdmin, async (req, res) => {
  try {
    const camps = await Camp.find();
    res.json(camps);
  } catch (err) {
    console.error('Error fetching all camps:', err.message);
    res.status(500).json({ message: 'Server error while fetching all camps.' });
  }
});

// GET /api/camps/:id - Get a specific camp
router.get('/:id', async (req, res) => {
  try {
    const camp = await Camp.findById(req.params.id);
    if (!camp) {
      return res.status(404).json({ message: 'Camp not found.' });
    }
    res.json(camp);
  } catch (err) {
    console.error('Error fetching camp by ID:', err.message);
    if (err.name === 'CastError' && err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Camp not found (invalid ID format).' });
    }
    res.status(500).json({ message: 'Server error while fetching camp.' });
  }
});

// POST /api/camps - Add a new camp proposal
router.post('/', async (req, res) => { // Assuming any authenticated user can propose, adjust if needed
  const { name, description, address, city, province, contact, capacity, services, images } = req.body;

  // Basic validation (already present, can be enhanced with a library like Joi or express-validator)
  if (!name || !description || !address || !city || !province || !contact || !contact.email || !contact.phone || !contact.responsible || capacity === undefined) {
    return res.status(400).json({ message: 'Missing required fields.' });
  }
  if (typeof capacity !== 'number' || capacity <= 0) {
    return res.status(400).json({ message: 'Capacity must be a positive number.' });
  }

  try {
    const newCampData = { ...req.body };
    // If using JWT auth and req.user.id is available:
    // if (req.user) newCampData.addedBy = req.user.id; 
    // For now, addedBy is a string or not set, relying on schema.
    
    const newCamp = await Camp.create(newCampData);
    res.status(201).json(newCamp);
  } catch (err) {
    console.error('Error creating camp:', err.message);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: 'Server error while creating camp.' });
  }
});

// PUT /api/camps/:id - Update a camp (admin only)
router.put('/:id', isAdmin, async (req, res) => {
  try {
    const updatedCamp = await Camp.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // Return the modified document
      runValidators: true, // Ensure schema validations are run
    });
    if (!updatedCamp) {
      return res.status(404).json({ message: 'Camp not found.' });
    }
    res.json(updatedCamp);
  } catch (err) {
    console.error('Error updating camp:', err.message);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    if (err.name === 'CastError' && err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Camp not found (invalid ID format).' });
    }
    res.status(500).json({ message: 'Server error while updating camp.' });
  }
});

// DELETE /api/camps/:id - Delete a camp (admin only)
router.delete('/:id', isAdmin, async (req, res) => {
  try {
    const deletedCamp = await Camp.findByIdAndDelete(req.params.id);
    if (!deletedCamp) {
      return res.status(404).json({ message: 'Camp not found.' });
    }
    res.json({ message: 'Camp deleted successfully.' });
  } catch (err) {
    console.error('Error deleting camp:', err.message);
    if (err.name === 'CastError' && err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Camp not found (invalid ID format).' });
    }
    res.status(500).json({ message: 'Server error while deleting camp.' });
  }
});

// PUT /api/camps/:id/approve - Approve a camp (admin only)
router.put('/:id/approve', isAdmin, async (req, res) => {
  try {
    const camp = await Camp.findByIdAndUpdate(
      req.params.id,
      { status: 'approved' },
      { new: true }
    );
    if (!camp) {
      return res.status(404).json({ message: 'Camp not found.' });
    }
    res.json(camp);
  } catch (err) {
    console.error('Error approving camp:', err.message);
    if (err.name === 'CastError' && err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Camp not found (invalid ID format).' });
    }
    res.status(500).json({ message: 'Server error while approving camp.' });
  }
});

// PUT /api/camps/:id/reject - Reject a camp (admin only)
router.put('/:id/reject', isAdmin, async (req, res) => {
  try {
    const camp = await Camp.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected' },
      { new: true }
    );
    if (!camp) {
      return res.status(404).json({ message: 'Camp not found.' });
    }
    res.json(camp);
  } catch (err) {
    console.error('Error rejecting camp:', err.message);
    if (err.name === 'CastError' && err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Camp not found (invalid ID format).' });
    }
    res.status(500).json({ message: 'Server error while rejecting camp.' });
  }
});

module.exports = router;
