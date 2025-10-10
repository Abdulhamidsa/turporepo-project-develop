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
    projectAi: `/ai/generate`,
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
  admin: {
    // Authentication
    signin: `/admin/auth/signin`,
    loggedUser: `/admin/auth/user`,
    signout: `/admin/auth/signout`,

    // User Management
    users: `/admin/users`,
    deleteUser: (mongoRef: string) => `/admin/user/${mongoRef}`,
    deactivateUser: (mongoRef: string) => `/admin/user/${mongoRef}/deactivate`,
    reactivateUser: (mongoRef: string) => `/admin/user/${mongoRef}/reactivate`,
    bulkUserAction: `/admin/users/bulk`,

    // Content Management
    content: `/admin/content`,
    deletePost: (postId: string) => `/admin/post/${postId}`,
    deleteProject: (projectId: string) => `/admin/project/${projectId}`,
    deleteComment: (postId: string, commentId: string) =>
      `/admin/post/${postId}/comment/${commentId}`,
    bulkDelete: `/admin/content/bulk`,

    // Analytics & Monitoring
    analytics: `/admin/analytics`,
    auditLogs: `/admin/audit-logs`,

    // Role Management
    assignRole: `/admin/role/assign`,
  },
  comments: {},
  notifications: {
    getAll: `/notifications`,
  },
});
