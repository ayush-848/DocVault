import { useEffect, useState } from 'react';
import UploadForm from '../components/UploadForm';
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
    <div className="rounded-lg border border-border p-4 space-y-4">
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-32 w-full rounded-md" />
      <div className="flex gap-2">
        <Skeleton className="h-8 w-1/2 rounded-md" />
        <Skeleton className="h-8 w-1/2 rounded-md" />
      </div>
    </div>
  );

  return (
    <div className="p-4 sm:p-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight font-mono">
          Welcome{user?.username ? `, ${user.username}` : ''} 👋
        </h1>
        <p className="text-muted-foreground text-sm mt-1 font-mono">
          Manage and analyze your documents efficiently.
        </p>
      </div>

      {/* Storage Usage */}
      <div className="bg-card border border-border shadow-sm rounded-lg p-4 sm:p-6 space-y-3">
        <h2 className="text-xl font-semibold font-mono">Storage Usage</h2>
        <div className="flex justify-between text-sm font-mono text-muted-foreground">
          <span>
            {storage.usedMB} MB of {storage.maxMB} MB used ({storage.usagePercent}%)
          </span>
          <span>{storage.remainingMB} MB left</span>
        </div>
        <Progress value={storage.usagePercent} className="h-3 rounded-full" />
      </div>

      {/* Upload Form */}
      <div className="bg-card border border-border shadow-sm rounded-lg p-4 sm:p-6 space-y-4">
        <h2 className="text-xl font-semibold font-mono">Upload New Document</h2>
        <UploadForm onDone={fetchDocs} />
      </div>

      {/* Documents */}
      <div>
        <h2 className="text-xl font-semibold mb-4 font-mono">Your Documents</h2>

        {loading ? (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, idx) => (
              <SkeletonCard key={idx} />
            ))}
          </div>
        ) : docs.length === 0 ? (
          <div className="text-muted-foreground italic text-center py-10 font-mono">
            No documents uploaded yet.
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
    </div>
  );
}
