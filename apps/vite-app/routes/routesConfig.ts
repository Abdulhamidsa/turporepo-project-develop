export const routesConfig = {
  auth: '/', // Auth is now at root
  login: '/', // Login redirects to root
  register: '/', // Register redirects to root
  home: '/feed', // Home feed for authenticated users
  posts: '/posts',
  projects: '/projects',
  projectDetails: (projectId: string) => `/projects/${projectId}`,
  users: '/discover/professionals', // Public route
  professionals: '/professionals', // Protected route for logged-in users
  userPortfolio: (friendlyId: string) => `/user/${friendlyId}/manage`,
  userPortfolioView: (friendlyId: string) => `/user/${friendlyId}`,
  publicProfile: (friendlyId: string) => `/profile/${friendlyId}`,
  simplePublicProfile: (friendlyId: string) => `/public-profile/${friendlyId}`,
  profile: '/profile/edit',
  settings: '/settings',
  notFound: '*',
};
