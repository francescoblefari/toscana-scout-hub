const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const Document = require('../models/Document'); // Import Document model
const { isAdmin } = require('../middleware/authMiddleware');

const router = express.Router();
const uploadsDir = path.join(__dirname, '..', 'uploads', 'documents');

// Ensure uploads directory exists (Multer will also create it if it doesn't exist for destination)
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer setup for file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '_')); // Replace spaces
  }
});
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // Example: 10MB limit
});


// GET /api/documents - List all document metadata
router.get('/', async (req, res) => {
  try {
    const documents = await Document.find().sort({ uploadDate: -1 });
    res.json(documents);
  } catch (err) {
    console.error('Error fetching documents:', err.message);
    res.status(500).json({ message: 'Server error while fetching documents.' });
  }
});

// POST /api/documents - Upload a new document (admin only)
router.post('/', isAdmin, upload.single('documentFile'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }
  if (!req.body.title || typeof req.body.title !== 'string' || req.body.title.trim() === '') {
    // If title is missing, delete the uploaded file
    fs.unlink(req.file.path, (unlinkErr) => {
      if (unlinkErr) console.error("Error deleting orphaned file due to missing title:", unlinkErr.message);
    });
    return res.status(400).json({ message: 'Title is required and must be a non-empty string.' });
  }

  try {
    const newDocumentData = {
      title: req.body.title.trim(),
      filename: req.file.filename,
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      // uploadedBy: req.user.id // if req.user is properly populated
    };
    const document = await Document.create(newDocumentData);
    res.status(201).json(document);
  } catch (err) {
    console.error('Error creating document entry:', err.message);
    // If DB entry fails, delete the uploaded file
    fs.unlink(req.file.path, (unlinkErr) => {
      if (unlinkErr) console.error("Error deleting orphaned file after DB error:", unlinkErr.message);
    });
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: 'Server error while saving document metadata.' });
  }
});

// GET /api/documents/:id/download - Download a specific document
router.get('/:id/download', async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) {
      return res.status(404).json({ message: 'Document not found.' });
    }

    const filePath = path.join(uploadsDir, doc.filename);
    if (fs.existsSync(filePath)) {
      res.download(filePath, doc.originalname, (dlErr) => {
        if (dlErr) {
          console.error("Error during download:", dlErr.message);
          if (!res.headersSent) {
            res.status(500).json({ message: 'Error downloading file.' });
          }
        }
      });
    } else {
      // This case might happen if the file was manually deleted from the server
      // Or if doc.filename is somehow incorrect.
      console.warn(`File not found on server for document ID ${doc.id}: ${filePath}`);
      res.status(404).json({ message: 'File not found on server.' });
    }
  } catch (err) {
    console.error('Error fetching document for download:', err.message);
    if (err.name === 'CastError' && err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Document not found (invalid ID format).' });
    }
    res.status(500).json({ message: 'Server error while fetching document for download.' });
  }
});

// DELETE /api/documents/:id - Delete a document (admin only)
router.delete('/:id', isAdmin, async (req, res) => {
  try {
    const docToDelete = await Document.findById(req.params.id);
    if (!docToDelete) {
      return res.status(404).json({ message: 'Document not found in database.' });
    }

    const filePath = path.join(uploadsDir, docToDelete.filename);

    // Attempt to delete the physical file first
    fs.unlink(filePath, async (unlinkErr) => {
      if (unlinkErr && unlinkErr.code !== 'ENOENT') { // ENOENT means file not found, which is fine for deletion
        console.error("Error deleting document file from disk:", unlinkErr.message);
        // Decide if you want to stop or proceed to delete metadata
        return res.status(500).json({ message: 'Error deleting document file from disk. Metadata not deleted.' });
      }

      // If file deletion was successful or file was already gone, delete metadata
      try {
        await Document.findByIdAndDelete(req.params.id);
        res.json({ message: 'Document (file and metadata) deleted successfully.' });
      } catch (dbErr) {
        console.error('Error deleting document metadata from DB:', dbErr.message);
        // This case is tricky: file might be deleted but DB entry remains.
        // Or, file was not found, and DB deletion also failed.
        if (dbErr.name === 'CastError' && dbErr.kind === 'ObjectId') {
             return res.status(404).json({ message: 'Document metadata not found (invalid ID format).' });
        }
        res.status(500).json({ message: 'Error deleting document metadata. File status: ' + (unlinkErr ? unlinkErr.message : 'deleted or was not found') });
      }
    });
  } catch (err) {
    console.error('Error finding document to delete:', err.message);
    if (err.name === 'CastError' && err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Document not found (invalid ID format).' });
    }
    res.status(500).json({ message: 'Server error while trying to delete document.' });
  }
});

module.exports = router;
