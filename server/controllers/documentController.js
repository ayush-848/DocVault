const supabase = require('../utils/supabaseClient');
const pool = require('../config/db');
const { v4: uuidv4 } = require('uuid');
const detectLanguage = require('../utils/languageDetector');
const pdfParse = require('pdf-parse');
const fetch = require('node-fetch'); // If not already available

const MAX_STORAGE_MB = 500;

// 🟢 Upload Document
exports.uploadDocument = async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ message: 'No file uploaded' });

    const fileExt = file.originalname.split('.').pop();
    const filename = `${uuidv4()}.${fileExt}`;
    const userId = req.user.id;
    const fileSize = file.size;

    console.log(`📄 Uploading file for user ${userId}: ${file.originalname} → ${filename}`);

    const { error } = await supabase
      .storage
      .from(process.env.SUPABASE_BUCKET)
      .upload(filename, file.buffer, {
        contentType: file.mimetype,
      });

    if (error) {
      console.error('❌ Supabase upload error:', error);
      return res.status(500).json({ message: 'Upload failed', error });
    }

    // Extract text if possible
    let documentText = '';
    if (file.mimetype === 'application/pdf') {
      try {
        const pdfData = await pdfParse(file.buffer);
        documentText = pdfData.text;
      } catch {
        console.warn('⚠️ PDF parsing failed');
      }
    } else if (file.mimetype.startsWith('text/')) {
      documentText = file.buffer.toString('utf-8');
    }

    const langCode = detectLanguage(documentText);
    console.log(`🌐 Detected language: ${langCode}`);

    const result = await pool.query(
      `INSERT INTO documents (user_id, title, supabase_key, language, size)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [userId, file.originalname, filename, langCode, fileSize]
    );

    console.log('✅ Document metadata saved');

    res.status(201).json({
      message: '✅ Document uploaded successfully.',
      document: result.rows[0],
    });
  } catch (err) {
    console.error('🔥 Upload error:', err);
    res.status(500).json({ error: err.message });
  }
};

// 📥 Fetch All Documents (with usage)
exports.getDocumentsAndUsage = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `SELECT id, title, language, created_at, size, supabase_key
       FROM documents
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [userId]
    );

    const documents = await Promise.all(
      result.rows.map(async (doc) => {
        const { data } = supabase
          .storage
          .from(process.env.SUPABASE_BUCKET)
          .getPublicUrl(doc.supabase_key);

        const publicUrl = data?.publicUrl || null;

        return {
          id: doc.id,
          title: doc.title,
          language: doc.language,
          created_at: doc.created_at,
          size: doc.size,
          viewUrl: `/documents/${doc.id}/view`, // proxy/stream view
          publicUrl, // 👈 used for thumbnails or direct embeds
        };
      })
    );

    const totalBytes = documents.reduce((sum, doc) => sum + (parseInt(doc.size) || 0), 0);
    const usedMB = +(totalBytes / (1024 * 1024)).toFixed(2);
    const remainingMB = +(MAX_STORAGE_MB - usedMB).toFixed(2);
    const usagePercent = +(usedMB / MAX_STORAGE_MB * 100).toFixed(2);

    res.json({
      documents,
      storage: {
        usedMB,
        remainingMB,
        usagePercent,
        maxMB: MAX_STORAGE_MB,
      },
    });
  } catch (err) {
    console.error('🔥 Error fetching documents:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.serveDocument = async (req, res) => {
  const userId = req.user.id;
  const docId = req.params.id;

  try {
    const result = await pool.query(
      'SELECT supabase_key, title FROM documents WHERE id = $1 AND user_id = $2',
      [docId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Document not found' });
    }

    const { supabase_key, title } = result.rows[0];

    // Get the public URL (we use it server-side only)
    const { data } = supabase
      .storage
      .from(process.env.SUPABASE_BUCKET)
      .getPublicUrl(supabase_key);

    const publicUrl = data?.publicUrl;
    if (!publicUrl) {
      return res.status(500).json({ message: 'Could not generate file URL' });
    }

    // Fetch file from Supabase
    const fileResponse = await fetch(publicUrl);
    if (!fileResponse.ok || !fileResponse.body) {
      return res.status(502).json({ message: 'Failed to fetch file from Supabase' });
    }

    // Set headers to stream properly
    const contentType = fileResponse.headers.get('content-type') || 'application/octet-stream';
    const contentLength = fileResponse.headers.get('content-length');

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Length', contentLength);
    res.setHeader('Content-Disposition', `inline; filename="${encodeURIComponent(title)}"`);

    // Stream it
    fileResponse.body.pipe(res);
  } catch (err) {
    console.error('🔥 serveDocument error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
