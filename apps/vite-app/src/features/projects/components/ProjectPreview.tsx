import { Card, CardContent, CardFooter } from "@repo/ui/components/ui/card";
import { Badge } from "@repo/ui/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui/components/ui/avatar";
import { AddProjectInput } from "@repo/zod/validation";
import { Button } from "@repo/ui/components/ui/button";
import { ProfessionBadge } from "../../../components/ProfessionBadge";
import { useAuth } from "../../user/hooks/use.auth";

interface ProjectPreviewProps {
  project: AddProjectInput;
  pendingThumbnail: File | null;
}

const ProjectPreview: React.FC<ProjectPreviewProps> = ({ project, pendingThumbnail }) => {
  const thumbnailUrl = pendingThumbnail ? URL.createObjectURL(pendingThumbnail) : project.thumbnail || "/placeholder.png";
  const { loggedUser } = useAuth();

  return (
    <Card className="relative w-full max-w-full md:max-w-lg lg:max-w-2xl bg-card text-card-foreground rounded-lg shadow-md overflow-hidden">
      {/* Thumbnail */}
      <div className="relative w-full h-44 sm:h-56">
        <img src={thumbnailUrl} alt={project.title || "Project"} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
      </div>

      <CardContent className="p-4">
        <h2 className="font-semibold text-lg sm:text-xl text-foreground truncate">{project.title || "Untitled Project"}</h2>
        <p className="text-sm sm:text-base text-muted-foreground line-clamp-2 mt-1">{project.description || "No description available."}</p>

        <div className="flex items-center mt-4">
          <Avatar className="h-8 w-8 sm:h-10 sm:w-10 border border-border">
            <AvatarImage src={loggedUser?.profilePicture || "/placeholder.png"} />
            <AvatarFallback>{loggedUser?.username.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="ml-3">
            <h4 className="text-sm font-medium text-foreground">{loggedUser?.username || "User"}</h4>
            <ProfessionBadge profession={loggedUser?.profession || "Unknown"} />
          </div>
        </div>

        {project.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {project.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} className="bg-primary text-white text-xs py-1 px-3 rounded-md">
                #{tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter className="p-4 flex items-center justify-between border-t border-border text-sm text-muted-foreground">
        {project.url?.trim() && (
          <Button variant="outline" onClick={() => window.open(project.url, "_blank")}>
            View Preview
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ProjectPreview;
