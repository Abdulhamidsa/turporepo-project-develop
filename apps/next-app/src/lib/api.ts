import "server-only";
import { getEndpoints } from "@repo/api/endpoints";
import { UserProfile } from "@repo/zod/validation/user";
const ENDPOINTS = getEndpoints(process.env.NEXT_PUBLIC_BASE_URL as string);

export async function getProjects(page = 1, limit = 12, search = "") {
  try {
    // ✅ Add search to the API request
    const res = await fetch(`${ENDPOINTS.projects.fetchAll}?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`, { next: { revalidate: 3600 }, cache: "no-store" });

    if (!res.ok) throw new Error("Failed to fetch projects");

    const response = await res.json();
    const projects = response.data.projects || [];
    const totalPages = Math.ceil(response.data.pagination.total / limit);

    return { projects, totalPages };
  } catch (error) {
    console.error("Error fetching projects:", error);
    return { projects: [], totalPages: 1 };
  }
}
export async function getUsers(page = 1, limit = 12, search = "") {
  try {
    const res = await fetch(`${ENDPOINTS.users.fetchAll}?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`);

    if (!res.ok) throw new Error("Failed to fetch users");

    const json = await res.json();

    // Filter users where completedProfile is true
    const filteredUsers = (json.data?.users || []).filter((user: UserProfile) => user.completedProfile);

    return {
      users: filteredUsers,
      total: filteredUsers.length, // Return the count of filtered users
    };
  } catch (error) {
    console.error(error);
    return { users: [], total: 0 };
  }
}

export async function getUserProfile(friendlyId: string) {
  try {
    const res = await fetch(`${ENDPOINTS.users.fetchUserPublicProfile(friendlyId).replace(":friendlyId", friendlyId)}`);

    if (!res.ok) throw new Error("Failed to fetch user profile");

    const response = await res.json();
    return response.data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
}

// Fetch a single project by ID
// export async function getProject(id: string) {
//   const res = await fetch(`${BASE_URL}/projects/${id}`, {
//     next: { revalidate: 3600 }, // Revalidate every hour
//   });
//   if (!res.ok) throw new Error("Failed to fetch project");
//   return res.json();
// }

// Fetch featured users with a limit on the number of users
// export async function getFeaturedUsers(limit = 3) {
//   const res = await fetch(`${BASE_URL}/users/featured?limit=${limit}`, {
//     next: { revalidate: 3600 }, // Revalidate every hour
//   });
//   if (!res.ok) throw new Error("Failed to fetch featured users");
//   return res.json();
// }

// Fetch featured projects with a limit on the number of projects
// export async function getFeaturedProjects(limit = 3) {
//   const res = await fetch(`${BASE_URL}/projects/featured?limit=${limit}`, {
//     next: { revalidate: 3600 }, // Revalidate every hour
//   });
//   if (!res.ok) throw new Error("Failed to fetch featured projects");
//   return res.json();
// }
