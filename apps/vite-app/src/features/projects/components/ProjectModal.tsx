import { useState } from "react";
import { Button } from "@repo/ui/components/ui/button";
import { Badge } from "@repo/ui/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui/components/ui/avatar";
import { ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import CustomModal from "@repo/ui/components/CustomModal";
import { FetchedProjectType } from "@repo/zod/validation";

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

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === project.media.length - 1 ? 0 : prevIndex + 1));
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? project.media.length - 1 : prevIndex - 1));
  };

  if (!project || !project.media || project.media.length === 0) {
    return null;
  }

  return (
    <CustomModal size="xl" isOpen={isOpen} onClose={onClose}>
      {/* Image Section */}
      <div className="relative h-72 rounded-t-lg overflow-hidden shadow-md">
        <img src={project.media[currentImageIndex].url} alt={`Project image ${currentImageIndex + 1}`} className="w-full h-full object-cover" />
        {project.media.length > 1 && (
          <>
            <Button variant="ghost" size="icon" className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white" onClick={prevImage}>
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button variant="ghost" size="icon" className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white" onClick={nextImage}>
              <ChevronRight className="h-6 w-6" />
            </Button>
          </>
        )}
      </div>

      {/* Content Section */}
      <div className="p-6 bg-card rounded-b-lg">
        <div className="flex items-start justify-between mb-4">
          {/* Project Title */}
          <div>
            <h2 className="text-2xl font-bold text-primary leading-tight">{project.title}</h2>
            <div className="flex items-center mt-2 space-x-2">
              <Avatar className="w-10 h-10 border border-border">
                <AvatarImage src={user.profilePicture} alt={user.username} />
                <AvatarFallback>{user.username.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-muted-foreground">{user.username}</span>
            </div>
          </div>
        </div>

        {/* Project Description */}
        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{project.description}</p>

        {/* Tags Section */}
        <div className="flex flex-wrap gap-2 mb-6">
          {project.tags.map((tag) => (
            <Badge key={tag.id} variant="secondary" className="bg-accent text-accent-foreground rounded-full px-3 py-1 shadow-sm">
              {tag.name}
            </Badge>
          ))}
        </div>

        {/* Visit Project Button */}
        <Button asChild className="w-full py-3 bg-primary hover:bg-accent text-primary-foreground font-semibold rounded-lg transition">
          <a href={project.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
            <ExternalLink className="mr-2 h-5 w-5" /> Visit Project
          </a>
        </Button>
      </div>
    </CustomModal>
  );
}
