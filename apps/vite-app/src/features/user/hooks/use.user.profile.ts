import { getEndpoints } from '@repo/api/endpoints';
import { defaultUserProfile, userProfileSchema } from '@repo/zod/validation/user';
import useSWR from 'swr';

import { swrFetcher } from '../../../../api/swrFetcher';

const ENDPOINTS = getEndpoints(import.meta.env.VITE_BASE_URL);
export const useUserProfile = () => {
  const { data, error, isLoading, mutate } = useSWR(
    ENDPOINTS.users.fetchProfile,
    (endpoint) => swrFetcher(endpoint, userProfileSchema, defaultUserProfile),
    {
      dedupingInterval: Infinity,
    },
  );

  return {
    userProfile: data ?? defaultUserProfile,
    error,
    isLoading,
    mutate,
  };
};
