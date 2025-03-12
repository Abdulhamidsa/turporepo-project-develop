import { useState } from 'react';

import { AddProjectModalProps } from '@repo/data/types/types';
import CustomModal from '@repo/ui/components/CustomModal';
import { AddProjectInput } from '@repo/zod/validation';

import { useCreateProject } from '../../../hooks/useCreateProject';
import ProjectForm from './ProjectForm';
import ProjectPreview from './ProjectPreview';

const initialProject: AddProjectInput = {
  title: '',
  description: '',
  url: '',
  media: [],
  thumbnail: '',
  tags: [],
};

export default function AddProjectModal({ isOpen, onClose }: AddProjectModalProps) {
  const [project, setProject] = useState<AddProjectInput>(initialProject);
  const [pendingThumbnail, setPendingThumbnail] = useState<File | null>(null);
  const [pendingMedia, setPendingMedia] = useState<File[]>([]);

  const { createProject, loading, errors, setErrors } = useCreateProject();

  const saveProject = async (): Promise<boolean> => {
    const success = await createProject(project, pendingThumbnail, pendingMedia);

    if (success) {
      setProject(initialProject);
      setPendingThumbnail(null);
      setPendingMedia([]);
      setErrors({
        title: '',
        description: '',
        url: '',
        thumbnail: '',
        tags: '',
        media: '',
      });

      onClose();
      return true;
    } else {
      return false;
    }
  };

  return (
    <CustomModal size="3xl" isOpen={isOpen} onClose={onClose}>
      <div className="grid h-auto gap-4 md:h-[500px] md:grid-cols-2">
        <div className="hidden md:block">
          <ProjectPreview project={project} pendingThumbnail={pendingThumbnail} />
        </div>

        <div className="max-h-[500px] overflow-y-auto md:p-4">
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
