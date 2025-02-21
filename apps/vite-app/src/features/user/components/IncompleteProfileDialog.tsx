import { Dispatch, SetStateAction } from 'react';

import { Button } from '@repo/ui/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@repo/ui/components/ui/dialog';
import { Link } from 'react-router-dom';

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
              Your profile is currently private. To make it visible on the public domain, please
              complete the required details. Once added, your public profile will be available on
              <Link
                to="https://profoliohub.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary ml-1 underline"
              >
                profoliohub.vercel.app
              </Link>
              .
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
