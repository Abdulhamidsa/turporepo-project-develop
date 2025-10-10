import { getEndpoints } from '@repo/api/endpoints';
import useSWR from 'swr';
import { z } from 'zod';

import { swrFetcher } from '../../api/swrFetcher';
import { type UserApiResponse, userSchema } from '../features/user/hooks/useUserAll';

const ENDPOINTS = getEndpoints(import.meta.env.VITE_BASE_URL);

// Define full API response schema (same as useUserAll)
const userApiResponseSchema = z.object({
  users: z.array(userSchema),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number(),
  }),
});

/**
 * Admin-specific hook for fetching users with NO revalidation
 * Uses real API but prevents constant refreshing for admin use
 */
export const useAdminUsers = (page: number, limit: number) => {
  const urlFetch = `${ENDPOINTS.users.fetchAll}?limit=${limit}&page=${page}`;

  const { data, mutate, error, isLoading } = useSWR<UserApiResponse>(
    urlFetch,
    (endpoint: string) => swrFetcher(endpoint, userApiResponseSchema),
    {
      // Admin-specific SWR config - NO revalidation
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateIfStale: false,
      revalidateOnMount: true, // Only fetch once on mount
      refreshInterval: 0, // No automatic refresh
      dedupingInterval: 300000, // 5 minutes deduping
    },
  );

  return {
    users: data?.users || [],
    pagination: data?.pagination || null,
    mutate,
    error,
    isLoading,
  };
};
