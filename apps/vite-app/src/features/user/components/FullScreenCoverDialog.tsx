import { Dispatch, SetStateAction } from 'react';

import { Dialog, DialogContent } from '@repo/ui/components/ui/dialog';

interface FullScreenCoverDialogProps {
  coverImage?: string | null;
  isFullScreen: boolean;
  setIsFullScreen: Dispatch<SetStateAction<boolean>>;
}

export default function FullScreenCoverDialog({
  coverImage,
  isFullScreen,
  setIsFullScreen,
}: FullScreenCoverDialogProps) {
  return (
    <Dialog open={isFullScreen} onOpenChange={setIsFullScreen}>
      <DialogContent className="h-auto max-w-4xl p-0">
        <div className="relative h-auto w-full">
          {coverImage && (
            <img src={coverImage} alt="Cover Image" className="h-auto w-full object-contain" />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
