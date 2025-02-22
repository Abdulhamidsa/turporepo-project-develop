import { getEndpoints } from '@repo/api/endpoints';
import useSWRMutation from 'swr/mutation';
import { z } from 'zod';

import { request } from '../../api/request';
import { useFetchPosts } from '../features/user/hooks/useFetchAllPosts';
import { useUserPosts } from '../features/user/hooks/useFetchUserPosts';

const ENDPOINTS = getEndpoints(import.meta.env.VITE_BASE_URL);

export const PostSchema = z.object({
  content: z.string().optional(),
  image: z.string().optional(),
});

type PostData = z.infer<typeof PostSchema>;
type PostPayload = { content: string; image?: string };

export const usePostSubmit = (friendlyId: string) => {
  const { mutate } = useUserPosts(friendlyId);
  const { refreshPosts } = useFetchPosts();

  const mutationFetcher = async (url: string, { arg }: { arg: PostPayload }) => {
    const response = await request<PostData>('POST', url, arg);
    if (!response) {
      throw new Error('Failed to create post');
    }
    await mutate();
    await refreshPosts();

    // Or, if you prefer, you can call mutate() to update the cache immediately
    return response;
  };

  const { trigger, isMutating, error } = useSWRMutation<PostData, Error, string, PostPayload>(
    ENDPOINTS.posts.post,
    mutationFetcher,
  );

  return { trigger, isMutating, error };
};
