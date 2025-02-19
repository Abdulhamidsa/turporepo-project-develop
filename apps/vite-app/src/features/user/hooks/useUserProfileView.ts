import { getEndpoints } from '@repo/api/endpoints';
import { defaultUserProfile, userProfileSchema } from '@repo/zod/validation/user';
import { useParams } from 'react-router-dom';
import useSWR from 'swr';

import { swrFetcher } from '../../../../api/swrFetcher';

const ENDPOINTS = getEndpoints(import.meta.env.VITE_BASE_URL);

export const useUserProfileView = () => {
  const { friendlyId } = useParams<{ friendlyId: string }>();

  // Fetch only if `friendlyId` exists
  const { data, error, isLoading, mutate } = useSWR(
    friendlyId ? ENDPOINTS.users.fetchUserPublicProfile(friendlyId) : null,
    (endpoint) => swrFetcher(endpoint, userProfileSchema, defaultUserProfile),
  );

  return {
    userProfile: data ?? defaultUserProfile,
    error,
    isLoading,
    mutate,
  };
};
