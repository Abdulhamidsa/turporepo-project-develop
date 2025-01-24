import useSWR from "swr";
import { swrFetcher } from "../../../../api/swrFetcher";
import { fetchedProjectSchema, FetchedProjectType } from "@repo/zod/validation";
import { getEndpoints } from "@repo/api/endpoints";
const ENDPOINTS = getEndpoints(import.meta.env.VITE_BASE_URL);
import { z } from "zod";

const projectArraySchema = z.array(fetchedProjectSchema);

export const useUserProjects = () => {
  const { data, error: swrError, isLoading, mutate } = useSWR<FetchedProjectType[]>(ENDPOINTS.projects.fetchUserProjects, (endpoint: string) => swrFetcher(endpoint, projectArraySchema, []));
  return {
    projects: data ?? [],
    mutate,
    isLoading,
    error: swrError,
  };
};
