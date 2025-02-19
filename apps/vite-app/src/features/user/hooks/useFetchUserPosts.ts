import { getEndpoints } from '@repo/api/endpoints';
import { UserPostSchema } from '@repo/zod/validation/post';
import useSWR from 'swr';

import { swrFetcher } from '../../../../api/swrFetcher';

const ENDPOINTS = getEndpoints(import.meta.env.VITE_BASE_URL);

export const useUserPosts = (friendlyId: string) => {
  console.log(friendlyId);
  const { data, error, isLoading, mutate } = useSWR(
    ENDPOINTS.posts.fetchUserPosts(friendlyId),
    (url) => swrFetcher(url, UserPostSchema.array(), []),
  );

  return {
    posts: data ?? [],
    isLoading,
    isError: error,
    refetch: mutate,
  };
};
