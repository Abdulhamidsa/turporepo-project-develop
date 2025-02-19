import { getEndpoints } from '@repo/api/endpoints';
import { FetchedProjectType, fetchedProjectSchema } from '@repo/zod/validation';
import useSWR from 'swr';
import { z } from 'zod';

import { swrFetcher } from '../../../../api/swrFetcher';

const ENDPOINTS = getEndpoints(import.meta.env.VITE_BASE_URL);

const projectArraySchema = z.array(fetchedProjectSchema);

export const useUserProjects = () => {
  const {
    data,
    error: swrError,
    isLoading,
    mutate,
  } = useSWR<FetchedProjectType[]>(ENDPOINTS.projects.fetchUserProjects, (endpoint: string) =>
    swrFetcher(endpoint, projectArraySchema, []),
  );
  return {
    projects: data ?? [],
    mutate,
    isLoading,
    error: swrError,
  };
};
