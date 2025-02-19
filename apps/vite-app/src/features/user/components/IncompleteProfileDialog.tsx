import { Dispatch, SetStateAction } from 'react';

import { Button } from '@repo/ui/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@repo/ui/components/ui/dialog';

interface IncompleteProfileDialogProps {
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
  modalContent: string[];
}

export default function IncompleteProfileDialog({
  showModal,
  setShowModal,
  modalContent,
}: IncompleteProfileDialogProps) {
  return (
    <Dialog open={showModal} onOpenChange={setShowModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Profile Incomplete</DialogTitle>
          <DialogDescription>
            <p>
              Your profile is currently private. To make it public, please complete the following
              fields:
            </p>
            <ul className="mt-2 list-inside list-disc">
              {modalContent.map((field, index) => (
                <li key={index}>{field}</li>
              ))}
            </ul>
          </DialogDescription>
        </DialogHeader>
        <Button onClick={() => setShowModal(false)}>Close</Button>
      </DialogContent>
    </Dialog>
  );
}
