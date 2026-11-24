const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const complaintController = require('../controllers/complaintController');

// Multer Storage Configuration: Memory storage for Vercel/Serverless cloud, disk storage for local
const isServerless = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME;

let storage;
if (isServerless) {
  storage = multer.memoryStorage();
} else {
  const uploadDir = path.join(__dirname, '../../public/uploads');
  try {
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
  } catch (e) {}

  storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = path.extname(file.originalname);
      cb(null, 'complaint-' + uniqueSuffix + ext);
    }
  });
}

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Max 5MB
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Format file tidak didukung! Hanya gambar (JPG, PNG, WEBP).'));
  }
});

// Endpoint Routes
router.get('/stats/summary', complaintController.getStats);
router.get('/', complaintController.getAllComplaints);
router.get('/:id', complaintController.getComplaintById);
router.post('/', upload.single('photo'), complaintController.createComplaint);
router.patch('/:id/status', complaintController.updateStatus);

module.exports = router;
