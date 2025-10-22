import { Dispatch, SetStateAction } from 'react';

import { Dialog, DialogContent, DialogTitle } from '@repo/ui/components/ui/dialog';

interface FullScreenPictureDialogProps {
  pictureUrl?: string;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export default function FullScreenPictureDialog({
  pictureUrl,
  isOpen,
  setIsOpen,
}: FullScreenPictureDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="h-auto max-w-md p-6 bg-background/95 backdrop-blur">
        {/* Hidden DialogTitle for accessibility */}
        <DialogTitle className="sr-only">Profile Picture</DialogTitle>
        <div className="flex items-center justify-center">
          <div className="relative w-80 h-80 max-w-[90vw] max-h-[90vw]">
            <img
              src={pictureUrl ?? '/placeholder.jpg'}
              alt="Profile Picture"
              className="w-full h-full object-cover rounded-full border-4 border-border shadow-2xl"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
