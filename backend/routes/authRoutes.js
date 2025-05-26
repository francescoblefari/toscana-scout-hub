const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User'); // Import User model
// const jwt = require('jsonwebtoken'); // If using JWT later

const router = express.Router();

// POST /api/auth/register (New Route)
router.post('/register', async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      email,
      password: hashedPassword,
      role: role || 'user', // Default role if not provided
    });

    await user.save();
    
    // Exclude password from user object returned to client
    const userToReturn = user.toObject();
    delete userToReturn.password;

    // Optionally generate token upon registration as well
    const token = `fake-token-for-${user.id}-${user.role}`; // Placeholder token
    res.status(201).json({ message: 'User registered successfully', token, user: userToReturn });

  } catch (err) {
    console.error('Register error:', err.message);
    if (err.name === 'ValidationError') {
        return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: 'Server error during registration.' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const { password: _, ...userWithoutPassword } = user.toObject(); // Mongoose docs are ._doc, but .toObject() is safer
    const token = `fake-token-for-${user.id}-${user.role}`; // Placeholder token
    
    res.json({
      message: 'Login successful',
      token,
      user: userWithoutPassword,
    });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ message: 'Server error during login.' });
  }
});

module.exports = router;
