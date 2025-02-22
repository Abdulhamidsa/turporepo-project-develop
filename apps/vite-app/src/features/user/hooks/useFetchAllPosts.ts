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
    (pageIndex) => {
      return `${ENDPOINTS.posts.fetch}?limit=${limit}&page=${pageIndex + 1}`;
    },
    (url) => swrFetcher(url),
  );

  const posts = data ? data.reduce((asc, page) => [...asc, ...page.posts], [] as PostType[]) : [];

  const totalPages = data?.[0]?.totalPages ?? 0;

  const toggleLike = async (postId: string) => {
    try {
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
        true,
      );

      await request('POST', ENDPOINTS.posts.like, { postId });

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
    refreshPosts: mutate,
  };
};
