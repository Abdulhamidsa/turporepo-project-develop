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
      // Step 1: Validate non-image fields.
      const { title, description, url, tags } = project;
      addProjectSchema
        .pick({ title: true, description: true, url: true, tags: true })
        .parse({ title, description, url, tags });

      // Step 2: Calculate total media count.
      const existingMediaCount = project.media ? project.media.length : 0;
      const totalMediaCount = pendingMedia.length + existingMediaCount;

      // Check if total media exceeds allowed limit.
      if (totalMediaCount > 5) {
        throw new ZodError([
          {
            code: 'custom',
            message: 'You can upload a maximum of 5 images.',
            path: ['media'],
          },
        ]);
      }

      // Step 3: Pre-validate required image fields.
      if (!pendingThumbnail && !project.thumbnail) {
        throw new ZodError([
          {
            code: 'custom',
            message: 'Thumbnail is required',
            path: ['thumbnail'],
          },
        ]);
      }
      if (totalMediaCount === 0) {
        throw new ZodError([
          {
            code: 'custom',
            message: 'At least one media image is required',
            path: ['media'],
          },
        ]);
      }

      // (Progress handling is done in the component. At this point, we know validation is good.)

      // Step 4: Upload images only after all validations pass.
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

      // Step 5: Build final project object.
      const finalProject: AddProjectInput = {
        ...project,
        thumbnail: thumbnailUrl,
        media: mediaUrls.map((url) => ({ url })),
      };

      // Final full validation.
      addProjectSchema.parse(finalProject);

      // Step 6: Send request to backend.
      await request<AddProjectInput>(
        'POST',
        ENDPOINTS.projects.create,
        finalProject,
        addProjectSchema,
      );

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
        showToast('Error saving project, check your inputs fileds.', 'error');
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
