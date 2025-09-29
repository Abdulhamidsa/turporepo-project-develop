import { useState } from 'react';

import { Badge } from '@repo/ui/components/ui/badge';
import { Button } from '@repo/ui/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@repo/ui/components/ui/dialog';
import {
  Calendar,
  ExternalLink,
  Github,
  Globe,
  Image as ImageIcon,
  Lock,
  LogIn,
  User,
} from 'lucide-react';
import { Link } from 'react-router-dom';

import { routesConfig } from '../../routes/routesConfig';
import { useAuth } from '../features/user/hooks/use.auth';

interface ProjectOwner {
  id: string | number;
  username?: string;
  profilePicture?: string;
  friendlyId?: string;
  profession?: string;
}

interface ProjectType {
  id: string | number;
  title: string;
  description?: string;
  coverImage?: string;
  shortDescription?: string;
  createdAt?: string | Date;
  repoUrl?: string;
  demoUrl?: string;
  tags?: { id: string | number; name: string }[];
  owner?: ProjectOwner;
}

interface ProjectCardModalProps {
  project: ProjectType | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ProjectCardModal({ project, isOpen, onOpenChange }: ProjectCardModalProps) {
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const { isAuthenticated } = useAuth();

  if (!project) return null;

  const handleViewFullProject = () => {
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
    } else {
      // If authenticated, navigate to the full project page
      window.location.href = `/projects/${project.id}`;
    }
  };

  const formatDate = (dateStr?: string | Date) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md p-0 overflow-hidden">
          {/* Project Cover Image */}
          <div className="relative h-40 w-full bg-muted">
            {project.coverImage ? (
              <img
                src={project.coverImage}
                alt={project.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-primary/10">
                <ImageIcon className="h-10 w-10 text-primary/40" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
          </div>

          <DialogHeader className="px-6 pt-4 pb-2">
            <DialogTitle className="text-xl font-semibold">{project.title}</DialogTitle>
            <DialogDescription className="flex items-center pt-1 text-sm">
              <Calendar className="mr-1.5 h-3.5 w-3.5" />
              {formatDate(project.createdAt)}
            </DialogDescription>
          </DialogHeader>

          <div className="px-6 pb-6 space-y-4">
            {/* Description - Limited preview if not authenticated */}
            {project.description && (
              <div className="text-sm text-muted-foreground">
                {isAuthenticated
                  ? project.description
                  : project.description.length > 120
                    ? `${project.description.substring(0, 120)}...`
                    : project.description}

                {!isAuthenticated && project.description.length > 120 && (
                  <p className="text-xs text-primary mt-1.5 flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    Login to see the full project description
                  </p>
                )}
              </div>
            )}

            {/* Tags/Technologies */}
            {project.tags && project.tags.length > 0 && (
              <div>
                <h4 className="text-xs uppercase font-medium text-muted-foreground mb-2">
                  Technologies
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {project.tags.map((tag, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Project Links - Limited if not authenticated */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              {project.repoUrl && (
                <a
                  href={isAuthenticated ? project.repoUrl : '#'}
                  onClick={(e) =>
                    !isAuthenticated && (e.preventDefault(), setShowLoginPrompt(true))
                  }
                  className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Github className="h-4 w-4" />
                  <span className="truncate">View Source</span>
                  {!isAuthenticated && <Lock className="h-3 w-3 ml-1 text-primary" />}
                </a>
              )}

              {project.demoUrl && (
                <a
                  href={isAuthenticated ? project.demoUrl : '#'}
                  onClick={(e) =>
                    !isAuthenticated && (e.preventDefault(), setShowLoginPrompt(true))
                  }
                  className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Globe className="h-4 w-4" />
                  <span className="truncate">Live Demo</span>
                  {!isAuthenticated && <Lock className="h-3 w-3 ml-1 text-primary" />}
                </a>
              )}
            </div>

            {/* Project Owner */}
            {project.owner && (
              <div className="border-t border-border pt-3 mt-3">
                <h4 className="text-xs uppercase font-medium text-muted-foreground mb-2">
                  Created by
                </h4>
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full overflow-hidden bg-muted mr-2">
                    {project.owner.profilePicture ? (
                      <img
                        src={project.owner.profilePicture}
                        alt={project.owner.username || 'User'}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-primary/10">
                        <User className="h-4 w-4 text-primary/60" />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{project.owner.username}</p>
                    <p className="text-xs text-muted-foreground">{project.owner.profession}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Action Button */}
            <div className="pt-3">
              <Button
                onClick={handleViewFullProject}
                className="w-full bg-primary hover:bg-primary/90"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                {isAuthenticated ? 'View Full Project' : 'View Project Details'}
              </Button>

              {!isAuthenticated && (
                <div className="text-xs text-muted-foreground text-center mt-3">
                  Sign in to access full project details and resources
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Login Prompt Dialog */}
      <Dialog open={showLoginPrompt} onOpenChange={setShowLoginPrompt}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Sign in required</DialogTitle>
            <DialogDescription>
              You need to be signed in to view the complete project details and resources.
            </DialogDescription>
          </DialogHeader>

          <p className="text-sm text-muted-foreground">
            Create an account or sign in to access source code, live demos, and full project
            documentation.
          </p>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLoginPrompt(false)}>
              Cancel
            </Button>
            <Link to={routesConfig.login}>
              <Button className="bg-primary hover:bg-primary/90">
                <LogIn className="w-4 h-4 mr-1" />
                Sign In
              </Button>
            </Link>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
