import { useState } from "react";
import useSWRInfinite from "swr/infinite";
import { swrFetcher } from "../../../../api/swrFetcher";
import { getEndpoints } from "@repo/api/endpoints";

const ENDPOINTS = getEndpoints(import.meta.env.VITE_BASE_URL);

export type ProjectType = {
  id: string;
  title: string;
  description: string;
  url?: string;
  thumbnail?: string;
  media: { url: string }[];
  tags: { id: string; name: string }[];
  user: { username: string; profilePicture?: string | null; profession: string; friendlyId: string | null };
  createdAt: string;
  updatedAt?: string;
  likedByUser: boolean;
  likesCount: number;
};

export const useProjects = (initialLimit = 5) => {
  const [limit] = useState(initialLimit);

  const { data, error, size, setSize, mutate, isValidating } = useSWRInfinite<{
    projects: ProjectType[];
    pagination: {
      page: number;
      total: number;
    };
  }>((pageIndex) => `${ENDPOINTS.projects.fetchAll}?limit=${limit}&page=${pageIndex + 1}`, swrFetcher, {
    revalidateOnFocus: false, // Prevents refetching on window focus
    persistSize: true, // Keeps track of previously loaded pages
  });

  // Ensure projects are loaded in the correct order
  const projects = data ? data.flatMap((page) => page.projects) : [];

  const totalPages = data?.[0]?.pagination.total ? Math.ceil(data[0].pagination.total / limit) : 0;

  const loadMore = () => {
    if (size < totalPages) {
      setSize(size + 1);
    }
  };

  const toggleLike = async (projectId: string) => {
    try {
      // Optimistic UI update to toggle like status
      mutate(
        (currentData) =>
          currentData
            ? currentData.map((page) => ({
                ...page,
                projects: page.projects.map((project) =>
                  project.id === projectId
                    ? {
                        ...project,
                        likedByUser: !project.likedByUser,
                        likesCount: project.likedByUser ? project.likesCount - 1 : project.likesCount + 1,
                      }
                    : project
                ),
              }))
            : currentData,
        false // Prevent auto revalidation
      );

      // Revalidate data after successful API call
      mutate();
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const isReachingEnd = size >= totalPages;

  return {
    projects,
    isLoading: !data && !error,
    error,
    toggleLike,
    loadMore,
    isReachingEnd,
    isValidating,
    totalPages,
    currentPage: size,
    mutate,
  };
};
