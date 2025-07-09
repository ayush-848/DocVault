import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';

export default function DeleteConfirmDialog({ children, onConfirm }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 3500));
      await onConfirm();
      setOpen(false); // Close after successful delete
    } catch (err) {
      console.error('Delete error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            <span className="text-red-500">Delete</span> this file?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. The file will be permanently deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel className='cursor-pointer' disabled={loading}>Cancel</AlertDialogCancel>
          <button
            onClick={handleDelete}
            disabled={loading}
            className={`bg-red-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-red-700 transition-all ${
              loading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer hover:opacity-90'
            }`}
          >
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
