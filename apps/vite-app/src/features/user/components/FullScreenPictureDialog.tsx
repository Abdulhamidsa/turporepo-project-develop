import { Dispatch, SetStateAction } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@repo/ui/components/ui/avatar';
import { Dialog, DialogContent, DialogTitle } from '@repo/ui/components/ui/dialog';

interface FullScreenPictureDialogProps {
  pictureUrl?: string;
  username?: string | null | undefined;
  friendlyId?: string | undefined;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export default function FullScreenPictureDialog({
  pictureUrl,
  username,
  friendlyId,
  isOpen,
  setIsOpen,
}: FullScreenPictureDialogProps) {
  // Generate initials from username or friendlyId
  const getInitials = () => {
    const name = username || friendlyId || 'User';
    return name
      .split(/[\s-_.]/)
      .filter((part) => part.length > 0)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="h-auto max-w-md p-6 bg-background/95 backdrop-blur">
        {/* Hidden DialogTitle for accessibility */}
        <DialogTitle className="sr-only">Profile Picture</DialogTitle>
        <div className="flex items-center justify-center">
          <div className="relative w-80 h-80 max-w-[90vw] max-h-[90vw]">
            {pictureUrl && pictureUrl !== '/placeholder.png' ? (
              <img
                src={pictureUrl}
                alt="Profile Picture"
                className="w-full h-full object-cover rounded-full border-4 border-border shadow-2xl"
              />
            ) : (
              <Avatar className="w-full h-full border-4 border-border shadow-2xl">
                <AvatarImage src={pictureUrl} className="object-cover" />
                <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white font-bold text-8xl">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
