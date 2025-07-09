import { useEffect, useState } from 'react';
import api from '../services/api';
import DocCard from '../components/DocCard';
import { Skeleton } from '@/components/ui/skeleton';
import toast from '@/utils/toast';

export default function Document() {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAllDocs = async () => {
    try {
      setLoading(true);
      const { documents } = await api.getAllDocs();
      setDocs(documents || []);
    } catch (err) {
      toast.error('❌ Failed to fetch documents.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllDocs();
  }, []);

  const SkeletonCard = () => (
    <div className="rounded-lg border border-border p-4 space-y-4">
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-32 w-full rounded-md" />
      <div className="flex gap-2">
        <Skeleton className="h-8 w-1/2 rounded-md" />
        <Skeleton className="h-8 w-1/2 rounded-md" />
      </div>
    </div>
  );

  const openDocument = async (docId) => {
    try {
      const res = await fetch(api.getDocViewUrl(docId), {
        method: 'GET',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to fetch document');

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      window.location.href = url;
    } catch (err) {
      toast.error('❌ Unable to open document. Please try again.');
    }
  };

  const deleteDocument = async (docId) => {
    try {
      await api.deleteDoc(docId);
      await fetchAllDocs();
      toast.success('✅ Document deleted successfully!');
    } catch (err) {
      toast.error('❌ Failed to delete document. Please try again.');
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-8 min-h-screen">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight font-mono">
          All Documents
        </h1>
        <p className="text-muted-foreground text-md mt-1 font-mono">
          Browse all uploaded documents by you.
        </p>
      </div>

      {loading ? (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, idx) => (
            <SkeletonCard key={idx} />
          ))}
        </div>
      ) : docs.length === 0 ? (
        <div className="text-muted-foreground italic text-center py-10 font-mono">
          No documents available.
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {docs.map((doc) => (
            <DocCard
              key={doc.id}
              doc={doc}
              onView={openDocument}
              onDelete={deleteDocument}
            />
          ))}
        </div>
      )}
    </div>
  );
}
