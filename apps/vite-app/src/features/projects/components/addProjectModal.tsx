import { useState } from 'react';

import { AddProjectModalProps } from '@repo/data/types/types';
import CustomModal from '@repo/ui/components/CustomModal';
import { showToast } from '@repo/ui/components/ui/toaster';
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
    // Validate basic fields before closing modal
    if (!project.title.trim()) {
      showToast('Project title is required', 'error');
      return false;
    }

    if (!project.description.trim()) {
      showToast('Project description is required', 'error');
      return false;
    }

    if (!pendingThumbnail && !project.thumbnail) {
      showToast('Project thumbnail is required', 'error');
      return false;
    }

    if (pendingMedia.length === 0 && (!project.media || project.media.length === 0)) {
      showToast('At least one project image is required', 'error');
      return false;
    }

    // Close modal immediately for better UX
    onClose();

    // Small delay to make the transition feel natural
    setTimeout(() => {
      showToast(`Uploading "${project.title}"... We'll let you know when it's ready!`, 'success');
    }, 300);

    // Reset form
    const projectData = { ...project };
    const thumbnailData = pendingThumbnail;
    const mediaData = [...pendingMedia];

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

    // Process upload in background
    try {
      const success = await createProject(projectData, thumbnailData, mediaData);

      if (success) {
        // Show a more personalized success message
        showToast(
          `🎉 "${projectData.title}" is now live on your portfolio! Keep building amazing things!`,
          'success',
        );
        return true;
      } else {
        showToast(`Oops! "${projectData.title}" couldn't be uploaded. Please try again.`, 'error');
        return false;
      }
    } catch (error) {
      console.error('Upload error:', error);
      showToast(`Something went wrong with "${projectData.title}". Please try again.`, 'error');
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
