import { useState } from 'react';

import CustomModal from '@repo/ui/components/CustomModal';
import { Avatar, AvatarFallback, AvatarImage } from '@repo/ui/components/ui/avatar';
import { Badge } from '@repo/ui/components/ui/badge';
import { Button } from '@repo/ui/components/ui/button';
import { showToast } from '@repo/ui/components/ui/toaster';
import { FetchedProjectType } from '@repo/zod/validation';
import { ChevronLeft, ChevronRight, ExternalLink, Loader, Trash2 } from 'lucide-react';

import { useDeleteProject } from '../../../hooks/useDeleteProject';
import { useAuth } from '../../user/hooks/use.auth';
import { useUserProjects } from '../../user/hooks/useUserProjects';

interface ProjectModalProps {
  project: FetchedProjectType;
  user: {
    friendlyId: string;
    username: string;
    profilePicture: string;
  };
  isOpen: boolean;
  onClose: () => void;
}

export default function ProjectModal({ project, user, isOpen, onClose }: ProjectModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { loggedUser } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { deleteProject } = useDeleteProject();
  const { mutate } = useUserProjects();

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === project.media.length - 1 ? 0 : prevIndex + 1,
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? project.media.length - 1 : prevIndex - 1,
    );
  };

  const handleDelete = async () => {
    const projectId = project.id;
    setIsDeleting(true);

    try {
      await deleteProject(projectId);
      mutate();

      setIsModalOpen(false);
      showToast('Project deleted successfully!', 'success');
      onClose(); // Close the main modal after successful deletion
    } catch (error) {
      showToast('Failed to delete project. Please try again later.', 'error');
      console.error('Failed to delete project:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!project || !project.media || project.media.length === 0) {
    return null;
  }

  return (
    <CustomModal size="2xl" isOpen={isOpen} onClose={onClose}>
      <div className="relative h-72 overflow-hidden rounded-t-lg shadow-md">
        <img
          src={project.media[currentImageIndex].url}
          alt={`Project image ${currentImageIndex + 1}`}
          className="h-full w-full object-cover"
        />
        {project.media.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 transform bg-black bg-opacity-50 text-white hover:bg-opacity-75"
              onClick={prevImage}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 transform bg-black bg-opacity-50 text-white hover:bg-opacity-75"
              onClick={nextImage}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </>
        )}
      </div>
      {/* Content Section */}
      <div className="bg-card rounded-b-lg p-6">
        <div className="mb-4">
          {/* Project Title */}
          <h2 className="text-primary text-2xl font-bold leading-tight">{project.title}</h2>
          <div className="mt-2 flex items-center space-x-2">
            <Avatar className="border-border h-10 w-10 border">
              <AvatarImage src={user.profilePicture} alt={user.username} />
              <AvatarFallback>{user.username.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-muted-foreground text-sm font-medium">{user.username}</span>
          </div>
        </div>

        {/* Project Description */}
        <p className="text-muted-foreground mb-4 text-sm leading-relaxed">{project.description}</p>

        {/* Tags Section */}
        <div className="mb-6 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <Badge
              key={tag.id}
              variant="secondary"
              className="bg-accent text-accent-foreground rounded-full px-3 py-1 shadow-sm"
            >
              {tag.name}
            </Badge>
          ))}
        </div>

        {/* Visit Project Button */}
        <Button
          asChild
          className="bg-primary hover:bg-accent text-primary-foreground w-full rounded-lg py-3 font-semibold transition"
        >
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center"
          >
            <ExternalLink className="mr-2 h-5 w-5" /> Visit Project
          </a>
        </Button>

        {/* Delete Button moved to the end */}
        {loggedUser?.friendlyId === user.friendlyId && (
          <div className="mt-4 flex justify-end">
            <Button
              variant="destructive"
              onClick={(e) => {
                e.stopPropagation();
                setIsModalOpen(true);
              }}
              className="flex items-center space-x-2 rounded bg-red-600 p-2 text-white transition-all duration-300 hover:bg-red-700"
            >
              <Trash2 className="h-5 w-5" />
              <span>Delete</span>
            </Button>
          </div>
        )}
      </div>
      {/* Custom Delete Confirmation Modal */}
      <CustomModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} size="md">
        <h2 className="mb-4 text-center text-xl font-semibold">Delete Project</h2>
        <p className="text-muted-foreground mb-6 text-center">
          Are you sure you want to delete the project{' '}
          <span className="text-destructive font-bold">{project.title}</span>? This action cannot be
          undone.
        </p>
        <div className="flex justify-end space-x-4">
          <Button variant="outline" onClick={() => setIsModalOpen(false)} disabled={isDeleting}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? <Loader className="h-5 w-5 animate-spin" /> : 'Delete'}
          </Button>
        </div>
      </CustomModal>
    </CustomModal>
  );
}
