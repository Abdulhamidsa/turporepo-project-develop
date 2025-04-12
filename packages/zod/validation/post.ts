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
  _id: z.string(),
  postId: z.string(),
  userId: userSchema,
  text: z.string().min(1, 'Comment text cannot be empty'),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

// Post schema

export const postSchema = z.object({
  _id: z.string(), // Post ID
  content: z.string().optional().default(''),
  image: z
    .union([z.string().url(), z.literal(''), z.null()])
    .optional()
    .default(''), // Handle empty and null images
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  likedByUser: z.boolean().optional().default(false),
  likesCount: z.number().optional().default(0),
  userId: userSchema,
  comments: z.array(commentSchema).optional().default([]),
});

// Types inferred from schemas
export type PostType = z.infer<typeof postSchema>;
export type CommentType = z.infer<typeof commentSchema>;
export type UserType = z.infer<typeof userSchema>;

export const postsArraySchema = z.array(postSchema);

export const frontendCommentSchema = z.object({
  _id: z.string().optional(),
  userId: z
    .object({
      _id: z.string(),
      username: z.string(),
      profilePicture: z.string().nullable(),
    })
    .optional(),
  text: z.string(),
  createdAt: z.string().optional(),
});

export const frontendAddCommentSchema = z.object({
  postId: z.string().min(1, 'Post ID is required'),
  text: z.string().min(1, 'Comment text cannot be empty'),
});

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

export type UserPostType = z.infer<typeof UserPostSchema>;
