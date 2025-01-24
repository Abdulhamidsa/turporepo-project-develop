// // src/hooks/useLike.ts (or keep in same file as usePosts)

// import { PostType } from "@repo/zod/validation/post";
// import { request } from "../../api/request";
// import { usePosts } from "./usePosts";

// export const useToggleLike = () => {
//   const { mutate } = usePosts(); // optional if you want to re-fetch the entire list

//   const toggleLikePost = async (postId: string) => {
//     // This calls POST /posts/like
//     // If the server returns "post" as PostType, you can parse with postSchema
//     await request<PostType>(
//       "POST",
//       "/posts/like",
//       { postId }
//       // postSchema - if you want to validate the returned updated post
//     );
//     // Revalidate
//     mutate();
//   };

//   return { toggleLikePost };
// };
