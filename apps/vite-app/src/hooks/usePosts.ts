// import { useState } from "react";
// import { PostType } from "@repo/zod/validation/post";
// import useSWR from "swr";
// import { swrFetcher } from "../../api/swrFetcher";
// import { request } from "../../api/request";

// // Fetch posts
// export const usePosts = () => {
//   const { data, error, isLoading, mutate } = useSWR<PostType[]>("/posts", (url) => swrFetcher(url), {
//     dedupingInterval: 60000, // 1 minute
//     revalidateOnFocus: true,
//   });

//   return {
//     posts: data || [],
//     error,
//     isLoading,
//     mutate, // Revalidate or refresh your data manually
//   };
// };

// // Add a post with loading state
// export const useAddPost = () => {
//   const { mutate } = usePosts(); // Optionally access the same key
//   const [isLoading, setIsLoading] = useState(false); // Local loading state

//   const addPost = async (newPost: PostType) => {
//     setIsLoading(true); // Start loading
//     try {
//       const createdPost = await request<PostType>("POST", "/posts", newPost);
//       await mutate(); // Revalidate the posts list
//       return createdPost;
//     } catch (error) {
//       console.error("Failed to add post:", error);
//       throw error; // Rethrow to handle error in calling components
//     } finally {
//       setIsLoading(false); // End loading
//     }
//   };

//   return { addPost, isLoading };
// };
