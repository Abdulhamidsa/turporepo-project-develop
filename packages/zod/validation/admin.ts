import { z } from 'zod';

// Admin authentication schemas
export const adminLoginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

// Admin user management schemas
export const adminDeleteUserSchema = z.object({
  mongoRef: z.string().min(1, 'User ID is required'),
  reason: z.string().optional(),
});

export const adminDeleteContentSchema = z.object({
  contentId: z.string().min(1, 'Content ID is required'),
  reason: z.string().optional(),
});

// Admin analytics query schema
export const adminAnalyticsQuerySchema = z.object({
  period: z.enum(['7d', '30d', '90d', '1y']).optional().default('30d'),
});

// Admin user list query schema
export const adminUserListQuerySchema = z.object({
  page: z.coerce.number().min(1).optional().default(1),
  limit: z.coerce.number().min(1).max(100).optional().default(20),
  search: z.string().optional(),
  role: z.enum(['super_admin', 'admin', 'moderator', 'user']).optional(),
  status: z.enum(['active', 'inactive']).optional(),
  sortBy: z.enum(['createdAt', 'username', 'email', 'lastLogin']).optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

// Admin action log schema
export const adminActionSchema = z.object({
  action: z.enum([
    'delete_user',
    'delete_post',
    'delete_comment',
    'delete_project',
    'deactivate_user',
    'reactivate_user',
  ]),
  targetId: z.string(),
  targetType: z.enum(['user', 'post', 'comment', 'project']),
  details: z.string().optional(),
});

// Bulk operation schemas
export const adminBulkDeleteSchema = z.object({
  contentIds: z.array(z.string()).min(1, 'At least one item must be selected'),
  contentType: z.enum(['post', 'comment', 'project']),
  reason: z.string().optional(),
});

export const adminBulkUserActionSchema = z.object({
  userIds: z.array(z.string()).min(1, 'At least one user must be selected'),
  action: z.enum(['deactivate', 'reactivate', 'delete']),
  reason: z.string().optional(),
});

// Admin role assignment schema
export const adminRoleAssignmentSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  role: z.enum(['super_admin', 'admin', 'moderator', 'user']),
});

// Content filtering schemas
export const adminContentFilterSchema = z.object({
  page: z.coerce.number().min(1).optional().default(1),
  limit: z.coerce.number().min(1).max(100).optional().default(20),
  search: z.string().optional(),
  type: z.enum(['post', 'project', 'comment']).optional(),
  userId: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  sortBy: z.enum(['createdAt', 'updatedAt', 'title']).optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

export type AdminLoginData = z.infer<typeof adminLoginSchema>;
export type AdminDeleteUserData = z.infer<typeof adminDeleteUserSchema>;
export type AdminDeleteContentData = z.infer<typeof adminDeleteContentSchema>;
export type AdminAnalyticsQuery = z.infer<typeof adminAnalyticsQuerySchema>;
export type AdminUserListQuery = z.infer<typeof adminUserListQuerySchema>;
export type AdminActionData = z.infer<typeof adminActionSchema>;
export type AdminBulkDeleteData = z.infer<typeof adminBulkDeleteSchema>;
export type AdminBulkUserActionData = z.infer<typeof adminBulkUserActionSchema>;
export type AdminRoleAssignmentData = z.infer<typeof adminRoleAssignmentSchema>;
export type AdminContentFilterData = z.infer<typeof adminContentFilterSchema>;
