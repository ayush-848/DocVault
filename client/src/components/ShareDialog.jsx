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
import { createShareLink } from '@/services/api';

export default function ShareDialog({ docId, trigger }) {
  const [link, setLink] = useState('');
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleOpen = async () => {
    if (!link) {
      try {
        const generated = await createShareLink(docId);
        setLink(generated.shareUrl || '');
      } catch (err) {
        setLink('Failed to generate link');
      }
    }
    setOpen(true);
  };

  const copyToClipboard = () => {
    if (!link) return;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 5000);
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
          <input readOnly value={link} className="bg-zinc-400 dark:bg-zinc-900 text-gray-700 dark:text-secondary px-3 py-2 rounded-md text-sm overflow-x-auto whitespace-nowrap flex-1 border border-border" />
          <Button
            type="button"
            onClick={copyToClipboard}
            className={`${
              copied ? '' : 'cursor-pointer'
            }`}
          >
            {copied ? 'Copied' : 'Copy'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
