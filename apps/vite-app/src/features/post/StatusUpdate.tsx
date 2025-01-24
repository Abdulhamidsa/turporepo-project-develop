import { useState } from "react";
import { Button } from "@repo/ui/components/ui/button";
import { Textarea } from "@repo/ui/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@repo/ui/components/ui/dialog";
import { Send } from "lucide-react";

export default function StatusUpdate() {
  const [status, setStatus] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handlePost = () => {
    if (status.trim()) {
      alert(`Posting status: ${status}`);
      setStatus(""); // Reset input
      setIsDialogOpen(false); // Close modal
    }
  };

  return (
    <div>
      {/* Full Status Update UI for Larger Screens */}
      <div className="hidden md:block bg-card p-4 rounded-lg shadow mb-6 space-y-4">
        {/* Textarea */}
        <Textarea value={status} onChange={(e) => setStatus(e.target.value)} placeholder="What's on your mind?" className="w-full border border-border focus:ring-primary focus:outline-none rounded-md px-3 py-2 text-sm" />

        {/* Post Button */}
        <div className="flex justify-end">
          <Button onClick={handlePost} variant="ghost" className="px-2 py-1 text-primary hover:bg-muted rounded-md">
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Modal for Adding Status */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Status</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Textarea */}
            <Textarea value={status} onChange={(e) => setStatus(e.target.value)} placeholder="What's on your mind?" className="w-full border border-border focus:ring-primary focus:outline-none rounded-md px-3 py-2 text-sm" />
          </div>
          <DialogFooter>
            <Button onClick={handlePost} className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
              Post
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
