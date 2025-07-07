import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { createShareLink } from '@/services/api';

export default function ShareDialog({ docId, trigger }) {
  const [link, setLink] = useState('');
  const [open, setOpen] = useState(false);

  const handleOpen = async () => {
    if (!link) {
      try {
        const generated = await createShareLink(docId);
        console.log('🔗 Share link:', generated); // for debugging
        setLink(generated.shareUrl || ''); // ensure only string is used
      } catch (err) {
        console.error('❌ Share link error:', err);
        toast.error('Failed to generate share link');
      }
    }
    setOpen(true);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(link);
    toast.success('Link copied to clipboard');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <span onClick={handleOpen}>{trigger}</span>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Document</DialogTitle>
          <DialogDescription>
            Send this link to anyone you want to share the document with:
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2 mt-4">
          <Input readOnly value={link} className="flex-1" />
          <Button type="button" onClick={copyToClipboard}>
            Copy
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
