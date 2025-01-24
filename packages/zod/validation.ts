import { z } from "zod";

export const addProjectSchema = z.object({
  title: z.string().min(1, "Title is required."), // Required title
  description: z.string().min(1, "Description is required."), // Required description
  url: z.union([z.string().url("Invalid URL format."), z.literal("")]).optional(),
  thumbnail: z.string().url("Invalid thumbnail URL."), // Now required
  media: z
    .array(
      z.object({
        url: z.string().url("Invalid media URL."), // Each media must have a valid URL
      })
    )
    .optional(), // Media is now optional
  tags: z.array(z.string()), // Array of Tag IDs as strings
  user: z.object({
    friendlyId: z.string().min(1, "Friendly ID is required."),
    username: z.string().min(1, "Username is required."),
    profilePicture: z.string().url("Invalid URL format."),
    profession: z.string().min(1, "Profession is required."), // Ensure profession is required
  }),
});

export type AddProjectInput = z.infer<typeof addProjectSchema>;

export const userSchema = z.object({
  friendlyId: z.string(),
  username: z.string(),
  profilePicture: z.string().url("Invalid URL format."),
});

export const fetchedProjectSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Title is required."),
  description: z.string().min(1, "Description is required."),
  url: z.union([z.string().url("Invalid URL format."), z.literal("")]).optional(),
  media: z
    .array(
      z.object({
        url: z.string().url("Invalid URL format."),
      })
    )
    .min(1, "At least one image is required."),
  thumbnail: z.string().url("Invalid thumbnail URL."),
  tags: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
    })
  ),
  createdAt: z.string(), // Ensure createdAt is included
  updatedAt: z.string(), // Ensure updatedAt is included
});

export type UserType = z.infer<typeof userSchema>;
export type FetchedProjectType = z.infer<typeof fetchedProjectSchema>;
