export const routesConfig = {
  auth: '/auth',
  home: '/',
  userPortfolio: (friendlyId: string) => `/user/${friendlyId}/manage`,
  userPortfolioView: (friendlyId: string) => `/user/${friendlyId}`,
  profile: '/profile/edit',
  settings: '/settings',
  feed: '/feed',
  notFound: '*',
};
