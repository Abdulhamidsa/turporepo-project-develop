import { getEndpoints } from '@repo/api/endpoints';
import useSWR from 'swr';

import { swrFetcher } from '../../api/swrFetcher';

const ENDPOINTS = getEndpoints(import.meta.env.VITE_BASE_URL);

export type UserType = {
  id: string;
  username: string;
  profilePicture?: string | null;
  profession: string;
  bio?: string;
  friendlyId: string | null;
  countryOrigin?: string | null;
  skills?: { name: string }[];
};

export const useFeaturedUsers = (limit = 3) => {
  // Fetch users from the API
  const { data, error, isLoading } = useSWR<{
    users: UserType[];
    pagination: {
      page: number;
      total: number;
    };
  }>(`${ENDPOINTS.users.fetchAll}?limit=${limit}`, swrFetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    revalidateIfStale: false,
  });

  return {
    users: data?.users || [],
    isLoading,
    error,
  };
};
