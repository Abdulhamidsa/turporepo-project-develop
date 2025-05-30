import { useState } from 'react';

import CustomModal from '@repo/ui/components/CustomModal';
import Loading from '@repo/ui/components/ui/Loading';
import { Avatar, AvatarFallback, AvatarImage } from '@repo/ui/components/ui/avatar';
import { Badge } from '@repo/ui/components/ui/badge';
import { Button } from '@repo/ui/components/ui/button';
import { Card, CardContent } from '@repo/ui/components/ui/card';
import { timeAgo } from '@repo/utils/timeCalculation';
import { ChevronLeft, ChevronRight, ExternalLink, FolderPlus } from 'lucide-react';
import { Link } from 'react-router-dom';

import { ProfessionBadge } from '../../../../../../packages/ui/src/components/ProfessionBadge';
import { routesConfig } from '../../../../routes/routesConfig';
import { ProjectType, useProjects } from '../../../hooks/useProjects';
import AddProjectModal from './addProjectModal';

export const ProjectsAll = () => {
  const { projects, isLoading, loadMore } = useProjects();
  const [selectedProject, setSelectedProject] = useState<ProjectType | null>(null);
  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);

  return (
    <div className="relative p-5">
      <div className="flex justify-center mb-6">
        <Button
          onClick={() => setIsAddProjectOpen(true)}
          className="relative flex items-center gap-2 rounded-lg bg-gradient-to-r  px-6 py-3 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-2xl"
          variant="outline"
        >
          <span className="relative flex items-center">
            <FolderPlus className="h-6 w-6 transition-transform duration-200" />
            <span className="ml-2">Add a Project!</span>
          </span>
        </Button>
      </div>

      {/* Projects Grid */}
      {isLoading && projects.length === 0 ? (
        <Loading />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          {projects.map((project: ProjectType) => (
            <ProjectCard
              key={project.id}
              project={project}
              onClick={() => setSelectedProject(project)}
            />
          ))}
        </div>
      )}

      {/* Load More Button */}
      <div className="flex justify-center mt-8">
        <Button onClick={loadMore} className=" border border-primary px-4 py-2 rounded-lg">
          Load More
        </Button>
      </div>

      {/* Modals */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          isOpen={!!selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}

      {isAddProjectOpen && (
        <AddProjectModal isOpen={isAddProjectOpen} onClose={() => setIsAddProjectOpen(false)} />
      )}
    </div>
  );
};

const ProjectCard = ({ project, onClick }: { project: ProjectType; onClick: () => void }) => {
  return (
    <Card className="bg-card text-card-foreground relative w-full overflow-hidden rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
      <div className="relative h-40 w-full cursor-pointer sm:h-56" onClick={onClick}>
        {project.thumbnail ? (
          <img src={project.thumbnail} alt={project.title} className="h-full w-full object-cover" />
        ) : (
          <div className="bg-muted text-muted-foreground flex h-full w-full items-center justify-center">
            No Image Available
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 transition-opacity duration-300 hover:opacity-100">
          <span className="text-lg font-semibold text-white">View Project</span>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-foreground truncate text-lg font-semibold sm:text-xl">
            {project.title}
          </h2>
          <p className="text-xs text-muted-foreground whitespace-nowrap">
            {timeAgo(project.createdAt)}
          </p>
        </div>

        <div className="mt-2 flex items-center gap-3">
          {project.user.friendlyId && (
            <Link to={routesConfig.userPortfolioView(project.user.friendlyId)}>
              <Avatar className="h-12 w-12 flex-shrink-0">
                <AvatarImage src={project.user.profilePicture || '/placeholder.png'} />
                <AvatarFallback className="text-2xl">
                  {project.user.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Link>
          )}

          {/* <Avatar className="h-10 w-10 border border-border ">
            <AvatarImage src={project.user.profilePicture || "/placeholder.png"} />
            <AvatarFallback>{project.user.username.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar> */}
          <div>
            <h4 className="text-foreground pb-1 text-sm font-medium">{project.user.username}</h4>
            <ProfessionBadge profession={project.user.profession} />
          </div>
        </div>

        {/* Project Tags */}
        {project.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {project.tags.slice(0, 3).map((tag: { id: string; name: string }) => (
              <Badge
                key={tag.id}
                className="border-border text-foreground rounded-md border bg-transparent px-3 py-1 text-xs"
              >
                #{tag.name}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const ProjectModal = ({
  project,
  isOpen,
  onClose,
}: {
  project: ProjectType;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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

  if (!project || !project.media || project.media.length === 0) {
    return null;
  }

  return (
    <CustomModal size="2xl" isOpen={isOpen} onClose={onClose}>
      {/* Image Section */}
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
        <div className="mb-4 flex items-start justify-between">
          {/* Project Title */}
          <div>
            <h2 className="text-primary text-2xl font-bold leading-tight">{project.title}</h2>
            <div className="mt-2 flex items-center space-x-2">
              <Avatar className="border-border h-10 w-10 border">
                <AvatarImage
                  src={project.user.profilePicture || '/placeholder.png'}
                  alt={project.user.username}
                />
                <AvatarFallback>{project.user.username.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <span className="text-muted-foreground text-sm font-medium">
                {project.user.username}
              </span>
              <ProfessionBadge profession={project.user.profession} />
            </div>
          </div>
        </div>

        {/* Project Description */}
        <p className="text-muted-foreground mb-4 text-sm leading-relaxed">{project.description}</p>

        {/* Tags Section */}
        <div className="mb-6 flex flex-wrap gap-2">
          {project.tags.map((tag: { id: string; name: string }) => (
            <Badge
              key={tag.id}
              variant="secondary"
              className="border-border text-foreground rounded-md border bg-transparent px-3 py-1 text-xs"
            >
              #{tag.name}
            </Badge>
          ))}
        </div>

        {/* Visit Project Button */}
        {project.url && (
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
        )}
      </div>
    </CustomModal>
  );
};

export default ProjectsAll;
