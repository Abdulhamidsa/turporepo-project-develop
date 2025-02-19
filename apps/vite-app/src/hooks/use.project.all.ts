import { getEndpoints } from '@repo/api/endpoints';
import { FetchedProjectType, fetchedProjectSchema } from '@repo/zod/validation';
import useSWR from 'swr';

import { swrFetcher } from '../../api/swrFetcher';

const ENDPOINTS = getEndpoints(import.meta.env.VITE_BASE_URL);

/**
 * Hook for fetching all projects with pagination.
 */
export const useAllProjects = (page: number, limit: number) => {
  // Dynamically construct the URL using the ENDPOINTS object
  const urlFetch = `${ENDPOINTS.projects.fetchAll}?limit=${limit}&page=${page}`;

  const { data, mutate, error, isLoading } = useSWR<FetchedProjectType[]>(
    urlFetch,
    (endpoint: string) => swrFetcher(endpoint, fetchedProjectSchema.array()),
  );
  return {
    projects: data || [],
    mutate,
    error,
    isLoading,
  };
};
