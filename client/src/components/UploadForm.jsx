import { useState } from 'react';
import api from '../services/api';
import { Button } from '@/components/ui/button';

export default function UploadForm({ onDone }) {
  const [file, setFile] = useState();

  const upload = e => {
    e.preventDefault();
    if (!file) return;

    const form = new FormData();
    form.append('file', file);

    api.post('/documents/upload', form, { headers: { 'Content-Type': 'multipart/form-data' } })
       .then(onDone)
       .catch(() => alert('Upload failed'));
  };

  return (
    <form onSubmit={upload} className="flex items-center space-x-2">
      <input type="file"
             onChange={e => setFile(e.target.files[0])}
             className="block" />
      <Button type="submit">Upload</Button>
    </form>
  );
}
