import { useEffect, useState } from 'react';

import { mockPagination, mockUsers } from '../data/mockUsers';

// Extended User type that includes country data for admin use
type User = {
  id: string;
  username: string;
  friendlyId: string;
  profession: string | null;
  profilePicture: string | null;
  createdAt: string;
  completedProfile: boolean;
  countryOrigin?: string;
  email?: string;
};

type UserApiResponse = {
  users: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export const useAdminMockUsers = (page: number = 1, limit: number = 100) => {
  const [data, setData] = useState<UserApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Simulate API call delay
    const timer = setTimeout(() => {
      try {
        // Convert mock users to match User interface
        const users: User[] = mockUsers.map((user) => ({
          id: user.id,
          username: user.username,
          friendlyId: user.friendlyId,
          profession: user.profession,
          profilePicture: user.profilePicture || null,
          createdAt: user.createdAt,
          completedProfile: user.completedProfile,
          countryOrigin: user.countryOrigin,
          email: user.email,
        }));

        setData({
          users,
          pagination: mockPagination,
        });
        setIsLoading(false);
      } catch (err) {
        setError(err as Error);
        setIsLoading(false);
      }
    }, 500); // Simulate API delay

    return () => clearTimeout(timer);
  }, [page, limit]);

  return {
    users: data?.users || [],
    pagination: data?.pagination || null,
    isLoading,
    error,
    mutate: () => {
      // Mock mutate function
      setIsLoading(true);
      setTimeout(() => setIsLoading(false), 200);
    },
  };
};
