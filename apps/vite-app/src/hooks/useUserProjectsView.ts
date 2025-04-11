import { getEndpoints } from '@repo/api/endpoints';
import { FetchedProjectType } from '@repo/zod/validation';
import useSWR from 'swr';

import { swrFetcher } from '../../api/swrFetcher';

const ENDPOINTS = getEndpoints(import.meta.env.VITE_BASE_URL);
type UserProjectsResponse = {
  user: {
    friendlyId: string;
    username: string;
    profilePicture: string;
  };
  projects: FetchedProjectType[];
};
export const useUserProjectsView = (friendlyId: string) => {
  const { data, error, isLoading, mutate } = useSWR<UserProjectsResponse>(
    friendlyId ? ENDPOINTS.projects.fetchByFriendlyId(friendlyId) : null,
    swrFetcher,
  );
  return {
    user: data?.user || null,
    projects: data?.projects || [],
    error,
    isLoading,
    mutate,
  };
};
