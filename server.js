const express = require('express');
const cors = require('cors');
const path = require('path');
const complaintRoutes = require('./src/routes/complaintRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files (Frontend UI & Uploaded photos)
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Health Check API (Untuk DevOps / Monitoring / CI)
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'ISPM Facility Complaint & Service Request System',
    version: '1.0.0 (Sprint 1 Prototype)'
  });
});

// API Routes
app.use('/api/complaints', complaintRoutes);

// Fallback error handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err.message);
  res.status(500).json({
    success: false,
    message: err.message || 'Terjadi kesalahan internal pada server.'
  });
});

// Start server only when executed directly (not when required by tests)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🚀 Facility Complaint System running at: http://localhost:${PORT}`);
    console.log(`📡 API Health Check: http://localhost:${PORT}/api/health`);
    console.log(`📋 API Complaints:   http://localhost:${PORT}/api/complaints`);
    console.log(`=======================================================`);
  });
}

module.exports = app;
