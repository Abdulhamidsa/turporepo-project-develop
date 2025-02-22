import { useState } from 'react';

import { getEndpoints } from '@repo/api/endpoints';

import { request } from '../../api/request';

// import { useFetchPosts } from '../features/user/hooks/useFetchAllPosts';

const ENDPOINTS = getEndpoints(import.meta.env.VITE_BASE_URL);

export const useDeleteComment = (postId: string) => {
  // const { mutate } = useFetchPosts();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteComment = async (commentId: string) => {
    if (!commentId.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await request('DELETE', ENDPOINTS.posts.deleteComment(postId, commentId));

      if (response) {
        // mutate();
        return true;
      }

      throw new Error('Failed to delete comment');
    } catch (err) {
      console.error('Error deleting comment:', err);
      setError(err instanceof Error ? err.message : 'Something went wrong');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { deleteComment, isLoading, error };
};
