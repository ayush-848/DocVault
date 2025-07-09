// src/pages/Upload.jsx
import UploadForm from '../components/UploadForm';
import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import toast from '@/utils/toast';

export default function Upload() {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      toast.error('⚠️ Please log in to upload documents.');
      window.location.href = '/login';
    }
  }, [user]);

  return (
    <div className="p-4 sm:p-6 mx-auto space-y-6">
      <h1 className="text-2xl sm:text-3xl font-bold font-mono">📤 Upload Document</h1>
      <p className="text-muted-foreground text-sm font-mono">
        Select a PDF file to upload to your library.
      </p>

      <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
        <UploadForm  />
      </div>
    </div>
  );
}
