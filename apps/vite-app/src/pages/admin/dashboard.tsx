import { useEffect, useMemo, useState } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@repo/ui/components/ui/avatar';
import { Badge } from '@repo/ui/components/ui/badge';
import { Button } from '@repo/ui/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@repo/ui/components/ui/dialog';
import { Input } from '@repo/ui/components/ui/input';
import { Textarea } from '@repo/ui/components/ui/textarea';
import { showToast } from '@repo/ui/components/ui/toaster';
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Eye,
  FileText,
  LogOut,
  Search,
  Settings,
  Shield,
  Trash2,
  Users,
} from 'lucide-react';

import { request } from '../../../api/request';
import { getCountryFlagIcon } from '../../../utils/generateCountryFlag';
import AdminContentManager from '../../components/admin/AdminContentManager';
import { useAdminUsers } from '../../hooks/useAdminUsers';

// Admin user type that matches our data structure
type AdminDashboardUser = {
  id: string;
  mongoRef: string;
  email: string;
  username: string;
  profilePicture?: string | null;
  profession?: string | null;
  countryOrigin?: string | null;
  createdAt: string;
  isActive: boolean;
  projectCount: number;
  postCount: number;
};

// Mock admin stats
type AdminStats = {
  totalUsers: number;
  activeUsers: number;
  totalProjects: number;
  totalPosts: number;
  newUsersToday: number;
  newProjectsToday: number;
};

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'content'>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    user?: AdminDashboardUser;
    reason: string;
  }>({
    isOpen: false,
    reason: '',
  });

  // Use admin-specific hook that doesn't revalidate constantly
  const { users: fetchedUsers, pagination, isLoading: isUserLoading } = useAdminUsers(1, 100);

  // Track user counts for projects/posts
  const [userCounts, setUserCounts] = useState<Record<string, { projects: number; posts: number }>>(
    {},
  );

  // Fetch user counts for projects and posts
  useEffect(() => {
    if (!fetchedUsers || fetchedUsers.length === 0) return;

    const fetchUserCounts = async () => {
      const counts: Record<string, { projects: number; posts: number }> = {};

      // Fetch counts for each user (in batches to avoid overwhelming the API)
      for (const user of fetchedUsers.slice(0, 20)) {
        // Limit to first 20 users for performance
        try {
          // Fetch user projects count
          const projects = await request(
            'GET',
            `${import.meta.env.VITE_BASE_URL}/projects/user/${user.friendlyId}`,
          );
          const projectsCount = Array.isArray(projects) ? projects.length : 0;

          // Fetch user posts count
          const posts = await request(
            'GET',
            `${import.meta.env.VITE_BASE_URL}/user/${user.friendlyId}/posts`,
          );
          const postsCount = Array.isArray(posts) ? posts.length : 0;

          counts[user.friendlyId] = {
            projects: projectsCount,
            posts: postsCount,
          };
        } catch (error) {
          console.warn(`Failed to fetch counts for user ${user.username}:`, error);
          counts[user.friendlyId] = { projects: 0, posts: 0 };
        }
      }

      setUserCounts(counts);
    };

    fetchUserCounts();
  }, [fetchedUsers]);

  // Process the user data to match AdminDashboardUser interface
  const users: AdminDashboardUser[] = useMemo(() => {
    if (!fetchedUsers) return [];

    return fetchedUsers.map((user) => ({
      id: user.id,
      mongoRef: user.friendlyId || user.id,
      email: `${user.username}@profolio.com`, // Real users don't expose email in API
      username: user.username,
      profession: user.profession || 'Not specified',
      countryOrigin: null, // Real API doesn't include country data
      profilePicture: user.profilePicture,
      createdAt: user.createdAt,
      isActive: user.completedProfile,
      projectCount: userCounts[user.friendlyId]?.projects || 0,
      postCount: userCounts[user.friendlyId]?.posts || 0,
    }));
  }, [fetchedUsers, userCounts]);

  // Calculate real stats from user data
  const stats: AdminStats = useMemo(() => {
    const totalUsers = pagination?.total || users.length;
    const activeUsers = users.filter((user) => user.isActive).length;

    // Calculate users created today
    const today = new Date();
    const newUsersToday = users.filter((user) => {
      const createdDate = new Date(user.createdAt);
      return createdDate.toDateString() === today.toDateString();
    }).length;

    return {
      totalUsers,
      activeUsers,
      totalProjects: 0, // Would need project API
      totalPosts: 0, // Would need posts API
      newUsersToday,
      newProjectsToday: 0, // Would need project API
    };
  }, [users, pagination]);

  const isLoading = isUserLoading;

  // Client-side filtering for real-time search
  const filteredUsers = users.filter((user) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      user.username.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.profession?.toLowerCase().includes(query)
    );
  });

  const handleDeleteUser = async (user: AdminDashboardUser, reason: string) => {
    try {
      console.log('Admin Action: Deleting user:', user.mongoRef, 'Reason:', reason);

      // Make the actual DELETE request to the backend
      const response = await fetch(`http://localhost:4000/api/admin/user/${user.mongoRef}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include HTTP-only cookies for authentication
        body: JSON.stringify({ reason }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(errorData.message || `Failed to delete user: ${response.status}`);
      }

      const result = await response.json();
      console.log('User deleted successfully:', result);

      setDeleteDialog({ isOpen: false, reason: '' });
      showToast(`User ${user.username} has been deleted successfully`, 'success');

      // Log admin action for audit trail
      console.log('Admin Action Log:', {
        action: 'delete_user',
        targetUser: user.mongoRef,
        targetUsername: user.username,
        targetEmail: user.email,
        reason,
        timestamp: new Date().toISOString(),
        adminUser: JSON.parse(localStorage.getItem('admin_user') || '{}').email,
        result,
      });

      // Refresh the user list after deletion - trigger SWR revalidation
    } catch (error) {
      console.error('Delete user error:', error);
      showToast(error instanceof Error ? error.message : 'Failed to delete user', 'error');
    }
  };

  const handleSignOut = () => {
    // Clear admin authentication
    localStorage.removeItem('admin_authenticated');
    localStorage.removeItem('admin_user');

    showToast('Signed out successfully', 'success');
    window.location.href = '/admin/signin';
  };

  const openDeleteDialog = (user: AdminDashboardUser) => {
    setDeleteDialog({
      isOpen: true,
      user,
      reason: '',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Shield className="w-6 h-6 text-red-600" />
              <h1 className="text-xl font-bold">Admin Dashboard</h1>
            </div>

            <div className="flex items-center space-x-4">
              <Badge variant="destructive" className="hidden sm:flex">
                Super Admin
              </Badge>
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-8 bg-muted p-1 rounded-lg w-fit">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'dashboard'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <BarChart3 className="w-4 h-4 inline mr-2" />
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'users'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Users className="w-4 h-4 inline mr-2" />
            Users
          </button>
          <button
            onClick={() => setActiveTab('content')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'content'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <FileText className="w-4 h-4 inline mr-2" />
            Content
          </button>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                      <p className="text-2xl font-bold">{stats.totalUsers}</p>
                    </div>
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">+{stats.newUsersToday} today</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                      <p className="text-2xl font-bold">{stats.activeUsers}</p>
                    </div>
                    <Activity className="h-8 w-8 text-green-600" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {Math.round((stats.activeUsers / stats.totalUsers) * 100)}% active
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Projects</p>
                      <p className="text-2xl font-bold">{stats.totalProjects}</p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-purple-600" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    +{stats.newProjectsToday} today
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Posts</p>
                      <p className="text-2xl font-bold">{stats.totalPosts}</p>
                    </div>
                    <FileText className="h-8 w-8 text-orange-600" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Content moderation active</p>
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    User Management
                  </CardTitle>
                  <CardDescription>
                    Manage user accounts, view activity, and moderate content
                  </CardDescription>
                </div>

                {/* Search */}
                <div className="relative w-full sm:w-80">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="space-y-4">
                {filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    {/* User Info */}
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.profilePicture || undefined} alt={user.username} />
                        <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium truncate">{user.username}</p>
                          {user.countryOrigin && (
                            <img
                              src={`https://flagcdn.com/w20/${getCountryFlagIcon(user.countryOrigin)}.png`}
                              alt={user.countryOrigin}
                              className="h-3 w-4 rounded-sm"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
                            />
                          )}
                          <Badge variant={user.isActive ? 'default' : 'secondary'}>
                            {user.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                        <p className="text-xs text-muted-foreground">
                          {user.profession} • Joined {new Date(user.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="text-center">
                        <p className="font-medium text-foreground">{user.projectCount}</p>
                        <p className="text-xs">Projects</p>
                      </div>
                      <div className="text-center">
                        <p className="font-medium text-foreground">{user.postCount}</p>
                        <p className="text-xs">Posts</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(`/admin/user/${user.mongoRef}`)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openDeleteDialog(user)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Content Tab */}
        {activeTab === 'content' && <AdminContentManager />}
      </div>

      {/* Delete User Dialog */}
      <Dialog
        open={deleteDialog.isOpen}
        onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, isOpen: open })}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-5 h-5" />
              Delete User Account
            </DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the user account and all
              associated data.
            </DialogDescription>
          </DialogHeader>

          {deleteDialog.user && (
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <p className="font-medium">{deleteDialog.user.username}</p>
                <p className="text-sm text-muted-foreground">{deleteDialog.user.email}</p>
                <p className="text-sm text-muted-foreground">
                  {deleteDialog.user.projectCount} projects, {deleteDialog.user.postCount} posts
                </p>
              </div>

              <div>
                <label htmlFor="reason" className="text-sm font-medium">
                  Reason for deletion (optional)
                </label>
                <Textarea
                  id="reason"
                  placeholder="Spam, inappropriate content, terms violation, etc."
                  value={deleteDialog.reason}
                  onChange={(e) => setDeleteDialog({ ...deleteDialog, reason: e.target.value })}
                  className="mt-1"
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialog({ isOpen: false, reason: '' })}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                deleteDialog.user && handleDeleteUser(deleteDialog.user, deleteDialog.reason)
              }
            >
              Delete User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
