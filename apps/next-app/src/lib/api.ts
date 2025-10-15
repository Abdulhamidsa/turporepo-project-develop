import { getEndpoints } from '@repo/api/endpoints';
import { UserProfile } from '@repo/zod/validation/user';
import 'server-only';

import { GetUserProjectResponse } from '../types';
import { AppError } from '../utils/app.error';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL as string;
const ENDPOINTS = getEndpoints(BASE_URL);

function getFullUrl(url: string): string {
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  return `${BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
}

async function handleApiRequest(url: string, options?: RequestInit) {
  try {
    const fullUrl = getFullUrl(url);
    console.log('Fetching URL:', fullUrl);

    const res = await fetch(fullUrl, {
      cache: 'force-cache',
      next: { revalidate: 30 },
      ...options,
    });
    console.log('Response received with status:', res.status);

    if (!res.ok) {
      const errorBody = await res.json().catch(() => null);
      console.error('Fetch error, response not ok:', errorBody);
      throw new AppError('API request failed', res.status, errorBody || res.statusText);
    }

    const json = await res.json();
    console.log('Response JSON:', json);
    return json;
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
 *  Get All Projects
 */
export async function getProjects(page = 1, limit = 12, search = '') {
  try {
    const url = `${ENDPOINTS.projects.fetchAll}?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`;
    const response = await handleApiRequest(url);
    let projects = response.data.projects || [];
    projects = projects.filter((project: any) => project.user?.completedProfile === true);
    const totalPages = Math.ceil(response.data.pagination.total / limit);
    console.log('projects', projects);
    return { projects, totalPages };
  } catch (error) {
    console.error('Error fetching projects:', error);
    return { projects: [], totalPages: 1 };
  }
}

/**
 * Get All Users
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
 * Get User Profile
 */
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

/**
 *  Get User Projects (Fast Revalidation)
 */
export async function getUserProject(friendlyId: string): Promise<GetUserProjectResponse | null> {
  try {
    const url = ENDPOINTS.projects.fetchByFriendlyId(friendlyId);
    const response: GetUserProjectResponse = await handleApiRequest(url);

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
