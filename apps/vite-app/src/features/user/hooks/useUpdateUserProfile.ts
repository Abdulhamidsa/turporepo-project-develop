import { getEndpoints } from '@repo/api/endpoints';
import { EditableProfileType } from '@repo/data/types/user';

import { request } from '../../../../api/request';
import { useUserProfile } from './use.user.profile';

const ENDPOINTS = getEndpoints(import.meta.env.VITE_BASE_URL);

export const useUpdateUserProfile = () => {
  const { mutate, isLoading } = useUserProfile();

  const updateProfile = async (profile: EditableProfileType) => {
    try {
      const updatedProfile = await request<EditableProfileType>(
        'PUT',
        ENDPOINTS.profile.update,
        profile,
      );

      await mutate();
      return updatedProfile;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  };

  return { updateProfile, isLoading };
};
