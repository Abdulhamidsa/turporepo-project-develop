import { useState } from 'react';

import CustomModal from '@repo/ui/components/CustomModal';
import { Avatar, AvatarFallback, AvatarImage } from '@repo/ui/components/ui/avatar';
import { Badge } from '@repo/ui/components/ui/badge';
import { Button } from '@repo/ui/components/ui/button';
import { showToast } from '@repo/ui/components/ui/toaster';
import { getProjectMediaUrl } from '@repo/utils/imageOptimization';
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
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const { loggedUser } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { deleteProject } = useDeleteProject();
  const { mutate } = useUserProjects();

  const handleImageClick = () => {
    setIsImageModalOpen(true);
  };

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
    <CustomModal size="3xl" isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col md:flex-row gap-4 md:gap-6">
        {/* Image Section */}
        <div className="w-full md:w-1/2">
          <div
            className="relative aspect-video md:aspect-square overflow-hidden rounded-lg bg-muted cursor-pointer"
            onClick={handleImageClick}
          >
            <img
              src={project.media[currentImageIndex].url}
              alt={`Project image ${currentImageIndex + 1}`}
              className="h-full w-full object-contain transition-opacity duration-300"
            />
            {project.media.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background text-foreground border border-border shadow-md"
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background text-foreground border border-border shadow-md"
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                {/* Image indicator dots */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
                  {project.media.map((_, index) => (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentImageIndex(index);
                      }}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentImageIndex ? 'bg-primary' : 'bg-muted-foreground/50'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Content Section */}
        <div className="w-full md:w-1/2 flex flex-col">
          <div className="flex-1 space-y-4">
            {/* Header */}
            <div className="space-y-3">
              <h2 className="text-foreground text-lg md:text-xl font-bold leading-tight">
                {project.title}
              </h2>
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8 md:h-10 md:w-10 border border-border">
                  <AvatarImage src={user.profilePicture} alt={user.username} />
                  <AvatarFallback className="bg-muted text-muted-foreground text-sm">
                    {user.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-muted-foreground text-sm font-medium">{user.username}</span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h3 className="text-foreground font-medium text-sm">Description</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{project.description}</p>
            </div>

            {/* Tags */}
            {project.tags.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-foreground font-medium text-sm">Technologies</h3>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <Badge
                      key={tag.id}
                      variant="secondary"
                      className="bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground text-xs"
                    >
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="mt-6 space-y-3 pt-4 border-t border-border">
            <Button
              asChild
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                Visit Project
              </a>
            </Button>

            {loggedUser?.friendlyId === user.friendlyId && (
              <Button
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsModalOpen(true);
                }}
                className="w-full text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Project
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <CustomModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} size="md">
        <div className="text-center space-y-4">
          <h2 className="text-foreground text-xl font-semibold">Delete Project</h2>
          <p className="text-muted-foreground">
            Are you sure you want to delete{' '}
            <span className="text-destructive font-medium">{project.title}</span>? This action
            cannot be undone.
          </p>
          <div className="flex gap-3 justify-end pt-2">
            <Button variant="outline" onClick={() => setIsModalOpen(false)} disabled={isDeleting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? (
                <Loader className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Trash2 className="h-4 w-4 mr-2" />
              )}
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </div>
      </CustomModal>

      {/* Full-Screen Image Modal */}
      <CustomModal isOpen={isImageModalOpen} onClose={() => setIsImageModalOpen(false)} size="lg">
        <div className="relative w-full h-full flex items-center justify-center bg-black/90 p-8">
          <img
            src={getProjectMediaUrl(project.media[currentImageIndex].url, 1920)}
            alt={`Project image ${currentImageIndex + 1} - Full resolution`}
            className="max-w-[60%] max-h-[60%] object-contain"
          />

          {/* Image navigation for multiple images */}
          {project.media.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-8 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white border-0"
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-8 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white border-0"
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>

              {/* Image counter */}
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                {currentImageIndex + 1} / {project.media.length}
              </div>
            </>
          )}
        </div>
      </CustomModal>
    </CustomModal>
  );
}
