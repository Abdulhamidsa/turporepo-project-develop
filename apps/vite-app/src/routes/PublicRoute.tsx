import React from 'react';

import { Navigate } from 'react-router-dom';

import { routesConfig } from '../../routes/routesConfig';
import { useAuth } from '../features/user/hooks/use.auth';

interface PublicRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

/**
 * PublicRoute component - Only allows access when user is NOT logged in
 * Redirects logged-in users to the home page or specified route
 */
export function PublicRoute({ children, redirectTo = routesConfig.home }: PublicRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If user is authenticated, redirect to home or specified route
  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  // If not authenticated, render children (public content)
  return <>{children}</>;
}
