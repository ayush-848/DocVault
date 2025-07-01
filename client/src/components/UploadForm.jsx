import React, { useRef, useState } from 'react';
import { extractTextFromPDF } from '../utils/extractPdfText';
import { detectLanguage } from '../utils/detectLanguage';
import { uploadDoc } from '../services/api';
import { Button } from '@/components/ui/button';
import { UploadCloud } from 'lucide-react';

const UploadForm = () => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || file.type !== 'application/pdf') {
      alert('Please select a valid PDF file.');
      return;
    }

    try {
      setIsUploading(true);
      const text = await extractTextFromPDF(file);
      const langCode = detectLanguage(text);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('language', langCode);

      const res = await uploadDoc(formData);
      console.log('✅ Uploaded Document:', res);
      alert('✅ Document uploaded successfully!');
      window.location.reload();
    } catch (err) {
      console.error('❌ Upload failed:', err);
      alert('❌ Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-3 px-4 py-2 font-mono"
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
        className="hidden"
      />

      <button
        type="button"
        onClick={triggerFileInput}
        className="text-muted-foreground cursor-pointer hover:text-primary transition-colors"
        title="Upload PDF"
      >
        <UploadCloud className="w-8 h-8" />
      </button>

      <span className="text-sm text-muted-foreground max-w-[240px] truncate">
        {file ? file.name : 'No file chosen'}
      </span>

      <Button
        type="submit"
        disabled={!file || isUploading}
        className="ml-auto bg-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isUploading ? 'Uploading...' : 'Submit'}
      </Button>
    </form>
  );
};

export default UploadForm;
