// defaultUserProfile.ts

import { UserProfile } from "../../zod/validation/user";
// defaultUserProfile.ts
export const defaultUserProfile: UserProfile = {
  bio: "",
  username: "",
  completedProfile: false,
  age: null,
  countryOrigin: "",
  profession: "",
  friendlyId: "",
  profilePicture: "",
  coverImage: "",
};
