import { useState } from 'react';

import CustomModal from '@repo/ui/components/CustomModal';
// import { Switch } from '@repo/ui/components/ui/switch';
import { showToast } from '@repo/ui/components/ui/toaster';
import { useNavigate } from 'react-router-dom';

import { useDeleteAccount } from '../features/user/hooks/use.auth';

export default function SettingsPage() {
  // const [isPublic, setIsPublic] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const navigate = useNavigate();

  const { deleteAccount, isSubmitting } = useDeleteAccount();

  // const handleTogglePublic = () => {
  //   setIsPublic((prev) => !prev);
  //   showToast(`Account is now ${!isPublic ? 'public' : 'private'}`, 'success');
  // };

  const handleDeleteAccount = () => {
    setDeleteModalOpen(true);
  };

  const confirmDeleteAccount = async () => {
    try {
      await deleteAccount();
      showToast('Your account has been deleted.', 'success');
      navigate('/auth');
    } catch (error) {
      showToast('Failed to delete account. Please try again.', 'error');
      console.error('Delete Account Error:', error);
    } finally {
      setDeleteModalOpen(false);
    }
  };

  return (
    <div className="bg-card mx-auto max-w-xl rounded-lg p-6 shadow-lg">
      <h1 className="text-foreground mb-6 text-center text-3xl font-bold">Settings</h1>

      <div className="space-y-6">
        {/* <div className="bg-muted flex items-center justify-between rounded-lg p-4">
          <div>
            <h2 className="text-lg font-medium">Account Visibility</h2>
            <p className="text-muted-foreground text-sm">
              {isPublic ? 'Your account is public.' : 'Your account is private.'}
            </p>
          </div>
          <Switch checked={isPublic} onCheckedChange={handleTogglePublic} />
        </div> */}

        <div className="bg-destructive/10 rounded-lg p-4">
          <h2 className="text-destructive text-lg font-medium">Delete Account</h2>
          <p className="text-destructive-foreground mb-4 text-sm">
            Deleting your account is irreversible. Proceed with caution.
          </p>
          <button
            onClick={handleDeleteAccount}
            className="text-destructive-foreground bg-destructive hover:bg-destructive/90 w-full rounded-lg px-4 py-2 text-sm font-medium transition"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Deleting...' : 'Delete Your Account'}
          </button>
        </div>
      </div>

      <CustomModal isOpen={isDeleteModalOpen} onClose={() => setDeleteModalOpen(false)} size="md">
        <h2 className="text-destructive text-xl font-bold">Confirm Account Deletion</h2>
        <p className="text-muted-foreground mt-2 text-sm">
          Are you sure you want to delete your account? This action cannot be undone.
        </p>
        <div className="mt-4 flex justify-end space-x-4">
          <button
            onClick={() => setDeleteModalOpen(false)}
            className="bg-muted rounded-md px-4 py-2"
          >
            Cancel
          </button>
          <button
            onClick={confirmDeleteAccount}
            className="bg-destructive rounded-md px-4 py-2 text-white"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </CustomModal>
    </div>
  );
}
