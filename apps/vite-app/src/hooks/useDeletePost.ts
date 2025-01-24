import { getEndpoints } from "@repo/api/endpoints";
import { request } from "../../api/request";
import { showToast } from "@repo/ui/components/ui/toaster";

const ENDPOINTS = getEndpoints(import.meta.env.VITE_BASE_URL);

export const useDeletePost = () => {
  const deletePost = async (postId: string) => {
    if (!postId) {
      showToast("Invalid post ID", "error");
      return false;
    }

    try {
      const response = await request("DELETE", ENDPOINTS.posts.deletePost(postId));

      if (response) {
        showToast("Post deleted successfully!", "success");
        return true;
      } else {
        throw new Error("Failed to delete post");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      showToast("Failed to delete post. Please try again later.", "error");
      return false;
    }
  };

  return { deletePost };
};
