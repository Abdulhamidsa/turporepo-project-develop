import { useState } from 'react';

import { getEndpoints } from '@repo/api/endpoints';
import { frontendCommentSchema } from '@repo/zod/validation/post';
import { z } from 'zod';

import { request } from '../../api/request';

// import { useFetchPosts } from '../features/user/hooks/useFetchAllPosts';

const ENDPOINTS = getEndpoints(import.meta.env.VITE_BASE_URL);
export const useAddComment = (postId: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // const { mutate } = useFetchPosts();
  const submitComment = async (text: string) => {
    if (!text.trim()) return;

    try {
      setIsLoading(true);
      setError(null);

      const response = (await request('POST', ENDPOINTS.posts.addComment, { postId, text })) as {
        post?: { comments: unknown };
      };

      // Validate the comments array using the frontend schema
      const commentsValidation = z.array(frontendCommentSchema).safeParse(response.post?.comments);
      console.log('API Response Comments:', response.post?.comments);

      if (!commentsValidation.success) {
        console.error('Validation Errors:', commentsValidation.error.errors);
        throw new Error('Invalid API response structure for comments');
      }
      // mutate();
      return commentsValidation.data; // Return the updated comments
    } catch (err) {
      console.error('Error adding comment:', err);
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return { submitComment, isLoading, error };
};
