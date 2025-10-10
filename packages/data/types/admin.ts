// Admin system types
export type AdminUser = {
  id: string;
  email: string;
  username: string;
  role: 'super_admin' | 'admin' | 'moderator';
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
};

export type AdminAction = {
  id: string;
  adminId: string;
  action:
    | 'delete_user'
    | 'delete_post'
    | 'delete_comment'
    | 'delete_project'
    | 'deactivate_user'
    | 'reactivate_user';
  targetId: string;
  targetType: 'user' | 'post' | 'comment' | 'project';
  details?: string;
  timestamp: string;
  ip?: string;
  userAgent?: string;
};

export type AdminStats = {
  users: {
    total: number;
    active: number;
    inactive: number;
    recentlyRegistered: number;
  };
  content: {
    totalProjects: number;
    totalPosts: number;
    totalComments: number;
    recentProjects: number;
    recentPosts: number;
  };
  activity: {
    period: string;
    newUsers: number;
    newProjects: number;
    newPosts: number;
  };
};

export type AdminUserListItem = {
  id: string;
  mongoRef: string;
  email: string;
  username: string;
  role: string;
  isActive: boolean;
  profilePicture?: string;
  profession?: string;
  countryOrigin?: string;
  createdAt: string;
  lastLogin?: string;
  projectCount?: number;
  postCount?: number;
};

export type AdminLoginData = {
  email: string;
  password: string;
};

export type AdminDeleteUserPayload = {
  mongoRef: string;
  reason?: string;
};

export type AdminDeleteContentPayload = {
  contentId: string;
  reason?: string;
};

// Admin permission levels
export const ADMIN_PERMISSIONS = {
  super_admin: [
    'delete_user',
    'delete_post',
    'delete_comment',
    'delete_project',
    'view_analytics',
    'manage_admins',
    'view_audit_logs',
  ],
  admin: ['delete_post', 'delete_comment', 'delete_project', 'view_analytics', 'deactivate_user'],
  moderator: ['delete_post', 'delete_comment', 'view_analytics'],
} as const;

export type AdminPermission = (typeof ADMIN_PERMISSIONS)[keyof typeof ADMIN_PERMISSIONS][number];
