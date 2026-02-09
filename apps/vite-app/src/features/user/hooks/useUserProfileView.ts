import { getEndpoints } from '@repo/api/endpoints';
import { defaultUserProfile, userProfileSchema } from '@repo/zod/validation/user';
import { useParams } from 'react-router-dom';
import useSWR from 'swr';

import { swrFetcher } from '../../../../api/swrFetcher';

const ENDPOINTS = getEndpoints(import.meta.env.VITE_BASE_URL);

export const useUserProfileView = () => {
  // Get URL parameters - might be either friendlyId (new URL structure) or username (old URL structure)
  const params = useParams<{ friendlyId: string }>();
  const friendlyId = params.friendlyId;

  // Debug the parameters we're getting
  // console.log('useUserProfileView params:', params, 'friendlyId:', friendlyId);

  // Fetch only if `friendlyId` exists
  const { data, error, isLoading, mutate } = useSWR(
    friendlyId ? ENDPOINTS.users.fetchUserPublicProfile(friendlyId) : null,
    async (endpoint) => {
      try {
        const result = await swrFetcher(endpoint, userProfileSchema, defaultUserProfile);

        // If the response doesn't have essential fields, consider it a "not found"
        if (!result?.username) {
          // console.log(`User profile not found for friendlyId: ${friendlyId}`);
          // Log the attempt for analytics and save to localStorage
          // console.info(`Attempted to access non-existent profile: ${friendlyId}`);
          localStorage.setItem('lastAttemptedProfile', friendlyId || 'unknown');
        }

        return result;
      } catch (err) {
        console.error(`Error fetching user profile for ${friendlyId}:`, err);
        // Save the attempted profile ID to localStorage on error too
        if (friendlyId) {
          localStorage.setItem('lastAttemptedProfile', friendlyId);
        }
        return defaultUserProfile;
      }
    },
  );

  return {
    userProfile: data ?? defaultUserProfile,
    error,
    isLoading,
    mutate,
  };
};
