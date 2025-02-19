import { useState } from 'react';

import { getEndpoints } from '@repo/api/endpoints';
import { showToast } from '@repo/ui/components/ui/toaster';
import { AddProjectInput, addProjectSchema } from '@repo/zod/validation';
import { ZodError } from 'zod';

import { request } from '../../api/request';
import { uploadToCloudinary } from '../../utils/CloudinaryConfige';
import { getErrorMessage } from '../../utils/getErrorMessage';
import { useProjects } from '../features/projects/hooks/useProjects';
import { useUserProjects } from '../features/user/hooks/useUserProjects';

const ENDPOINTS = getEndpoints(import.meta.env.VITE_BASE_URL);

export const useCreateProject = () => {
  const { mutate: refetchAllProjects } = useProjects();
  const { mutate: mutateProjects } = useUserProjects();

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<keyof AddProjectInput, string>>({
    title: '',
    description: '',
    url: '',
    thumbnail: '',
    tags: '',
    media: '',
  });

  const createProject = async (
    project: AddProjectInput,
    pendingThumbnail: File | null,
    pendingMedia: File[],
  ): Promise<boolean> => {
    if (loading) return false;
    setLoading(true);
    setErrors({
      title: '',
      description: '',
      url: '',
      thumbnail: '',
      tags: '',
      media: '',
    });

    try {
      let thumbnailUrl = project.thumbnail;
      if (pendingThumbnail) {
        const [uploadedThumbnail] = await uploadToCloudinary([pendingThumbnail]);
        thumbnailUrl = uploadedThumbnail;
      }

      let mediaUrls = (project.media ?? []).map((m) => m.url);
      if (pendingMedia.length > 0) {
        const uploadedMedia = await uploadToCloudinary(pendingMedia);
        mediaUrls = [...mediaUrls, ...uploadedMedia];
      }

      const finalProject: AddProjectInput = {
        ...project,
        thumbnail: thumbnailUrl,
        media: mediaUrls.map((url) => ({ url })),
      };

      // Validate project data
      const validatedProject = addProjectSchema.parse(finalProject);

      // Send request to backend
      await request<AddProjectInput>('POST', ENDPOINTS.projects.create, validatedProject);

      showToast('Project uploaded successfully!', 'success');
      await refetchAllProjects();
      mutateProjects();

      return true;
    } catch (error) {
      if (error instanceof ZodError) {
        const fieldErrors: Record<keyof AddProjectInput, string> = {
          title: '',
          description: '',
          url: '',
          thumbnail: '',
          tags: '',
          media: '',
        };

        error.errors.forEach((err) => {
          const field = err.path[0] as keyof AddProjectInput;
          fieldErrors[field] = err.message;
        });

        setErrors(fieldErrors);
        showToast('Please fill all required fields correctly.', 'error');
      } else {
        showToast(getErrorMessage(error), 'error');
      }

      return false;
    } finally {
      setLoading(false);
    }
  };

  return { createProject, loading, errors, setErrors };
};
