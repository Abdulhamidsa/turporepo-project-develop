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

  {
    path: routesConfig.auth,
    element: <AuthOrRedirect />,
  },
  {
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: routesConfig.home,
        element: <Feed />,
      },
      {
        path: routesConfig.posts,
        element: <Posts />,
      },
      {
        path: routesConfig.projects,
        element: <Projects />,
      },
      {
        path: routesConfig.professionals,
        element: <ProfessionalsPage />,
      },
      {
        path: routesConfig.userPortfolio(':friendlyId'),
        element: <ProfilePage />,
      },
      {
        path: routesConfig.userPortfolioView(':friendlyId'),
        element: <ProfileView />,
      },
      {
        path: routesConfig.profile,
        element: <ProfileInfo />,
      },
      {
        path: routesConfig.settings,
        element: <Settings />,
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
