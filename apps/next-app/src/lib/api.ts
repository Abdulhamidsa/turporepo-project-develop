import { getEndpoints } from '@repo/api/endpoints';
import { UserProfile } from '@repo/zod/validation/user';
import 'server-only';

const ENDPOINTS = getEndpoints(process.env.NEXT_PUBLIC_BASE_URL as string);

class AppError extends Error {
  status: number;
  details?: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = 'AppError';
    this.status = status;
    this.details = details;
  }
}

async function handleApiRequest(url: string, options?: RequestInit) {
  try {
    const res = await fetch(url, options);

    if (!res.ok) {
      const errorBody = await res.json().catch(() => null);
      throw new AppError('API request failed', res.status, errorBody || res.statusText);
    }

    return await res.json();
  } catch (error) {
    if (error instanceof AppError) {
      console.error(`Error ${error.status}: ${error.message}`, error.details);
    } else {
      console.error('Unexpected error:', error);
    }
    throw error;
  }
}

/**
 * OLD FUNCTION (WITH SEARCH) - COMMENTED OUT
 */
export async function getProjects(page = 1, limit = 12, search = '') {
  try {
    const url = `${ENDPOINTS.projects.fetchAll}?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`;
    const response = await handleApiRequest(url, { next: { revalidate: 300 }, cache: 'no-store' });
    const projects = response.data.projects || [];
    const totalPages = Math.ceil(response.data.pagination.total / limit);
    return { projects, totalPages };
  } catch (error) {
    console.error('Error fetching projects:', error);
    return { projects: [], totalPages: 1 };
  }
}

/**
 * NEW FUNCTION (WITHOUT SEARCH)
 */
// export async function getProjects(page = 1, limit = 12) {
//   try {
//     const url = `${ENDPOINTS.projects.fetchAll}?page=${page}&limit=${limit}`;
//     const response = await handleApiRequest(url, { next: { revalidate: 3600 }, cache: 'no-store' });
//     const projects = response.data.projects || [];
//     const totalPages = Math.ceil(response.data.pagination.total / limit);
//     return { projects, totalPages };
//   } catch (error) {
//     console.error('Error fetching projects:', error);
//     return { projects: [], totalPages: 1 };
//   }
// }

/**
 * OLD FUNCTION (WITH SEARCH) - COMMENTED OUT
 */
export async function getUsers(page = 1, limit = 12, search = '') {
  try {
    const url = `${ENDPOINTS.users.fetchAll}?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`;
    const response = await handleApiRequest(url);
    const filteredUsers = (response.data?.users || []).filter(
      (user: UserProfile) => user.completedProfile,
    );
    return { users: filteredUsers, total: filteredUsers.length };
  } catch (error) {
    console.error('Error fetching users:', error);
    return { users: [], total: 0 };
  }
}

/**
 * NEW FUNCTION (WITHOUT SEARCH)
 */
// export async function getUsers(page = 1, limit = 12) {
//   try {
//     const url = `${ENDPOINTS.users.fetchAll}?page=${page}&limit=${limit}`;
//     const response = await handleApiRequest(url);
//     const filteredUsers = (response.data?.users || []).filter(
//       (user: UserProfile) => user.completedProfile,
//     );
//     return { users: filteredUsers, total: filteredUsers.length };
//   } catch (error) {
//     console.error('Error fetching users:', error);
//     return { users: [], total: 0 };
//   }
// }

export async function getUserProfile(friendlyId: string) {
  try {
    const url = ENDPOINTS.users
      .fetchUserPublicProfile(friendlyId)
      .replace(':friendlyId', friendlyId);
    const response = await handleApiRequest(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
}

interface Project {
  id: string;
  title: string;
  description: string;
  url: string;
  media: string[];
}

interface User {
  friendlyId: string;
  username: string;
  profilePicture: string;
}

interface GetUserProjectResponse {
  success: boolean;
  data: {
    projects: Project[];
    user: User;
  };
}

export async function getUserProject(friendlyId: string): Promise<GetUserProjectResponse | null> {
  try {
    const url = ENDPOINTS.projects.fetchByFriendlyId(friendlyId);
    const response: GetUserProjectResponse = await handleApiRequest(url, {
      next: { revalidate: 300 },
    });

    if (!response.success) {
      throw new AppError('Failed to fetch project', 500);
    }

    console.log('response', response);
    return response;
  } catch (error) {
    console.error('Error fetching project:', error);
    return null;
  }
}
