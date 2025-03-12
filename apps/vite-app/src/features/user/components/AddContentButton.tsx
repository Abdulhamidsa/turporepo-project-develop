import { useState } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@repo/ui/components/ui/avatar';
import { Button } from '@repo/ui/components/ui/button';
import { Card, CardContent } from '@repo/ui/components/ui/card';
import { Textarea } from '@repo/ui/components/ui/textarea';
import { showToast } from '@repo/ui/components/ui/toaster';
import { ImagePlus, Send } from 'lucide-react';
import { Link } from 'react-router-dom';

import CustomModal from '../../../../../../packages/ui/src/components/CustomModal';
import { routesConfig } from '../../../../routes/routesConfig';
import { usePostSubmit } from '../../../hooks/useCreatePost';
import { StatusForm } from '../../post/components/StatusForm';
import { useUserProfile } from '../../user/hooks/use.user.profile';
import { useAuth } from '../hooks/use.auth';
import { PostForm } from './PostForm';

export function AddContentButton() {
  const { loggedUser } = useAuth();
  const { userProfile } = useUserProfile();
  const friendlyId = userProfile?.friendlyId ?? loggedUser?.friendlyId ?? '';

  const [isPostDialogOpen, setIsPostDialogOpen] = useState(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  const [content, setContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  const { trigger, error } = usePostSubmit(friendlyId);

  const handleDirectPost = async () => {
    if (!content.trim()) {
      showToast('Status cannot be empty.', 'error');
      return;
    }

    try {
      setIsPosting(true);
      const payload = { content };
      await trigger(payload);

      setContent('');
      setInputFocused(false);
      showToast('Status posted successfully!', 'success');
    } catch (err) {
      console.error('Error posting status:', err);
      showToast('Failed to post status.', 'error');
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <Card className="bg-background shadow-sm m-auto w-full max-w-xl">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <Link
            to={loggedUser?.friendlyId ? routesConfig.userPortfolio(loggedUser.friendlyId) : '#'}
          >
            <Avatar className="h-12 w-12">
              <AvatarImage src={loggedUser?.profilePicture} />
              <AvatarFallback>{loggedUser?.username?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
            </Avatar>
          </Link>

          <Textarea
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className={`flex-1 bg-muted resize-none rounded-xl px-4 py-2 text-sm border focus:border-primary focus:bg-background transition ${
              inputFocused ? 'h-20' : 'h-10'
            }`}
            onFocus={() => setInputFocused(true)}
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                if (!content.trim()) {
                  setInputFocused(false);
                }
              }
            }}
          />
        </div>

        <div className="flex justify-between mt-3 items-center">
          <Button
            variant="ghost"
            className="flex ml-auto items-center gap-2 px-3 py-2 hover:bg-muted transition"
            onClick={(e) => {
              e.stopPropagation();
              setIsPostDialogOpen(true);
            }}
          >
            <ImagePlus className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium">Add Media</span>
          </Button>

          <Button
            onClick={handleDirectPost}
            disabled={!content.trim() || isPosting}
            size="sm"
            className="flex items-center ml-2 gap-2"
          >
            {isPosting ? 'Posting...' : 'Post'}
            <Send className="h-4 w-4" />
          </Button>
        </div>

        {error && <p className="mt-2 text-sm text-red-500">{error.message}</p>}
      </CardContent>

      <CustomModal
        isOpen={isStatusDialogOpen}
        onClose={() => setIsStatusDialogOpen(false)}
        size="lg"
      >
        <StatusForm onClose={() => setIsStatusDialogOpen(false)} initialContent={content} />
      </CustomModal>

      <CustomModal isOpen={isPostDialogOpen} onClose={() => setIsPostDialogOpen(false)} size="lg">
        <PostForm onClose={() => setIsPostDialogOpen(false)} initialContent={content} />
      </CustomModal>
    </Card>
  );
}
