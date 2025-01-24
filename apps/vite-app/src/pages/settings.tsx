import { useState } from "react";
import { Switch } from "@repo/ui/components/ui/switch";
import { showToast } from "@repo/ui/components/ui/toaster";
import CustomModal from "@repo/ui/components/CustomModal";

export default function SettingsPage() {
  const [isPublic, setIsPublic] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  const handleTogglePublic = () => {
    setIsPublic((prev) => !prev);
    showToast(`Account is now ${!isPublic ? "public" : "private"}`, "success");
  };

  const handleDeleteAccount = () => {
    setDeleteModalOpen(true);
  };

  const confirmDeleteAccount = () => {
    setDeleteModalOpen(false);
    showToast("Your account has been deleted.", "success");
    // Add logic for deleting account here
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-card rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-center text-foreground">Settings</h1>

      <div className="space-y-6">
        {/* Toggle Switch for Account Public/Private */}
        <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
          <div>
            <h2 className="text-lg font-medium">Account Visibility</h2>
            <p className="text-sm text-muted-foreground">{isPublic ? "Your account is public." : "Your account is private."}</p>
          </div>
          <Switch checked={isPublic} onCheckedChange={handleTogglePublic} />
        </div>

        {/* Delete Account Section */}
        <div className="p-4 bg-destructive/10 rounded-lg">
          <h2 className="text-lg font-medium text-destructive">Delete Account</h2>
          <p className="text-sm text-destructive-foreground mb-4">Deleting your account is irreversible. Proceed with caution.</p>
          <button onClick={handleDeleteAccount} className="w-full px-4 py-2 text-sm font-medium text-destructive-foreground bg-destructive rounded-lg hover:bg-destructive/90 transition">
            Delete Your Account
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      <CustomModal isOpen={isDeleteModalOpen} onClose={() => setDeleteModalOpen(false)} size="md">
        <h2 className="text-xl font-bold text-destructive">Confirm Account Deletion</h2>
        <p className="text-sm text-muted-foreground mt-2">Are you sure you want to delete your account? This action cannot be undone.</p>
        <div className="mt-4 flex justify-end space-x-4">
          <button onClick={() => setDeleteModalOpen(false)} className="px-4 py-2 bg-muted text-muted-foreground rounded-md hover:bg-muted/80 transition">
            Cancel
          </button>
          <button onClick={confirmDeleteAccount} className="px-4 py-2 bg-destructive text-white rounded-md hover:bg-destructive/80 transition">
            Delete
          </button>
        </div>
      </CustomModal>
    </div>
  );
}
