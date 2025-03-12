export const routesConfig = {
  auth: '/auth',
  home: '/',
  posts: '/posts',
  projects: '/projects',
  userPortfolio: (friendlyId: string) => `/user/${friendlyId}/manage`,
  userPortfolioView: (friendlyId: string) => `/user/${friendlyId}`,
  profile: '/profile/edit',
  settings: '/settings',
  notFound: '*',
};
