import { Dispatch, SetStateAction } from 'react';

import { Dialog, DialogContent } from '@repo/ui/components/ui/dialog';

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
      <DialogContent className="h-auto max-w-xl p-0">
        <div className="relative h-auto w-full">
          <img
            src={pictureUrl ?? '/placeholder.jpg'}
            alt="Profile Picture"
            className="h-auto w-full object-contain"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
