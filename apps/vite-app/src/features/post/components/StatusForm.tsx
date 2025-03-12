'use client';

import { useEffect, useState } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@repo/ui/components/ui/avatar';
import { showToast } from '@repo/ui/components/ui/toaster';
import { Link } from 'react-router-dom';

import { routesConfig } from '../../../../routes/routesConfig';
import { usePostSubmit } from '../../../hooks/useCreatePost';
import SaveButton from '../../projects/components/SaveButton';
import { useAuth } from '../../user/hooks/use.auth';
import { useUserProfile } from '../../user/hooks/use.user.profile';

export function StatusForm({
  onClose,
  initialContent = '',
}: {
  onClose: () => void;
  initialContent?: string;
}) {
  const { userProfile } = useUserProfile();
  const { loggedUser } = useAuth();

  const friendlyId = userProfile?.friendlyId ?? '';
  const [content, setContent] = useState<string>(initialContent);

  // Set initial content when the component mounts or when initialContent changes
  useEffect(() => {
    if (initialContent) {
      setContent(initialContent);
    }
  }, [initialContent]);

  const { trigger, error } = usePostSubmit(friendlyId);
  const [progress, setProgress] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async () => {
    if (!content.trim()) {
      showToast('Status cannot be empty.', 'error');
      return;
    }

    try {
      setIsLoading(true);
      setProgress(50);

      const payload = { content };
      await trigger(payload);

      setProgress(100);
      await new Promise((resolve) => setTimeout(resolve, 500));

      setProgress(0);
      setIsLoading(false);
      showToast('Status updated successfully!', 'success');
      onClose();
    } catch (err) {
      console.error('Error posting status:', err);
      showToast('Failed to post status.', 'error');
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-card text-card-foreground mx-auto w-full max-w-lg rounded-lg p-4 shadow-lg sm:p-6">
      <h3 className="text-foreground pb-4 text-xl font-semibold">Post a Status</h3>

      <div className="mb-4 flex items-center space-x-3">
        <Link to={loggedUser?.friendlyId ? routesConfig.userPortfolio(loggedUser.friendlyId) : '#'}>
          <Avatar className="h-12 w-12">
            <AvatarImage src={loggedUser?.profilePicture} />
            <AvatarFallback>{loggedUser?.username?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
          </Avatar>
        </Link>
        <span className="text-foreground text-sm font-semibold sm:text-base">
          {userProfile.username}
        </span>
      </div>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's on your mind?"
        className="border-border bg-muted text-muted-foreground focus:ring-primary h-28 w-full rounded-md border p-3 text-sm focus:outline-none focus:ring-2 sm:text-base"
      />

      <div className="flex justify-end pt-4">
        <SaveButton onClick={handleSubmit} loading={isLoading} label="Post" progress={progress} />
      </div>

      {error && <p className="mt-2 text-center text-sm text-red-500">{error.message}</p>}
    </div>
  );
}
