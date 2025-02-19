import { useState } from 'react';

import CustomModal from '@repo/ui/components/CustomModal';
import { Switch } from '@repo/ui/components/ui/switch';
import { showToast } from '@repo/ui/components/ui/toaster';

export default function SettingsPage() {
  const [isPublic, setIsPublic] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  const handleTogglePublic = () => {
    setIsPublic((prev) => !prev);
    showToast(`Account is now ${!isPublic ? 'public' : 'private'}`, 'success');
  };

  const handleDeleteAccount = () => {
    setDeleteModalOpen(true);
  };

  const confirmDeleteAccount = () => {
    setDeleteModalOpen(false);
    showToast('Your account has been deleted.', 'success');
    // Add logic for deleting account here
  };

  return (
    <div className="bg-card mx-auto max-w-xl rounded-lg p-6 shadow-lg">
      <h1 className="text-foreground mb-6 text-center text-3xl font-bold">Settings</h1>

      <div className="space-y-6">
        {/* Toggle Switch for Account Public/Private */}
        <div className="bg-muted flex items-center justify-between rounded-lg p-4">
          <div>
            <h2 className="text-lg font-medium">Account Visibility</h2>
            <p className="text-muted-foreground text-sm">
              {isPublic ? 'Your account is public.' : 'Your account is private.'}
            </p>
          </div>
          <Switch checked={isPublic} onCheckedChange={handleTogglePublic} />
        </div>

        {/* Delete Account Section */}
        <div className="bg-destructive/10 rounded-lg p-4">
          <h2 className="text-destructive text-lg font-medium">Delete Account</h2>
          <p className="text-destructive-foreground mb-4 text-sm">
            Deleting your account is irreversible. Proceed with caution.
          </p>
          <button
            onClick={handleDeleteAccount}
            className="text-destructive-foreground bg-destructive hover:bg-destructive/90 w-full rounded-lg px-4 py-2 text-sm font-medium transition"
          >
            Delete Your Account
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      <CustomModal isOpen={isDeleteModalOpen} onClose={() => setDeleteModalOpen(false)} size="md">
        <h2 className="text-destructive text-xl font-bold">Confirm Account Deletion</h2>
        <p className="text-muted-foreground mt-2 text-sm">
          Are you sure you want to delete your account? This action cannot be undone.
        </p>
        <div className="mt-4 flex justify-end space-x-4">
          <button
            onClick={() => setDeleteModalOpen(false)}
            className="bg-muted text-muted-foreground hover:bg-muted/80 rounded-md px-4 py-2 transition"
          >
            Cancel
          </button>
          <button
            onClick={confirmDeleteAccount}
            className="bg-destructive hover:bg-destructive/80 rounded-md px-4 py-2 text-white transition"
          >
            Delete
          </button>
        </div>
      </CustomModal>
    </div>
  );
}
