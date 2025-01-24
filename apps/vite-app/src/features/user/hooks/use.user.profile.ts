import useSWR from "swr";
import { swrFetcher } from "../../../../api/swrFetcher";
import { userProfileSchema, defaultUserProfile } from "@repo/zod/validation/user";
import { getEndpoints } from "@repo/api/endpoints";
const ENDPOINTS = getEndpoints(import.meta.env.VITE_BASE_URL);
export const useUserProfile = () => {
  const { data, error, isLoading, mutate } = useSWR(ENDPOINTS.users.fetchProfile, (endpoint) => swrFetcher(endpoint, userProfileSchema, defaultUserProfile), {
    dedupingInterval: Infinity,
  });

  return {
    userProfile: data ?? defaultUserProfile,
    error,
    isLoading,
    mutate,
  };
};
