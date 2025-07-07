import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function SharedViewer() {
  const { shareId } = useParams();
  const [pdfUrl, setPdfUrl] = useState('');

  useEffect(() => {
  const openPDF = async () => {
    try {
      const fileUrl = `${import.meta.env.VITE_API_URL}/documents/share/${shareId}`;
        window.location.href = fileUrl; // Or use window.open(fileUrl, '_blank');
      setPdfUrl(fileUrl);
    } catch (err) {
      console.error('Redirect failed:', err);
    }
  };

  openPDF();
}, [shareId]);

  if (!pdfUrl) return <div className="text-center mt-10">Loading...</div>;

  return (
    <iframe
      src={pdfUrl}
      title="Shared Document"
      className="w-full h-screen"
      style={{ border: 'none' }}
    />
  );
}
