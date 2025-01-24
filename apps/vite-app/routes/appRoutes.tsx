import { RouteObject } from "react-router-dom";
import ProfilePage from "../src/pages/[username]/manage";
import ProfileView from "../src/pages/[username]/view";
import ProfileInfo from "../src/pages/profileInfo";
import DashboardLayout from "../src/layout/DashboardLayout";
import Settings from "../src/pages/settings";
import { ProtectedRoute } from "./protectedRoutes";
import NotFound from "@repo/ui/components/NotFound";
import { AuthOrRedirect } from "../utils/AuthRedirect";
import Feed from "../src/pages/feed";
import { routesConfig } from "./routesConfig";

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
        path: routesConfig.feed,
        element: <Feed />,
      },
      {
        path: routesConfig.userPortfolio(":friendlyId"),
        element: <ProfilePage />,
      },
      {
        path: routesConfig.userPortfolioView(":friendlyId"),
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
    path: "*", // Catch-all 404 for unknown routes
    element: <NotFound />,
  },
];
