import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import api from '../services/api';
import DocCard from '../components/DocCard';
import toast from '@/utils/toast';

export default function Dashboard() {
  const [docs, setDocs] = useState([]);
  const [storage, setStorage] = useState({
    usedMB: 0,
    remainingMB: 500,
    usagePercent: 0,
    maxMB: 500,
  });
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();

  const fetchDocs = async () => {
    try {
      setLoading(true);
      const { documents, storage } = await api.getAllDocs();
      setDocs(documents);
      setStorage(storage);
    } catch (err) {
      console.error('Error fetching documents:', err);
      toast.error('❌ Failed to fetch documents.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

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
      console.error('❌ Failed to open document:', err);
      toast.error('❌ Unable to open document. Please try again.');
    }
  };

  const deleteDocument = async (docId) => {
    try {
      await api.deleteDoc(docId);
      await fetchDocs();
      toast.success('✅ Document deleted successfully!');
    } catch (err) {
      console.error('❌ Failed to delete document:', err);
      toast.error('❌ Failed to delete document. Please try again.');
    }
  };

  const SkeletonCard = () => (
    <div className="rounded-lg border border-border bg-muted/10 p-4 space-y-4 shadow-sm">
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-32 w-full rounded-md" />
      <div className="flex gap-2">
        <Skeleton className="h-8 w-1/2 rounded-md" />
        <Skeleton className="h-8 w-1/2 rounded-md" />
      </div>
    </div>
  );

  return (
    <div className="p-4 sm:p-6 space-y-10 font-mono">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Welcome{user?.username ? `, ${user.username}` : ''} 👋
        </h1>
        <p className="text-muted-foreground text-md mt-1">
          Manage your documents efficiently.
        </p>
      </div>

      {/* Storage Usage */}
      <div className="bg-card border border-border shadow-md rounded-xl p-6 space-y-4">
        <h2 className="text-xl font-semibold">Storage Usage</h2>
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>
            {storage.usedMB} MB of {storage.maxMB} MB used ({storage.usagePercent}%)
          </span>
          <span>{storage.remainingMB} MB left</span>
        </div>
        <Progress value={storage.usagePercent} className="h-3 rounded-full" />
      </div>

      {/* Upload Button */}
      <div className="text-center">
        <a
          href="/upload"
          className="inline-block bg-[#539d89] dark:bg-[#1b765e] text-black dark:text-white font-semibold py-3 px-6 rounded-md transition duration-200"
        >Upload New PDF
        </a>
      </div>

      {/* Documents */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Your Recent Documents</h2>

        {loading ? (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, idx) => (
              <SkeletonCard key={idx} />
            ))}
          </div>
        ) : docs.length === 0 ? (
          <div className="text-muted-foreground italic text-center py-10">
            No documents uploaded yet.
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {docs.slice(0, 3).map((doc) => (
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
    </div>
  );
}
