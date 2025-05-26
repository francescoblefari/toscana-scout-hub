// backend/scripts/migrateData.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
const connectDB = require('../config/db'); // DB connection logic

// Import Mongoose Models
const User = require('../models/User');
const Camp = require('../models/Camp');
const NewsArticle = require('../models/NewsArticle');
const Document = require('../models/Document');

// Paths to JSON data files
const usersPath = path.join(__dirname, '..', 'data', 'users.json');
const campsPath = path.join(__dirname, '..', 'data', 'camps.json');
const newsPath = path.join(__dirname, '..', 'data', 'news.json');
const documentsPath = path.join(__dirname, '..', 'data', 'documents.json');

const migrateData = async () => {
  console.log('Connecting to MongoDB...');
  await connectDB();
  console.log('MongoDB connected for migration.');

  try {
    // --- Migrate Users ---
    if (fs.existsSync(usersPath)) {
      console.log('Migrating Users...');
      const usersData = JSON.parse(fs.readFileSync(usersPath, 'utf-8'));
      await User.deleteMany({}); // Clear existing users
      for (const userData of usersData) {
        const salt = await bcrypt.genSalt(10);
        userData.password = await bcrypt.hash(userData.password, salt); // Hash password
      }
      await User.insertMany(usersData);
      console.log(`${usersData.length} Users migrated successfully.`);
    } else {
      console.log('users.json not found, skipping user migration.');
    }

    // --- Migrate Camps ---
    if (fs.existsSync(campsPath)) {
      console.log('Migrating Camps...');
      const campsData = JSON.parse(fs.readFileSync(campsPath, 'utf-8'));
      await Camp.deleteMany({});
      // Transform data if needed (e.g., string dates to Date objects if not already)
      // For camps, 'addedDate' might need conversion if it's a string from JSON
      const transformedCamps = campsData.map(camp => ({
        ...camp,
        addedDate: camp.addedDate ? new Date(camp.addedDate) : new Date(),
        // Ensure contact sub-document is present
        contact: camp.contact || { phone: 'N/A', email: 'n/a@example.com', responsible: 'N/A'},
      }));
      await Camp.insertMany(transformedCamps);
      console.log(`${transformedCamps.length} Camps migrated successfully.`);
    } else {
      console.log('camps.json not found, skipping camp migration.');
    }

    // --- Migrate News Articles ---
    if (fs.existsSync(newsPath)) {
      console.log('Migrating News Articles...');
      const newsData = JSON.parse(fs.readFileSync(newsPath, 'utf-8'));
      await NewsArticle.deleteMany({});
      const transformedNews = newsData.map(article => ({
        ...article,
        date: article.date ? new Date(article.date) : new Date(),
      }));
      await NewsArticle.insertMany(transformedNews);
      console.log(`${transformedNews.length} News Articles migrated successfully.`);
    } else {
      console.log('news.json not found, skipping news migration.');
    }
    
    // --- Migrate Documents ---
    // Note: This migrates metadata. Actual files in uploads/ must exist separately.
    if (fs.existsSync(documentsPath)) {
      console.log('Migrating Documents Metadata...');
      const documentsData = JSON.parse(fs.readFileSync(documentsPath, 'utf-8'));
      await Document.deleteMany({});
       const transformedDocuments = documentsData.map(doc => ({
        ...doc,
        uploadDate: doc.uploadDate ? new Date(doc.uploadDate) : new Date(),
      }));
      await Document.insertMany(transformedDocuments);
      console.log(`${transformedDocuments.length} Documents metadata migrated successfully.`);
    } else {
      console.log('documents.json not found, skipping document metadata migration.');
    }

    console.log('Data migration completed!');
  } catch (error) {
    console.error('Error during data migration:', error);
  } finally {
    await mongoose.disconnect();
    console.log('MongoDB disconnected.');
  }
};

migrateData();
