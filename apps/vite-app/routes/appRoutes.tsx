import NotFound from '@repo/ui/components/NotFound';
import { RouteObject } from 'react-router-dom';

import { AuthOrRedirect } from '../src/features/auth/components/AuthRedirect';
import DashboardLayout from '../src/layout/DashboardLayout';
import ProfilePage from '../src/pages/[username]/manage';
import ProfileView from '../src/pages/[username]/view';
import AdminDashboard from '../src/pages/admin/dashboard';
import AdminSignin from '../src/pages/admin/signin';
import AdminUserProfile from '../src/pages/admin/user-profile';
import DirectProfessionalProfile from '../src/pages/direct-professional';
import UsersPage from '../src/pages/discover/professionals';
import Feed from '../src/pages/feed';
import Posts from '../src/pages/posts';
import ProfessionalsPage from '../src/pages/professionals';
import PublicProfileView from '../src/pages/profile/view';
import ProfileInfo from '../src/pages/profileInfo';
import Projects from '../src/pages/projects';
import SimplePublicProfile from '../src/pages/public-profile/[friendlyId]';
import Settings from '../src/pages/settings';
import { AdminRoute } from '../src/routes/AdminRoute';
import { PublicRoute } from '../src/routes/PublicRoute';
import { ProtectedRoute } from './protectedRoutes';
import { routesConfig } from './routesConfig';

export const appRoutes: RouteObject[] = [
  // Admin Routes - Must be first to avoid auth conflicts
  {
    path: '/admin/signin',
    element: <AdminSignin />,
  },
  {
    path: '/admin/dashboard',
    element: (
      <AdminRoute>
        <AdminDashboard />
      </AdminRoute>
    ),
  },
  {
    path: '/admin/user/:userId',
    element: (
      <AdminRoute>
        <AdminUserProfile />
      </AdminRoute>
    ),
  },

  // Root route - Auth page for public, redirects to feed for authenticated
  {
    path: '/',
    element: <AuthOrRedirect />,
  },
  // Public and Protected Routes with DashboardLayout
  {
    element: <DashboardLayout />,
    children: [
      // Public routes - accessible to everyone
      {
        path: '/feed',
        element: <Feed />,
      },
      {
        path: routesConfig.userPortfolioView(':friendlyId'),
        element: <ProfileView />,
      },
      // Protected routes - require authentication
      {
        path: routesConfig.posts,
        element: (
          <ProtectedRoute>
            <Posts />
          </ProtectedRoute>
        ),
      },
      {
        path: routesConfig.projects,
        element: (
          <ProtectedRoute>
            <Projects />
          </ProtectedRoute>
        ),
      },
      {
        path: routesConfig.professionals,
        element: (
          <ProtectedRoute>
            <ProfessionalsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: routesConfig.userPortfolio(':friendlyId'),
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
      {
        path: routesConfig.profile,
        element: (
          <ProtectedRoute>
            <ProfileInfo />
          </ProtectedRoute>
        ),
      },
      {
        path: routesConfig.settings,
        element: (
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        ),
      },
    ],
  },
  // Public Profile Routes - Not Protected
  {
    path: `/profile/:id`,
    element: <PublicProfileView />,
  },
  {
    path: routesConfig.users,
    element: (
      <PublicRoute redirectTo={routesConfig.professionals}>
        <UsersPage />
      </PublicRoute>
    ),
  },
  {
    path: '/explore/professionals/:friendlyId',
    element: <DirectProfessionalProfile />,
  },

  {
    path: '/public-profile/:friendlyId',
    element: <SimplePublicProfile />,
  },

  {
    path: '*',
    element: <NotFound />,
  },
];
