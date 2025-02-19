import { z } from 'zod';

export const fetchProjectWithUser = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  url: z.string().url(),
  thumbnail: z.string().url(),
  media: z.array(z.object({ url: z.string().url() })),
  tags: z.array(z.object({ id: z.string(), name: z.string() })),
  user: z
    .object({
      username: z.string(),
      profilePicture: z.string().nullable(),
    })
    .nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type fetchProjectWithUserType = z.infer<typeof fetchProjectWithUser>;
