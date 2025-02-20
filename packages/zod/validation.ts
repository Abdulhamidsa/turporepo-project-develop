import { z } from 'zod';

export const addProjectSchema = z.object({
  title: z.string().min(1, 'Title is required.'),
  description: z.string().min(1, 'Description is required.'),
  url: z.union([z.string().url('Invalid URL format.'), z.literal('')]).optional(),
  thumbnail: z.string().url('Invalid thumbnail URL.'),
  media: z
    .array(
      z.object({
        url: z.string().url('Invalid media URL.'),
      }),
    )
    .max(5, 'You can upload a maximum of 5 images.')
    .optional(),
  tags: z.array(z.string()),
});

export type AddProjectInput = z.infer<typeof addProjectSchema>;

export const userSchema = z.object({
  friendlyId: z.string(),
  username: z.string(),
  profilePicture: z.string().url('Invalid URL format.'),
});

export const fetchedProjectSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Title is required.'),
  description: z.string().min(1, 'Description is required.'),
  media: z
    .array(
      z.object({
        url: z.string().url('Invalid URL format.'),
      }),
    )
    .min(1, 'At least one image is required.'),
  thumbnail: z.string().url('Invalid thumbnail URL.'),
  tags: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
    }),
  ),
  createdAt: z.string(),
  updatedAt: z.string(),
  url: z.union([z.string().url('Invalid URL format.'), z.literal('')]).optional(),
  length: z.number().optional(),
});

export type UserType = z.infer<typeof userSchema>;
export type FetchedProjectType = z.infer<typeof fetchedProjectSchema>;
