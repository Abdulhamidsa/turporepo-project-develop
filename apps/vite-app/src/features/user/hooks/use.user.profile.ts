import { getEndpoints } from '@repo/api/endpoints';
import { defaultUserProfile, userProfileSchema } from '@repo/zod/validation/user';
import useSWR from 'swr';

import { swrFetcher } from '../../../../api/swrFetcher';
import { useAuth } from './use.auth';

const ENDPOINTS = getEndpoints(import.meta.env.VITE_BASE_URL);
export const useUserProfile = (friendlyId?: string) => {
  const { loggedUser } = useAuth();
  const resolvedFriendlyId = friendlyId ?? loggedUser?.friendlyId;
  const endpoint = resolvedFriendlyId ? ENDPOINTS.profile.fetch(resolvedFriendlyId) : null;

  const { data, error, isLoading, mutate } = useSWR(
    endpoint,
    (url) => swrFetcher(url, userProfileSchema, defaultUserProfile),
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
