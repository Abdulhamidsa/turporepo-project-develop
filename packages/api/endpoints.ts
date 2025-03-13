export const getEndpoints = (baseUrl: string) => ({
  posts: {
    fetch: `/posts`,
    like: `/post/like`,
    addComment: `/post/comment`,
    post: `/post`,
    deleteComment: (postId: string, commentId: string) => `/post/comment/${postId}/${commentId}`,
    fetchUserPosts: (friendlyId: string) => `/user/${friendlyId}/posts`,
    deletePost: (postId: string) => `/post/${postId}`,
  },
  users: {
    updateProfile: `/user/update`,
    fetchProfile: `/profile/:friendlyId`,
    fetchUserPublicProfile: (friendlyId: string) => `/user/${friendlyId}`,
    fetchAll: `/users`,
  },
  profile: {
    fetch: `/profile`,
    update: `/profile`,
  },
  projects: {
    fetchByFriendlyId: (friendlyId: string) => `/projects/user/${friendlyId}`,
    fetchUserProjects: `/projects/user`,
    delete: `/project`,
    create: `/project`,
    fetchAll: `/projects`,
    projectAi: `api/ai/generate`,
  },
  auth: {
    signin: `/auth/signin`,
    signup: `/auth/signup`,
    credentials: `/credentials`,
    signout: `/signout`,
    refreshToken: `/auth/refresh-token`,
    loggedUser: `/logged-user`,
    delete: `/user`,
  },
  comments: {},
  notifications: {
    getAll: `/notifications`,
  },
});
