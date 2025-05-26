const express = require('express');
const cors = require('cors');
const path = require('path'); // Required for serving static files
const connectDB = require('./config/db'); // Import DB connection

// Connect to MongoDB
connectDB();

const authRoutes = require('./routes/authRoutes');
const campRoutes = require('./routes/campRoutes');
const newsRoutes = require('./routes/newsRoutes');
const documentRoutes = require('./routes/documentRoutes'); // Import document routes

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.use('/api/auth', authRoutes);
app.use('/api/camps', campRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/documents', documentRoutes); // Mount document routes

app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend is healthy and connected to DB (if no errors above)', timestamp: new Date() });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
