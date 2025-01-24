import { request } from "../../../../api/request";
import { EditableProfileType } from "@repo/data/types/user";
import { useUserProfile } from "./use.user.profile";
import { getEndpoints } from "@repo/api/endpoints";
const ENDPOINTS = getEndpoints(import.meta.env.VITE_BASE_URL);

export const useUpdateUserProfile = () => {
  const { mutate, isLoading } = useUserProfile();

  const updateProfile = async (profile: EditableProfileType) => {
    try {
      const updatedProfile = await request<EditableProfileType>("PUT", ENDPOINTS.profile.update, profile);

      await mutate();
      return updatedProfile;
    } catch (error) {
      console.error("Error updating user profile:", error);
      throw error;
    }
  };

  return { updateProfile, isLoading };
};
