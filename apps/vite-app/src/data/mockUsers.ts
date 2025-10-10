// Mock user data for admin system (until backend API is available)

export type MockUser = {
  id: string;
  username: string;
  friendlyId: string;
  email: string;
  profession: string;
  countryOrigin: string;
  profilePicture?: string;
  createdAt: string;
  completedProfile: boolean;
  isActive: boolean;
};

export const mockUsers: MockUser[] = [
  {
    id: '1',
    username: 'john_doe',
    friendlyId: 'john123',
    email: 'john.doe@example.com',
    profession: 'Software Developer',
    countryOrigin: 'US',
    profilePicture:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    completedProfile: true,
    isActive: true,
  },
  {
    id: '2',
    username: 'jane_smith',
    friendlyId: 'jane456',
    email: 'jane.smith@example.com',
    profession: 'UI/UX Designer',
    countryOrigin: 'GB',
    profilePicture:
      'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    createdAt: new Date().toISOString(), // Today
    completedProfile: true,
    isActive: true,
  },
  {
    id: '3',
    username: 'alex_wilson',
    friendlyId: 'alex789',
    email: 'alex.wilson@example.com',
    profession: 'Data Scientist',
    countryOrigin: 'CA',
    profilePicture:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    completedProfile: false,
    isActive: false,
  },
  {
    id: '4',
    username: 'maria_garcia',
    friendlyId: 'maria101',
    email: 'maria.garcia@example.com',
    profession: 'Product Manager',
    countryOrigin: 'ES',
    profilePicture:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    createdAt: new Date().toISOString(), // Today
    completedProfile: true,
    isActive: true,
  },
  {
    id: '5',
    username: 'david_lee',
    friendlyId: 'david202',
    email: 'david.lee@example.com',
    profession: 'DevOps Engineer',
    countryOrigin: 'KR',
    profilePicture:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    createdAt: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
    completedProfile: true,
    isActive: true,
  },
  {
    id: '6',
    username: 'sophie_martin',
    friendlyId: 'sophie303',
    email: 'sophie.martin@example.com',
    profession: 'Marketing Specialist',
    countryOrigin: 'FR',
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    completedProfile: false,
    isActive: false,
  },
  {
    id: '7',
    username: 'ryan_taylor',
    friendlyId: 'ryan404',
    email: 'ryan.taylor@example.com',
    profession: 'Full Stack Developer',
    countryOrigin: 'AU',
    profilePicture:
      'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=150&h=150&fit=crop&crop=face',
    createdAt: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
    completedProfile: true,
    isActive: true,
  },
  {
    id: '8',
    username: 'emma_brown',
    friendlyId: 'emma505',
    email: 'emma.brown@example.com',
    profession: 'Content Writer',
    countryOrigin: 'NZ',
    profilePicture:
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face',
    createdAt: new Date().toISOString(), // Today
    completedProfile: true,
    isActive: true,
  },
];

export const mockPagination = {
  page: 1,
  limit: 100,
  total: mockUsers.length,
  totalPages: 1,
};
