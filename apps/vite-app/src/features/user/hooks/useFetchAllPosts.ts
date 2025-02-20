import { useState } from 'react';

import { getEndpoints } from '@repo/api/endpoints';
import { PostType } from '@repo/zod/validation/post';
import useSWRInfinite from 'swr/infinite';

import { request } from '../../../../api/request';
import { swrFetcher } from '../../../../api/swrFetcher';

const ENDPOINTS = getEndpoints(import.meta.env.VITE_BASE_URL);

export const useFetchPosts = () => {
  const [limit] = useState(5);
  const { data, error, size, setSize, mutate, isValidating } = useSWRInfinite<{
    posts: PostType[];
    totalPages: number;
    currentPage: number;
  }>(
    (pageIndex) => `${ENDPOINTS.posts.fetch}?limit=${limit}&page=${pageIndex + 1}`,
    (url) => swrFetcher(url),
  );

  // Append pages so that new posts are on top
  const posts = data ? data.reduce((acc, page) => [...page.posts, ...acc], [] as PostType[]) : [];

  const totalPages = data?.[0]?.totalPages ?? 0;

  const toggleLike = async (postId: string) => {
    try {
      // Optimistic UI update: update the like state locally
      mutate(
        (currentData) =>
          currentData
            ? currentData.map((page) => ({
                ...page,
                posts: page.posts.map((post) =>
                  post._id === postId
                    ? {
                        ...post,
                        likedByUser: !post.likedByUser,
                        likesCount: post.likedByUser
                          ? (post.likesCount ?? 0) - 1
                          : (post.likesCount ?? 0) + 1,
                      }
                    : post,
                ),
              }))
            : currentData,
        false, // Don't re-fetch yet
      );

      // API call to toggle like
      await request('POST', ENDPOINTS.posts.like, { postId });

      // 🚀 Force refetching the post list
      mutate(undefined, { revalidate: true });
    } catch (error) {
      console.error('Error toggling like:', error);

      mutate();
    }
  };

  const loadMore = () => {
    if (size < totalPages) {
      setSize(size + 1);
    }
  };

  const isReachingEnd = size >= totalPages;

  return {
    posts,
    isLoading: !data && !error,
    error,
    toggleLike,
    loadMore,
    isReachingEnd,
    isValidating,
    totalPages,
    currentPage: size,
    mutate,
  };
};
