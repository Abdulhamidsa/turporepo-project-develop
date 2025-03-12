import { useState } from 'react';

import { Button } from '@repo/ui/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@repo/ui/components/ui/dialog';
import { Textarea } from '@repo/ui/components/ui/textarea';
import { Send } from 'lucide-react';

export default function StatusUpdate() {
  const [status, setStatus] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handlePost = () => {
    if (status.trim()) {
      setStatus('');
      setIsDialogOpen(false);
    }
  };

  return (
    <div>
      <div className="bg-card mb-6 hidden space-y-4 rounded-lg p-4 shadow md:block">
        <Textarea
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          placeholder="What's on your mind?"
          className="border-border focus:ring-primary w-full rounded-md border px-3 py-2 text-sm focus:outline-none"
        />

        <div className="flex justify-end">
          <Button
            onClick={handlePost}
            variant="ghost"
            className="text-primary hover:bg-muted rounded-md px-2 py-1"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Status</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              placeholder="What's on your mind?"
              className="border-border focus:ring-primary w-full rounded-md border px-3 py-2 text-sm focus:outline-none"
            />
          </div>
          <DialogFooter>
            <Button
              onClick={handlePost}
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 text-sm"
            >
              Post
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
