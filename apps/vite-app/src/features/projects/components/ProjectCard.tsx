import { useState } from "react";
import { ProjectCardProps } from "@repo/data/types/types";
import { Card, CardContent } from "@repo/ui/components/ui/card";
import { Badge } from "@repo/ui/components/ui/badge";
import { Button } from "@repo/ui/components/ui/button";
import { Loader, Trash2 } from "lucide-react";
import { useDeleteProject } from "../../../hooks/useDeleteProject";
import CustomModal from "@repo/ui/components/CustomModal";
import { showToast } from "@repo/ui/components/ui/toaster";
import { useAuth } from "../../user/hooks/use.auth";
import { useUserProjects } from "../../user/hooks/useUserProjects";

export default function ProjectCard({ project, onClick, friendlyId }: ProjectCardProps) {
  const { deleteProject } = useDeleteProject();
  const { loggedUser } = useAuth();
  const { mutate } = useUserProjects();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    const projectId = project.id;
    setIsDeleting(true);

    try {
      await deleteProject(projectId);
      mutate();

      setIsModalOpen(false);
      showToast("Project deleted successfully!", "success");
    } catch (error) {
      showToast("Failed to delete project. Please try again later.", "error");
      console.error("Failed to delete project:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Card className="relative w-full bg-card text-card-foreground cursor-pointer overflow-hidden group" onClick={onClick}>
        <CardContent className="p-0 relative">
          {/* Project Image */}
          <img src={project.thumbnail || "/placeholder.png"} alt={project.title} className="w-full h-64 object-cover" />

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 ease-in-out"></div>

          {/* Conditionally Render Delete Button */}
          {loggedUser?.friendlyId === friendlyId && (
            <Button
              variant="destructive"
              onClick={(e) => {
                e.stopPropagation();
                setIsModalOpen(true); // Open modal
              }}
              className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 bg-red-600 hover:bg-red-700 text-white rounded-full p-2 transition-all duration-300"
              size="icon"
            >
              <Trash2 className="w-5 h-5" />
            </Button>
          )}

          {/* Project Details */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
            <h3 className="text-xl font-bold mb-2">{project.title}</h3>
            <p className="text-sm text-muted-foreground mb-4">{project.description}</p>
            <div className="flex flex-wrap gap-2 mb-2">
              {project.tags.slice(0, 3).map((tag) => (
                <Badge key={tag.id} variant="secondary" className="bg-secondary text-secondary-foreground text-xs">
                  {tag.name}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Custom Delete Confirmation Modal */}
      <CustomModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} size="md">
        <h2 className="text-xl font-semibold mb-4 text-center">Delete Project</h2>
        <p className="text-center text-muted-foreground mb-6">
          Are you sure you want to delete the project <span className="font-bold text-destructive">{project.title}</span>? This action cannot be undone.
        </p>
        <div className="flex justify-end space-x-4">
          <Button variant="outline" onClick={() => setIsModalOpen(false)} disabled={isDeleting}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? <Loader className="animate-spin w-5 h-5" /> : "Delete"}
          </Button>
        </div>
      </CustomModal>
    </>
  );
}
