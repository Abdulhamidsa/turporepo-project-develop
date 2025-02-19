import { getEndpoints } from '@repo/api/endpoints';

import { request } from '../api/request';

const ENDPOINTS = getEndpoints(import.meta.env.VITE_BASE_URL);

export async function toggleLikePost(postId: string) {
  return request('POST', ENDPOINTS.posts.like, { postId });
}
