import { useRef, useEffect, useState } from "react";
import { Button } from "@repo/ui/components/ui/button";
import { ArrowUp } from "lucide-react";
import { Card, CardContent } from "@repo/ui/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui/components/ui/avatar";
import CustomModal from "@repo/ui/components/CustomModal";
import { ProjectType, useProjects } from "../hooks/useProjects";
import { Badge } from "@repo/ui/components/ui/badge";
import Loading from "@repo/ui/components/ui/Loading";
import { ProfessionBadge } from "../../../components/ProfessionBadge";

export const ProjectsAll = () => {
  const { projects, isLoading, loadMore } = useProjects();
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const [selectedProject, setSelectedProject] = useState<ProjectType | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) loadMore();
    });

    const currentLoader = loaderRef.current;
    if (currentLoader) observer.observe(currentLoader);

    return () => {
      if (currentLoader) observer.unobserve(currentLoader);
    };
  }, [loadMore]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="p-4">
      {isLoading && projects.length === 0 ? (
        <Loading />
      ) : (
        <div className="grid grid-cols-1 gap-6 w-[500px] m-auto">
          {projects.map((project, index) => (
            <ProjectCard key={`${project.id}-${index}`} project={project} onClick={() => setSelectedProject(project)} />
          ))}
        </div>
      )}

      <div ref={loaderRef} className="h-10" />

      {selectedProject && <ProjectModal project={selectedProject} isOpen={!!selectedProject} onClose={() => setSelectedProject(null)} />}

      {showScrollTop && (
        <button onClick={scrollToTop} className="fixed bottom-6 right-6 z-50 bg-primary text-white p-3 rounded-full shadow-lg hover:bg-secondary transition-transform duration-300">
          <ArrowUp className="w-6 h-6" />
        </button>
      )}
    </div>
  );
};

const ProjectCard = ({ project, onClick }: { project: ProjectType; onClick: () => void }) => {
  return (
    <Card className="relative w-full bg-card text-card-foreground rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300">
      {/* Project Thumbnail */}
      <div className="relative w-full h-44 cursor-pointer sm:h-56" onClick={onClick}>
        {project.thumbnail ? <img src={project.thumbnail} alt={project.title} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">No Image Available</div>}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-300">
          <span className="text-white text-lg font-semibold">View Project</span>
        </div>
      </div>

      <CardContent className="p-4">
        {/* Project Title and Created Date */}
        <div className="flex justify-between items-center mb-2">
          <h2 className="font-semibold text-lg sm:text-xl text-foreground truncate">{project.title}</h2>
          {/* <p className="text-xs text-muted-foreground whitespace-nowrap">{timeAgo(project.createdAt)}</p> */}
        </div>

        {/* User Info */}
        <div className="flex items-center gap-3 mt-2">
          {project.user.friendlyId && (
            <Link to={routesConfig.userPortfolioView(project.user.friendlyId)}>
              <Avatar className="flex-shrink-0 h-12 w-12">
                <AvatarImage src={project.user.profilePicture || "/placeholder.png"} />
                <AvatarFallback className="text-2xl">{project.user.username.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
            </Link>
          )}

          {/* <Avatar className="h-10 w-10 border border-border ">
            <AvatarImage src={project.user.profilePicture || "/placeholder.png"} />
            <AvatarFallback>{project.user.username.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar> */}
          <div>
            <h4 className="text-sm font-medium text-foreground pb-1">{project.user.username}</h4>
            <ProfessionBadge profession={project.user.profession} />
          </div>
        </div>

        {/* Project Tags */}
        {project.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {project.tags.slice(0, 3).map((tag) => (
              <Badge key={tag.id} className="border border-border text-foreground text-xs py-1 px-3 rounded-md bg-transparent">
                #{tag.name}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { routesConfig } from "../../../../routes/routesConfig";

const ProjectModal = ({ project, isOpen, onClose }: { project: ProjectType; isOpen: boolean; onClose: () => void }) => {
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
    <CustomModal size="lg" isOpen={isOpen} onClose={onClose}>
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
                <AvatarImage src={project.user.profilePicture || "/placeholder.png"} alt={project.user.username} />
                <AvatarFallback>{project.user.username.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-muted-foreground">{project.user.username}</span>
              <ProfessionBadge profession={project.user.profession} />
            </div>
          </div>
        </div>

        {/* Project Description */}
        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{project.description}</p>

        {/* Tags Section */}
        <div className="flex flex-wrap gap-2 mb-6">
          {project.tags.map((tag) => (
            <Badge key={tag.id} variant="secondary" className="border border-border text-foreground text-xs py-1 px-3 rounded-md bg-transparent">
              #{tag.name}
            </Badge>
          ))}
        </div>

        {/* Visit Project Button */}
        {project.url && (
          <Button asChild className="w-full py-3 bg-primary hover:bg-accent text-primary-foreground font-semibold rounded-lg transition">
            <a href={project.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
              <ExternalLink className="mr-2 h-5 w-5" /> Visit Project
            </a>
          </Button>
        )}
      </div>
    </CustomModal>
  );
};

export default ProjectsAll;
