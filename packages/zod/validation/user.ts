import { z } from "zod";

// userProfileSchema.ts

export const userProfileSchema = z.object({
  bio: z.string().nullable().default(""),
  username: z.string().nullable().default(""),
  age: z.number().nullable().optional(),
  countryOrigin: z.string().nullable().default(""),
  profession: z.string().nullable().default(""),
  friendlyId: z.string().default(""),
  profilePicture: z.string().nullable().default(""),
  coverImage: z.string().nullable().default(""),
  completedProfile: z.boolean().default(false),
});

// Infer TypeScript type
export type UserProfile = z.infer<typeof userProfileSchema>;

// Parse the default profile from the schema to ensure type safety
export const defaultUserProfile: UserProfile = userProfileSchema.parse({});

/////////////////////////////7

export const userAuthSchema = z.object({
  username: z.string().min(3).optional(),
  friendlyId: z.string().min(3).optional(),
});

export type UserAuth = z.infer<typeof userAuthSchema>;

// Parse the default user auth
export const defaultUserAuth: UserAuth = userAuthSchema.parse({});

// Define the schema for a Project
export const projectSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Title is required."),
  description: z.string().min(1, "Description is required."),
  url: z.string().url("Invalid URL format.").optional(),
  media: z.array(z.object({ url: z.string().url("Invalid URL format") })),
  thumbnail: z.string().url("Thumbnail is required."),
  tags: z.array(z.string()),
  completedProfile: z.boolean().optional(),
});

// Infer the TypeScript type from the schema
export type ProjectFormData = z.infer<typeof projectSchema>;

const PostSchema = z.object({
  content: z.string().optional(),
  image: z.string().optional(), // Image URL
});

export type PostData = z.infer<typeof PostSchema>;
