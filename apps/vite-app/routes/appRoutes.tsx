import NotFound from '@repo/ui/components/NotFound';
import { RouteObject } from 'react-router-dom';

import DashboardLayout from '../src/layout/DashboardLayout';
import ProfilePage from '../src/pages/[username]/manage';
import ProfileView from '../src/pages/[username]/view';
import Feed from '../src/pages/feed';
import Posts from '../src/pages/posts';
import ProfileInfo from '../src/pages/profileInfo';
import Projects from '../src/pages/projects';
import Settings from '../src/pages/settings';
import { AuthOrRedirect } from '../utils/AuthRedirect';
import { ProtectedRoute } from './protectedRoutes';
import { routesConfig } from './routesConfig';

export const appRoutes: RouteObject[] = [
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
  {
    path: '*', // Catch-all 404 for unknown routes
    element: <NotFound />,
  },
];
