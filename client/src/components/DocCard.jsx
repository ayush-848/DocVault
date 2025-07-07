import { useCallback } from 'react';
import { Trash2, Share2 } from 'lucide-react';
import DeleteConfirmDialog from './DeleteConfirmDialog';
import ShareDialog from './ShareDialog';

export default function DocCard({ doc, onView, onDelete }) {
  const getThumioThumbnail = useCallback(() => {
    if (doc?.publicUrl?.endsWith('.pdf')) {
      const encodedUrl = doc.publicUrl;
      return `https://image.thum.io/get/pdfSource/width/400/page/1/${encodedUrl}`;
    }
    return null;
  }, [doc]);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const parseTitle = (title) => {
    try {
      const len = title.length;
      return len > 25 ? `${title.slice(0, 22)}...` : title;
    } catch {
      return 'Unknown';
    }
  };

  const formatSize = (bytes) => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };

  const thumbnail = getThumioThumbnail();

  return (
    <div className="bg-card p-4 border rounded-lg shadow-sm space-y-2 font-mono relative">
      <h3 className="font-bold text-lg break-words">{parseTitle(doc.title)}</h3>

      {thumbnail && (
        <div className="w-full h-44 aspect-[3/4] bg-white rounded-md overflow-hidden border">
          <img
            src={thumbnail}
            alt={`Thumbnail for ${doc.title}`}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="text-sm text-muted-foreground space-y-1">
        <p>📅 {formatDate(doc.created_at)}</p>
        <p>🌐 Language: {doc.language}</p>
        <p>💾 Size: {formatSize(doc.size || 0)}</p>
      </div>

      <div className="flex justify-between items-center pt-2">
        <span
          onClick={() => onView(doc.id)}
          className="text-blue-500 hover:underline text-sm cursor-pointer"
        >
          View
        </span>

        <ShareDialog
          docId={doc.id}
          trigger={
            <span
              className="text-emerald-500 hover:text-emerald-600 cursor-pointer"
              title="Share Document"
            >
              <Share2 size={16} />
            </span>
          }
        />

        <DeleteConfirmDialog onConfirm={() => onDelete(doc.id)}>
          <span
            className="text-red-500 hover:text-red-600 cursor-pointer"
            title="Delete Document"
          >
            <Trash2 size={16} />
          </span>
        </DeleteConfirmDialog>
      </div>
    </div>
  );
}
