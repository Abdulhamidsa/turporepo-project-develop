import { useState } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@repo/ui/components/ui/avatar';
import { Button } from '@repo/ui/components/ui/button';
import { Input } from '@repo/ui/components/ui/input';
import { Edit, FolderPlus } from 'lucide-react';

import CustomModal from '../../../../../../packages/ui/src/components/CustomModal';
import AddProjectModal from '../../projects/components/addProjectModal';
import { useAuth } from '../hooks/use.auth';
import { PostForm } from './PostForm';

export function AddContentButton() {
  const [isPostDialogOpen, setIsPostDialogOpen] = useState(false);
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);
  const { loggedUser } = useAuth();

  return (
    <div className="bg-card space-y-4 rounded-md p-4 shadow-md">
      {/* Input section like Facebook */}
      <div className="flex items-center space-x-3 sm:space-x-4">
        <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
          <AvatarImage src={loggedUser?.profilePicture || '/placeholder-avatar.png'} />
          <AvatarFallback>{loggedUser?.username.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
        </Avatar>
        <Input
          placeholder="What's on your mind?"
          className="bg-background border-muted flex-1 cursor-pointer rounded-full border py-2 text-sm focus:ring-0 sm:py-3 sm:text-base"
          onClick={() => setIsPostDialogOpen(true)}
          readOnly
        />
      </div>

      {/* Buttons Section */}
      <div className="flex flex-col gap-2 sm:flex-row sm:justify-around sm:gap-0">
        <Button
          variant="ghost"
          className="flex w-full items-center justify-center space-x-2 hover:bg-white hover:text-black sm:w-auto"
          onClick={() => setIsPostDialogOpen(true)}
        >
          <Edit className="text-primary h-5 w-5" />
          <span className="text-sm sm:text-base">Add Post</span>
        </Button>
        <Button
          variant="ghost"
          className="flex w-full items-center justify-center space-x-2 hover:bg-white hover:text-black sm:w-auto"
          onClick={() => setIsProjectDialogOpen(true)}
        >
          <FolderPlus className="text-primary h-5 w-5" />
          <span className="text-sm sm:text-base">Add Project</span>
        </Button>
      </div>

      {/* Modals */}
      <CustomModal isOpen={isPostDialogOpen} onClose={() => setIsPostDialogOpen(false)} size="lg">
        <PostForm onClose={() => setIsPostDialogOpen(false)} />
      </CustomModal>
      <AddProjectModal isOpen={isProjectDialogOpen} onClose={() => setIsProjectDialogOpen(false)} />
    </div>
  );
}
