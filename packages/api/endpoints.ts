export const getEndpoints = (baseUrl: string) => ({
  posts: {
    fetch: `${baseUrl}/posts`,
    like: `${baseUrl}/post/like`,
    addComment: `${baseUrl}/post/comment`,
    post: `${baseUrl}/post`,
    deleteComment: (postId: string, commentId: string) =>
      `${baseUrl}/post/comment/${postId}/${commentId}`,
    fetchUserPosts: (friendlyId: string) => `/user/${friendlyId}/posts`,
    deletePost: (postId: string) => `${baseUrl}/post/${postId}`,
  },
  users: {
    updateProfile: `${baseUrl}/user/update`,
    fetchProfile: `${baseUrl}/profile/:friendlyId`,
    fetchUserPublicProfile: (friendlyId: string) => `${baseUrl}/user/${friendlyId}`,
    fetchAll: `${baseUrl}/users`,
  },
  profile: {
    fetch: `${baseUrl}/profile`,
    update: `${baseUrl}/profile`,
  },
  projects: {
    fetchByFriendlyId: (friendlyId: string) => `${baseUrl}/projects/user/${friendlyId}`,
    fetchUserProjects: `${baseUrl}/projects/user`,
    delete: `${baseUrl}/project`,
    create: `${baseUrl}/project`,
    fetchAll: `${baseUrl}/projects`,
    projectAi: `${baseUrl}/ai/generate`,
  },
  auth: {
    signin: `${baseUrl}/auth/signin`,
    signup: `${baseUrl}/auth/signup`,
    credentials: `${baseUrl}/credentials`,
    signout: `${baseUrl}/signout`,
    refreshToken: `${baseUrl}/auth/refresh-token`,
    loggedUser: `${baseUrl}/logged-user`,
  },
  comments: {},
  notifications: {
    getAll: `${baseUrl}/notifications`,
  },
});
