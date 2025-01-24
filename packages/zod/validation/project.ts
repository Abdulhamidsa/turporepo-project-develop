import { z } from "zod";

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
      profilePicture: z.string().nullable(), // Optional field
    })
    .nullable(),
  createdAt: z.date(), // Accept Date objects
  updatedAt: z.date(), // Accept Date objects
});

export type fetchProjectWithUserType = z.infer<typeof fetchProjectWithUser>;
