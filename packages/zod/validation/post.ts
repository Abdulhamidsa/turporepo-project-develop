import { z } from 'zod';

// User schema for userId references
export const userSchema = z.object({
  _id: z.string(),
  username: z.string(),
  profilePicture: z.string().nullable(),
  friendlyId: z.string(),
  profession: z.string().nullable(),
});

// Comment schema

export const commentSchema = z.object({
  _id: z.string(), // Comment ID (required now, as backend always provides it)
  postId: z.string(), // Added postId to match backend
  userId: userSchema, // Reference to `userSchema`
  text: z.string().min(1, 'Comment text cannot be empty'), // Ensure text is required
  createdAt: z.string().optional(), // Optional timestamp for when comment was created
  updatedAt: z.string().optional(), // Optional timestamp for updates
});

// Post schema

export const postSchema = z.object({
  _id: z.string(), // Post ID
  content: z.string().optional().default(''), // Optional content
  image: z
    .union([z.string().url(), z.literal(''), z.null()])
    .optional()
    .default(''), // Handle empty and null images
  createdAt: z.string().optional(), // Optional creation timestamp
  updatedAt: z.string().optional(), // Optional updated timestamp
  likedByUser: z.boolean().optional().default(false), // Optional boolean
  likesCount: z.number().optional().default(0), // Optional like count
  userId: userSchema, // Reference to user schema
  comments: z.array(commentSchema).optional().default([]), // Updated to handle new comments format
});

// Types inferred from schemas
export type PostType = z.infer<typeof postSchema>;
export type CommentType = z.infer<typeof commentSchema>;
export type UserType = z.infer<typeof userSchema>;

// Array of posts schema
export const postsArraySchema = z.array(postSchema);

// TypeScript types inferred from schemas

// Define the schema for a frontend comment
export const frontendCommentSchema = z.object({
  _id: z.string().optional(), // Optional if the API doesn’t always return it
  userId: z
    .object({
      _id: z.string(),
      username: z.string(),
      profilePicture: z.string().nullable(),
    })
    .optional(), // Optional to handle cases where userId might be missing
  text: z.string(), // Required comment text
  createdAt: z.string().optional(), // Optional creation date
});

// Schema for adding a comment
export const frontendAddCommentSchema = z.object({
  postId: z.string().min(1, 'Post ID is required'),
  text: z.string().min(1, 'Comment text cannot be empty'),
});

// Types inferred from schemas
export type FrontendCommentType = z.infer<typeof frontendCommentSchema>;
export type AddCommentInput = z.infer<typeof frontendAddCommentSchema>;

export const UserPostSchema = z.object({
  _id: z.string(),
  content: z.string().nullable(),
  image: z.union([z.string().url(), z.null()]).optional().default(''),
  createdAt: z.string(),
  updatedAt: z.string(),
  userId: z.object({
    _id: z.string(),
    username: z.string(),
    profilePicture: z.string().nullable().optional(),
  }),
  likes: z.array(z.string()).optional().default([]),
  comments: z
    .array(
      z.object({
        _id: z.string(),
        userId: z.object({
          _id: z.string(),
          username: z.string(),
          profilePicture: z.string().nullable(),
        }),
        text: z.string(),
        createdAt: z.string().optional(),
      }),
    )
    .optional()
    .default([]),
});

// Type inference from Zod schema
export type UserPostType = z.infer<typeof UserPostSchema>;
