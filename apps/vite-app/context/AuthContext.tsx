import useSWR from "swr";
import React from "react";
import { request } from "../api/request";
import { AuthContext } from "../src/features/user/hooks/use.auth";
import { getEndpoints } from "@repo/api/endpoints";
const ENDPOINTS = getEndpoints(import.meta.env.VITE_BASE_URL);
type User = {
  friendlyId: string;
  username: string;
  profilePicture: string;
  profession: string;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    data: userData,
    error,
    isLoading,
    mutate,
  } = useSWR<User | null>(
    ENDPOINTS.auth.loggedUser,
    async (url) => {
      const user = await request<User>("GET", url);
      return user;
    },
    {
      revalidateOnFocus: true,
    }
  );
  const isAuthenticated = Boolean(userData && !error);

  const signIn = async () => {
    await mutate();
  };

  const signOut = async () => {
    try {
      await request("POST", ENDPOINTS.auth.signout);
    } catch (err) {
      console.error("signOut error:", err);
    }
    mutate(null, false);
  };

  return (
    <AuthContext.Provider
      value={{
        loggedUser: userData ?? null,
        isAuthenticated,
        isLoading,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
