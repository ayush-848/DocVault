import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function SharedViewer() {
  const { shareId } = useParams();
  const [pdfUrl, setPdfUrl] = useState('');

  useEffect(() => {
    const fetchSharedDoc = async () => {
      try {
          const fileUrl = `${import.meta.env.VITE_API_URL}/documents/share/${shareId}`;
          setPdfUrl(fileUrl);
        
      } catch (error) {
        console.error('Failed to load shared document:', error);
      }
    };

    fetchSharedDoc();
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
