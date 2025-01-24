import { getEndpoints } from "@repo/api/endpoints";
const ENDPOINTS = getEndpoints(import.meta.env.VITE_BASE_URL);
import { request } from "../api/request";
export async function toggleLikePost(postId: string) {
  return request("POST", ENDPOINTS.posts.like, { postId });
}
