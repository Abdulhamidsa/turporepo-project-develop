import { getEndpoints } from '@repo/api/endpoints';
import { UserPostSchema } from '@repo/zod/validation/post';
import useSWR from 'swr';

import { swrFetcher } from '../../../../api/swrFetcher';

const ENDPOINTS = getEndpoints(import.meta.env.VITE_BASE_URL);

export const useUserPosts = (friendlyId: string) => {
  // console.log(friendlyId);

  // Don't fetch if friendlyId is empty or undefined
  const shouldFetch = friendlyId && friendlyId.trim() !== '';

  const { data, error, isLoading, mutate } = useSWR(
    shouldFetch ? ENDPOINTS.posts.fetchUserPosts(friendlyId) : null,
    (url) => swrFetcher(url, UserPostSchema.array(), []),
  );

  return {
    posts: data ?? [],
    isLoading,
    isError: error,
    mutate,
  };
};
