// src/routes/ProtectedRoute.tsx
import React from 'react';

import Loading from '@repo/ui/components/ui/Loading';
import { Navigate } from 'react-router-dom';

import { useAuth } from '../src/features/user/hooks/use.auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) {
    return <Loading />;
  }
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }
  return <>{children}</>;
}
