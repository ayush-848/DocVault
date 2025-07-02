const supabase = require('../utils/supabaseClient');
const pool = require('../config/db');
const { v4: uuidv4 } = require('uuid');
const { Readable } = require('stream');

const MAX_STORAGE_MB = 500;

// 📄 Upload Document
exports.uploadDocument = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const fileExt = file.originalname.split('.').pop();
    const filename = `${uuidv4()}.${fileExt}`;
    const userId = req.user.id;
    const fileSize = file.size;
    const language = req.body.language || 'unknown';

    const { error } = await supabase
      .storage
      .from(process.env.SUPABASE_BUCKET)
      .upload(filename, file.buffer, {
        contentType: file.mimetype,
      });

    if (error) {
      console.error('❌ Supabase upload error:', error.message);
      return res.status(500).json({ success: false, message: 'Upload failed', error: error.message });
    }

    const result = await pool.query(
      `INSERT INTO documents (user_id, title, supabase_key, language, size)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [userId, file.originalname, filename, language, fileSize]
    );

    return res.status(201).json({
      success: true,
      message: 'Document uploaded successfully',
      document: result.rows[0],
    });
  } catch (err) {
    console.error('🔥 Upload error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error', error: err.message });
  }
};

// 📥 Get Documents + Storage Usage
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

    const documents = await Promise.all(result.rows.map(async (doc) => {
      const { data } = supabase
        .storage
        .from(process.env.SUPABASE_BUCKET)
        .getPublicUrl(doc.supabase_key);

      return {
        id: doc.id,
        title: doc.title,
        language: doc.language,
        created_at: doc.created_at,
        size: doc.size,
        viewUrl: `/documents/${doc.id}/view`,
        publicUrl: data?.publicUrl || null,
      };
    }));

    const totalBytes = documents.reduce((sum, doc) => sum + (parseInt(doc.size) || 0), 0);
    const usedMB = +(totalBytes / (1024 * 1024)).toFixed(2);
    const remainingMB = +(MAX_STORAGE_MB - usedMB).toFixed(2);
    const usagePercent = +(usedMB / MAX_STORAGE_MB * 100).toFixed(2);

    return res.json({
      success: true,
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
    return res.status(500).json({ success: false, message: 'Could not retrieve documents', error: err.message });
  }
};

// 📄 View Document as Stream
exports.serveDocument = async (req, res) => {
  const userId = req.user.id;
  const docId = req.params.id;

  try {
    const result = await pool.query(
      'SELECT supabase_key, title FROM documents WHERE id = $1 AND user_id = $2',
      [docId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Document not found or unauthorized' });
    }

    const { supabase_key, title } = result.rows[0];
    const { data } = supabase
      .storage
      .from(process.env.SUPABASE_BUCKET)
      .getPublicUrl(supabase_key);

    const publicUrl = data?.publicUrl;
    if (!publicUrl) {
      return res.status(500).json({ success: false, message: 'Could not generate public file URL' });
    }

    const fileResponse = await fetch(publicUrl);
    if (!fileResponse.ok) {
      return res.status(502).json({ success: false, message: 'Failed to fetch file from storage' });
    }

    res.setHeader('Content-Type', fileResponse.headers.get('content-type') || 'application/octet-stream');
    const contentLength = fileResponse.headers.get('content-length');
    if (contentLength) res.setHeader('Content-Length', contentLength);

    res.setHeader('Content-Disposition', `inline; filename="${encodeURIComponent(title)}"`);

    const stream = Readable.fromWeb(fileResponse.body);
    stream.pipe(res);
  } catch (err) {
    console.error('🔥 serveDocument error:', err);
    return res.status(500).json({ success: false, message: 'Failed to serve document', error: err.message });
  }
};

// 🗑️ Delete Document
exports.deleteDocument = async (req, res) => {
  const userId = req.user.id;
  const docId = req.params.id;

  try {
    const result = await pool.query(
      'SELECT supabase_key FROM documents WHERE id = $1 AND user_id = $2',
      [docId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Document not found or unauthorized' });
    }

    const { supabase_key } = result.rows[0];

    const { error: storageError } = await supabase
      .storage
      .from(process.env.SUPABASE_BUCKET)
      .remove([supabase_key]);

    if (storageError) {
      console.error('❌ Supabase delete error:', storageError.message);
      return res.status(500).json({ success: false, message: 'Failed to delete file from storage', error: storageError.message });
    }

    await pool.query('DELETE FROM documents WHERE id = $1 AND user_id = $2', [docId, userId]);

    return res.json({ success: true, message: 'Document deleted successfully' });
  } catch (err) {
    console.error('🔥 deleteDocument error:', err);
    return res.status(500).json({ success: false, message: 'Failed to delete document', error: err.message });
  }
};
