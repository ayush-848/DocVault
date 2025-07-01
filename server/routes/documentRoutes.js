const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const {
  uploadDocument,
  getDocumentsAndUsage,
  serveDocument, // This is your proxy function
} = require('../controllers/documentController');

const multer = require('multer');
const upload = multer();

// Upload
router.post('/upload', authMiddleware, upload.single('file'), uploadDocument);

// List documents + usage
router.get('/', authMiddleware, getDocumentsAndUsage);

router.get('/:id/view', authMiddleware, serveDocument);
module.exports = router;