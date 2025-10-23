import { getEndpoints } from '@repo/api/endpoints';
import useSWR from 'swr';
import { z } from 'zod';

import { swrFetcher } from '../../../../api/swrFetcher';
import { useAuth } from './use.auth';

const ENDPOINTS = getEndpoints(import.meta.env.VITE_BASE_URL);

// Define a single user schema
export const userSchema = z.object({
  id: z.string(),
  username: z.string(),
  friendlyId: z.string(),
  completedProfile: z.boolean(),
  profession: z.string().nullable(),
  profilePicture: z.string().url().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

// Define pagination schema
const paginationSchema = z.object({
  page: z.number(),
  limit: z.number(),
  total: z.number(),
  totalPages: z.number(),
});

// Define full API response schema
const userApiResponseSchema = z.object({
  users: z.array(userSchema),
  pagination: paginationSchema,
});

// Infer TypeScript types
export type User = z.infer<typeof userSchema>;
export type UserApiResponse = z.infer<typeof userApiResponseSchema>;

/**
 * Hook for fetching all users with pagination and optional random selection.
 */
export const useUserALL = (page: number, limit: number, maxResults?: number) => {
  const { loggedUser } = useAuth();
  const urlFetch = `${ENDPOINTS.users.fetchAll}?limit=${limit}&page=${page}`;

  const { data, mutate, error, isLoading } = useSWR<UserApiResponse>(
    urlFetch,
    (endpoint: string) => swrFetcher(endpoint, userApiResponseSchema), // Validate full response
  );

  // Function to shuffle an array
  const shuffleArray = (array: User[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const filteredUsers = data?.users.filter((user) => user.username !== loggedUser?.username) || [];

  // If maxResults is specified, shuffle and limit. Otherwise return all filtered users.
  const finalUsers = maxResults
    ? shuffleArray([...filteredUsers]).slice(0, maxResults)
    : filteredUsers;

  return {
    users: finalUsers || [],
    pagination: data?.pagination || null,
    mutate,
    error,
    isLoading,
  };
};
