// src/pages/Upload.jsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import api from '../services/api';

export default function Upload() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const handleUpload = async e => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    setMessage('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await api.post('/documents/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setMessage(`✅ Uploaded: ${res.data.document.title}`);
    } catch (err) {
      setMessage('❌ Upload failed');
    } finally {
      setUploading(false);
      setFile(null);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">📤 Upload a Document</h2>
      <form onSubmit={handleUpload} className="space-y-4">
        <Input
          type="file"
          accept=".pdf,.doc,.docx,.txt"
          onChange={e => setFile(e.target.files[0])}
        />
        <Button type="submit" disabled={uploading || !file}>
          {uploading ? 'Uploading...' : 'Upload'}
        </Button>
      </form>

      {message && <p className="mt-4 text-sm">{message}</p>}
    </div>
  );
}
