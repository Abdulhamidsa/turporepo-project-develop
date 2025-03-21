import { createContext, useContext } from 'react';

import { getEndpoints } from '@repo/api/endpoints';
import { updateCredentialsSchema } from '@repo/zod/validation/auth';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';

import { request } from '../../../../api/request';
import { getErrorMessage } from '../../../../utils/getErrorMessage';

const ENDPOINTS = getEndpoints(import.meta.env.VITE_BASE_URL);

type SignupResponse = {
  id: string;
  username: string;
};

type SignupPayload = {
  username: string;
  password: string;
};

type AuthContextType = {
  loggedUser: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  refetchUser: () => Promise<void>;
};
type User = {
  friendlyId: string;
  username: string;
  profilePicture: string;
  profession: string;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const useSignup = () => {
  const mutationFetcher = async (url: string, { arg }: { arg: SignupPayload }) => {
    const response = await request<SignupResponse>('POST', url, arg);
    return response;
  };

  const { trigger, isMutating, error } = useSWRMutation<
    SignupResponse,
    Error,
    string,
    SignupPayload
  >(ENDPOINTS.auth.signup, mutationFetcher);

  return {
    signup: trigger,
    isSubmitting: isMutating,
    error: error ? getErrorMessage(error) : null,
  };
};

// signin hook

type SigninPayload = {
  email: string;
  password: string;
};

type SigninResponse = {
  success: string;
  data: {
    message: string;
  };
};

// src/hooks/useSignin.ts
export const useSignin = () => {
  const { signIn } = useAuth();

  const mutationFetcher = async (url: string, { arg }: { arg: SigninPayload }) => {
    const response = await request<SigninResponse>('POST', url, arg);
    return response;
  };
  const { trigger, isMutating, error } = useSWRMutation<
    SigninResponse,
    Error,
    string,
    SigninPayload
  >(ENDPOINTS.auth.signin, mutationFetcher);

  const signin = async (payload: SigninPayload) => {
    // 1) Call the sign-in endpoint
    const response = await trigger(payload);
    if (response) {
      await signIn();
    }
    return response;
  };

  return {
    signin,
    isSubmitting: isMutating,
    error: error ? getErrorMessage(error) : null,
  };
};

export type CredentialsType = {
  email: string;
  password: string;
};

// fetch credentials
export const useFetchCredentials = () => {
  const { data, error, mutate } = useSWR<CredentialsType | null>(
    ENDPOINTS.auth.credentials,
    async (url: string) => {
      const response = await request<CredentialsType>('GET', url);
      return response;
    },
  );

  return {
    credentials: data || null,
    isLoading: !error && !data,
    error: error ? getErrorMessage(error) : null,
    mutate,
  };
};

// Update credentials
export type UpdateCredentialsPayload = {
  email?: string | undefined;
  password?: string | undefined;
};

export const useUpdateCredentials = () => {
  const mutationFetcher = async (url: string, { arg }: { arg: UpdateCredentialsPayload }) => {
    // Validate the payload before sending it to the API
    const validatedPayload = updateCredentialsSchema.parse(arg);
    const response = await request('PUT', url, validatedPayload);
    return response;
  };
  const { trigger, isMutating, error } = useSWRMutation(
    ENDPOINTS.auth.credentials,
    mutationFetcher,
  );
  return {
    updateCredentials: trigger,
    isSubmitting: isMutating,
    error: error ? getErrorMessage(error) : null,
  };
};

// delete account
export const useDeleteAccount = () => {
  const { signOut } = useAuth();

  const mutationFetcher = async (url: string) => {
    try {
      await request('DELETE', url);
    } catch (error) {
      const message = getErrorMessage(error);
      if (message.includes('already deactivated')) {
        console.warn('User is already deactivated, proceeding with sign-out.');
      } else {
        throw new Error(message);
      }
    }
  };

  const { trigger, isMutating, error } = useSWRMutation(ENDPOINTS.auth.delete, mutationFetcher);

  const deleteAccount = async () => {
    try {
      await trigger();
      await signOut();
    } catch (err) {
      throw new Error(getErrorMessage(err));
    }
  };

  return {
    deleteAccount,
    isSubmitting: isMutating,
    error: error ? getErrorMessage(error) : null,
  };
};
