import { useState } from "react";
import CustomModal from "@repo/ui/components/CustomModal";
import ProjectPreview from "./ProjectPreview";
import ProjectForm from "./ProjectForm";
import { AddProjectInput } from "@repo/zod/validation";
import { AddProjectModalProps } from "@repo/data/types/types";
import { useCreateProject } from "../../../hooks/useCreateProject";

const initialProject: AddProjectInput = {
  title: "",
  description: "",
  url: "",
  media: [],
  thumbnail: "",
  tags: [],
  user: {
    friendlyId: "",
    username: "",
    profilePicture: "",
    profession: "",
  },
};

export default function AddProjectModal({ isOpen, onClose }: AddProjectModalProps) {
  const [project, setProject] = useState<AddProjectInput>(initialProject);
  const [pendingThumbnail, setPendingThumbnail] = useState<File | null>(null);
  const [pendingMedia, setPendingMedia] = useState<File[]>([]);

  const { createProject, loading, errors, setErrors } = useCreateProject();

  const saveProject = async () => {
    const success = await createProject(project, pendingThumbnail, pendingMedia);

    if (success) {
      setProject(initialProject);
      setPendingThumbnail(null);
      setPendingMedia([]);
      setErrors({
        title: "",
        description: "",
        url: "",
        thumbnail: "",
        tags: "",
        media: "",
        user: "",
      });

      onClose();
    }
  };

  return (
    <CustomModal size="3xl" isOpen={isOpen} onClose={onClose}>
      <div className="grid md:grid-cols-2 gap-4 h-auto md:h-[500px]">
        {/* Project Preview - Always visible */}
        <div className="hidden md:block">
          <ProjectPreview project={project} pendingThumbnail={pendingThumbnail} />
        </div>

        {/* Project Form */}
        <div className="p-4 max-h-[450px] overflow-y-auto">
          <ProjectForm
            project={project}
            setProject={setProject}
            errors={errors}
            setErrors={setErrors}
            pendingThumbnail={pendingThumbnail}
            setPendingThumbnail={setPendingThumbnail}
            pendingMedia={pendingMedia}
            setPendingMedia={setPendingMedia}
            saveProject={saveProject}
            loading={loading}
          />
        </div>
      </div>
    </CustomModal>
  );
}
