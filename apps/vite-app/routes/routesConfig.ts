export const routesConfig = {
  auth: '/auth',
  login: '/auth/login',
  register: '/auth/register',
  home: '/',
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
