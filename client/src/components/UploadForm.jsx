// UploadForm.jsx
import React, { useRef, useState } from 'react';
import { extractTextFromPDF } from '../utils/extractPdfText';
import { detectLanguage } from '../utils/detectLanguage';
import { uploadDoc } from '../services/api';
import { Button } from '@/components/ui/button';
import { UploadCloud, X } from 'lucide-react';
import toast from '@/utils/toast';

const UploadForm = ({ onDone }) => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleClearFile = () => {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file || file.type !== 'application/pdf') {
      toast.error('❌ Please select a valid PDF file.');
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
      toast.success('✅ Document uploaded successfully!');
      handleClearFile();
      if (onDone) onDone();
    } catch (err) {
      toast.error('❌ Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const triggerFileInput = () => fileInputRef.current?.click();

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row flex-wrap items-center gap-3 font-mono"
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
        className="flex items-center gap-2 px-3 py-2 w-full sm:w-auto bg-muted border border-border rounded-md text-muted-foreground hover:border-primary transition-all cursor-pointer"
      >
        <UploadCloud className="w-5 h-5" />
        <span className="text-sm truncate max-w-[200px] sm:max-w-[240px]">
          {file ? file.name : 'No file chosen'}
        </span>
        {file && (
          <span
            onClick={(e) => {
              e.stopPropagation();
              handleClearFile();
            }}
            className="ml-auto text-red-500 hover:text-red-700 cursor-pointer"
            title="Remove file"
          >
            <X className="w-4 h-4" />
          </span>
        )}
      </button>

      <Button
        type="submit"
        disabled={!file || isUploading}
        className="w-full sm:w-auto bg-primary transition disabled:opacity-50"
      >
        {isUploading ? 'Uploading...' : 'Submit'}
      </Button>
    </form>
  );
};

export default UploadForm;
