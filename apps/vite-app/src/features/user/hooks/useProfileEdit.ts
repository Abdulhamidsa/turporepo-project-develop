// src/hooks/useProfileEdit.ts

import { useState } from "react";
import useSWR from "swr";
import { request } from "../../../../api/request";
import { swrFetcher } from "../../../../api/swrFetcher";
import { getErrorMessage } from "../../../../utils/getErrorMessage";
import { getEndpoints } from "@repo/api/endpoints";
const ENDPOINTS = getEndpoints(import.meta.env.VITE_BASE_URL);
// Define the UserProfile type based on your schema
type UserProfile = {
  username: string;
  age: number;
  friendlyId: string;
  bio: string;
  profilePicture: string;
  coverImage: string;
  country: string;
  profession: string;
};

/**
 * Hook for editing a user's profile.
 */
export function useProfileEdit(friendlyId: string) {
  const {
    data: userProfile,
    error,
    mutate,
  } = useSWR<UserProfile>(
    `${ENDPOINTS.profile.fetch}/${friendlyId}`, // Use dynamic endpoint
    (url) => swrFetcher(url), // Use swrFetcher for data fetching
    {
      fallbackData: {
        username: "",
        age: 0,
        bio: "",
        friendlyId: "",
        profilePicture: "",
        coverImage: "",
        country: "",
        profession: "",
      },
    }
  );

  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  /**
   * Save the updated profile data.
   * @param profileData The updated profile information.
   */
  const saveProfile = async (profileData: UserProfile) => {
    setIsSaving(true);
    setSaveError(null);
    try {
      // Make PUT request to save profile
      await request<UserProfile>("PUT", `${ENDPOINTS.profile.update}/${friendlyId}`, profileData);
      await mutate(); // Revalidate the SWR cache
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setSaveError(errorMessage);
      console.error("Error saving profile:", err);
      throw err; // Optionally rethrow if you want to handle it further up
    } finally {
      setIsSaving(false);
    }
  };

  return {
    userProfile,
    isLoading: !error && !userProfile,
    error,
    isSaving,
    saveError,
    saveProfile,
  };
}
