import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

const IGNORED_ENDPOINTS = ['/logged-user', '/admin/*', '/admin/dashboard'];

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      const isIgnoredEndpoint = IGNORED_ENDPOINTS.some((endpoint) =>
        error.config?.url?.includes(endpoint),
      );
      if (!isIgnoredEndpoint) {
        console.warn('Unauthorized: Redirecting to authentication.');
      }
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
