import { DependencyList, useCallback, useEffect, useState } from 'react';

import { request } from '../../api/request';
import { AppError } from '../../utils/errors';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface UseRequestOptions<T = unknown> {
  shouldFetch?: boolean;
  dependencies?: DependencyList;
  initialData?: T | null;
}

interface MutateOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: AppError | Error) => void;
}

interface UseRequestResult<T> {
  data: T | null;
  loading: boolean;
  error: AppError | Error | null;
  refetch: () => Promise<void>;
}

interface UseMutationResult<T, P> {
  data: T | null;
  loading: boolean;
  error: AppError | Error | null;
  mutate: (payload?: P) => Promise<T | null>;
}

export function useGetRequest<T>(
  url: string,
  options: UseRequestOptions<T> = {},
): UseRequestResult<T> {
  const { shouldFetch = true, dependencies = [], initialData = null } = options;
  const [data, setData] = useState<T | null>(initialData as T | null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AppError | Error | null>(null);

  const fetchData = useCallback(async (): Promise<void> => {
    if (!shouldFetch) return;

    setLoading(true);
    setError(null);

    try {
      const response = await request<T>('GET', url);
      setData(response);
    } catch (err) {
      setError(err as AppError | Error);
    } finally {
      setLoading(false);
    }
  }, [url, shouldFetch]);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchData, ...(dependencies || [])]);

  return { data, loading, error, refetch: fetchData };
}

export function useMutation<T, P = unknown>(
  method: HttpMethod,
  url: string,
): UseMutationResult<T, P> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AppError | Error | null>(null);

  const mutate = useCallback(
    async (payload?: P, options?: MutateOptions<T>) => {
      setLoading(true);
      setError(null);

      try {
        const response = await request<T>(method, url, payload);
        setData(response);
        options?.onSuccess?.(response);
        return response;
      } catch (err) {
        const error = err as AppError | Error;
        setError(error);
        options?.onError?.(error);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [method, url],
  );

  return { data, loading, error, mutate };
}
