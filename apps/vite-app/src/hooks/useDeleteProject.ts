import { getEndpoints } from '@repo/api/endpoints';
import useSWR, { mutate } from 'swr';

import { request } from '../../api/request';

const ENDPOINTS = getEndpoints(import.meta.env.VITE_BASE_URL);

export const useDeleteProject = () => {
  const { data, error, isLoading } = useSWR(ENDPOINTS.projects.fetchAll, (url) =>
    request('GET', url),
  );

  const deleteProject = async (projectId: string) => {
    if (!projectId) {
      console.error('Project ID is missing');
      return;
    }

    try {
      await request('DELETE', `${ENDPOINTS.projects.delete}/${projectId}`);
      console.info(`Project with ID ${projectId} deleted successfully.`);
      mutate(ENDPOINTS.projects.fetchAll);
    } catch (error) {
      console.error('Failed to delete project:', error);
    }
  };

  return { deleteProject, projects: data || [], error, isLoading };
};
