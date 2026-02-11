import { getEndpoints } from '@repo/api/endpoints';
import { FetchedProjectType, fetchedProjectSchema } from '@repo/zod/validation';
import useSWR from 'swr';
import { z } from 'zod';

import { swrFetcher } from '../../../../api/swrFetcher';
import { useAuth } from './use.auth';

const ENDPOINTS = getEndpoints(import.meta.env.VITE_BASE_URL);

// Schema for the /projects/user/:friendlyId endpoint response
const userProjectsResponseSchema = z.object({
  user: z.object({
    friendlyId: z.string(),
    username: z.string(),
    profilePicture: z.string().optional(),
  }),
  projects: z.array(fetchedProjectSchema),
});

export const useUserProjects = () => {
  const { loggedUser } = useAuth();

  // Build the URL with friendlyId only if user is authenticated
  const url = loggedUser?.friendlyId
    ? ENDPOINTS.projects.fetchByFriendlyId(loggedUser.friendlyId)
    : null;

  const {
    data: responseData,
    error: swrError,
    isLoading,
    mutate,
  } = useSWR<z.infer<typeof userProjectsResponseSchema> | FetchedProjectType[]>(
    // Only fetch if user is authenticated
    url,
    (endpoint: string) =>
      swrFetcher(endpoint, userProjectsResponseSchema, {
        user: { friendlyId: '', username: '', profilePicture: '' },
        projects: [],
      }),
  );

  // Extract projects from response - handle both old and new response formats
  const projects = Array.isArray(responseData) ? responseData : (responseData?.projects ?? []);

  return {
    projects,
    mutate,
    isLoading,
    error: swrError,
  };
};
