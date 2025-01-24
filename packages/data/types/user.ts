import { z } from "zod";
import { userProfileSchema } from "../../zod/validation/user";

export type UserProfile = z.infer<typeof userProfileSchema>;

export interface ProfileType {
  bio: string | null;
  username: string | null;
  age: number | null;
  countryOrigin: string | null;
  profession: string | null;
  friendlyId: string | null;
  profilePicture: string;
  coverImage: string;
  createdAt?: string; // Optional
  updatedAt?: string; // Optional
}

export type EditableProfileType = Partial<ProfileType>;

export type ProfileEditProps = {
  friendlyId: string;
};
