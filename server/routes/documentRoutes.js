const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const {
  uploadDocument,
  getDocumentsAndUsage,
  serveDocument,
  deleteDocument
} = require('../controllers/documentController');

const multer = require('multer');
const upload = multer();


router.post('/upload', authMiddleware, upload.single('file'), uploadDocument);
router.get('/', authMiddleware, getDocumentsAndUsage);
router.get('/:id/view', authMiddleware, serveDocument);
router.delete('/:id', authMiddleware, deleteDocument);

module.exports = router;