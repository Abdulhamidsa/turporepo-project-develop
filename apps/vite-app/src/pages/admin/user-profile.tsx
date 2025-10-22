import { useEffect, useState } from 'react';

import { getEndpoints } from '@repo/api/endpoints';
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
import { Textarea } from '@repo/ui/components/ui/textarea';
import { showToast } from '@repo/ui/components/ui/toaster';
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  Briefcase,
  Calendar,
  ExternalLink,
  Eye,
  FileText,
  Globe,
  MessageSquare,
  RefreshCw,
  Shield,
  Trash2,
  User,
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

import { request } from '../../../api/request';

const ENDPOINTS = getEndpoints(import.meta.env.VITE_BASE_URL);

// Types for real user data
type AdminUserProfile = {
  id: string;
  username: string;
  friendlyId: string;
  profession?: string;
  profilePicture?: string;
  createdAt: string;
  updatedAt: string;
  completedProfile: boolean;
};

type UserPost = {
  id: string;
  title?: string;
  content: string;
  createdAt: string;
  likesCount: number;
  commentsCount: number;
};

type UserProject = {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  technologies?: string[];
  status: 'active' | 'completed' | 'archived';
};

type UserComment = {
  id: string;
  content: string;
  createdAt: string;
  postId: string;
  postTitle?: string;
  likesCount?: number;
  userId?: {
    _id?: string;
    id?: string;
    friendlyId?: string;
    username?: string;
  };
};

export default function AdminUserProfile() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();

  const [user, setUser] = useState<AdminUserProfile | null>(null);
  const [posts, setPosts] = useState<UserPost[]>([]);
  const [projects, setProjects] = useState<UserProject[]>([]);
  const [comments, setComments] = useState<UserComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    type: 'user' | 'post' | 'project' | 'comment';
    item?: UserPost | UserProject | UserComment | undefined;
    reason: string;
  }>({
    isOpen: false,
    type: 'user',
    reason: '',
  });

  // Fetch user profile
  const fetchUserData = async (showRefreshIndicator = false) => {
    try {
      if (showRefreshIndicator) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      // Fetch user profile
      const userProfile = await request<AdminUserProfile>(
        'GET',
        userId ? ENDPOINTS.users.fetchUserPublicProfile(userId) : '',
      );
      setUser(userProfile);

      // Fetch user posts
      try {
        const userPosts = userId
          ? await request<UserPost[]>('GET', ENDPOINTS.posts.fetchUserPosts(userId))
          : [];
        setPosts(Array.isArray(userPosts) ? userPosts : []);
      } catch (postsError) {
        console.warn('Could not fetch user posts:', postsError);
        setPosts([]);
      }

      // Fetch user projects using admin projects endpoint and filter
      try {
        console.log(`🔍 Fetching projects for user: ${userId}`);
        const response = await fetch(`http://localhost:4000/api/admin/projects`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        console.log(`📡 Projects API Response Status: ${response.status}`);

        if (response.ok) {
          const result = await response.json();
          console.log('🎯 FULL Projects API Response:', JSON.stringify(result, null, 2));

          // Handle nested data structure: result.data.projects or result.projects
          const allProjects = result.data?.projects || result.projects || [];
          console.log('📝 Extracted projects array:', allProjects);
          console.log('👤 Current user profile:', userProfile);

          // Filter projects for current user since we're using the general admin endpoint
          const filteredProjects = allProjects.filter(
            (project: {
              userId?: { _id?: string; id?: string; friendlyId?: string; username?: string };
            }) => {
              const projectUserId = project.userId?._id || project.userId?.id || project.userId;
              const targetUserId = userProfile?.id;
              console.log(`🔍 Comparing project user ${projectUserId} with target ${targetUserId}`);
              return (
                projectUserId === targetUserId ||
                project.userId?.friendlyId === userId ||
                project.userId?.username === userProfile?.username
              );
            },
          );

          console.log(
            `📊 Filtered ${filteredProjects.length} projects from ${allProjects.length} total`,
          );

          let userProjects = filteredProjects.map(
            (project: {
              _id?: string;
              id?: string;
              title?: string;
              description?: string;
              createdAt: string;
            }) => ({
              id: project._id || project.id,
              title: project.title || 'Untitled Project',
              description: project.description || '',
              createdAt: project.createdAt,
            }),
          );

          // If no projects from API, show a sample for testing
          if (userProjects.length === 0) {
            console.log('No projects from API, showing sample data for testing');
            userProjects = [
              {
                id: 'sample_project_1',
                title: 'Sample Project (API returned empty)',
                description: 'This is a sample project because the API returned no data',
                createdAt: new Date().toISOString(),
              },
            ];
          }

          console.log('✅ Final projects to display:', userProjects);
          setProjects(userProjects);
        } else {
          const errorText = await response.text().catch(() => 'Could not read error response');
          console.error(`❌ Projects API Error ${response.status}:`, errorText);
          setProjects([]);
        }
      } catch (projectsError) {
        console.warn('Could not fetch user projects:', projectsError);
        setProjects([]);
      }

      // Fetch user comments using admin posts endpoint and extract user comments
      try {
        console.log(`🔍 Fetching comments for user: ${userId}`);

        // Initialize userComments array at the correct scope
        const userComments: UserComment[] = [];

        const response = await fetch(`http://localhost:4000/api/admin/posts`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        console.log(`📡 Comments API Response Status: ${response.status}`);

        if (response.ok) {
          const result = await response.json();
          console.log('🎯 FULL Posts API Response:', JSON.stringify(result, null, 2));

          // Extract posts and then comments from posts
          const allPosts = result.data?.posts || result.posts || [];
          console.log('📝 Extracted posts array:', allPosts.length, 'posts');

          // Extract comments from posts for this user
          allPosts.forEach(
            (
              post: {
                comments?: any[];
                recentComments?: any[];
                _id?: string;
                id?: string;
                content?: string;
              },
              postIndex: number,
            ) => {
              const postComments = post.comments || post.recentComments || [];
              console.log(`� Post ${postIndex + 1}: ${postComments.length} comments`);

              if (postComments && Array.isArray(postComments)) {
                postComments.forEach((comment: UserComment) => {
                  // Check if this comment belongs to the current user
                  const commentUserId = comment.userId?._id || comment.userId?.id || comment.userId;
                  const commentUsername = comment.userId?.username || comment.userId?.username;
                  const targetUserId = userProfile?.id || userProfile?.id;
                  const targetUsername = userProfile?.username;

                  console.log(
                    `🔍 Comment by: ${commentUsername} (${commentUserId}), Target: ${targetUsername} (${targetUserId})`,
                  );

                  if (
                    commentUserId === targetUserId ||
                    commentUsername === targetUsername ||
                    comment.userId?.friendlyId === userId
                  ) {
                    userComments.push({
                      id: comment.id || comment.id || `comment-${Date.now()}-${Math.random()}`,
                      content: comment.content || 'No content',
                      createdAt: comment.createdAt || new Date().toISOString(),
                      postId: post._id || post.id || '',
                      postTitle: post.content?.substring(0, 50) + '...' || 'Untitled Post',
                      likesCount: comment.likesCount || 0,
                    });
                  }
                });
              }
            },
          );

          console.log(`🎯 Found ${userComments.length} comments for user ${userId}`);
          setComments(userComments);
        } else {
          const errorText = await response.text().catch(() => 'Could not read error response');
          console.error(`❌ Comments API Error ${response.status}:`, errorText);

          // Fallback: If user-specific comments endpoint doesn't exist,
          // try the old method with posts endpoint
          console.log('Falling back to posts endpoint for comments...');

          try {
            const postsResponse = await fetch('http://localhost:4000/api/admin/posts', {
              method: 'GET',
              credentials: 'include',
              headers: {
                'Content-Type': 'application/json',
              },
            });

            if (postsResponse.ok) {
              const postsResult = await postsResponse.json();
              const allPosts = postsResult.data?.posts || postsResult.posts || [];
              console.log('Fallback: Processing posts for comments:', allPosts.length);

              // Extract comments from posts (old method)
              allPosts.forEach((post: Record<string, unknown>) => {
                const postComments = post.comments || post.recentComments || [];
                if (postComments && Array.isArray(postComments)) {
                  postComments.forEach((comment: Record<string, unknown>) => {
                    // Check if this comment was made by the current user
                    const isUserComment =
                      comment.author?.username === userProfile?.username ||
                      comment.author === userProfile?.id ||
                      comment.authorId === userProfile?.id;

                    if (isUserComment) {
                      userComments.push({
                        id: comment._id || comment.id || `comment-${Date.now()}-${Math.random()}`,
                        content: comment.content || 'No content',
                        createdAt: comment.createdAt,
                        postId: post._id || post.id || '',
                        postTitle:
                          (post as any).title ||
                          ((post as any).content
                            ? (post as any).content.substring(0, 50) + '...'
                            : 'Untitled Post'),
                        likesCount: comment.likesCount || 0,
                      });
                    }
                  });
                }
              });
              console.log('Fallback: Found', userComments.length, 'comments');
            }
          } catch (fallbackError) {
            console.error('Fallback posts request failed:', fallbackError);
          }
        }

        // If no comments from API, show sample data for testing
        if (userComments.length === 0) {
          console.log('No comments from API, showing sample data for testing');
          userComments.push({
            id: 'sample_comment_1',
            content: 'This is a sample comment (API returned empty)',
            createdAt: new Date().toISOString(),
            postId: 'sample_post_1',
            postTitle: 'Sample Post',
            likesCount: 0,
          });
        }

        console.log('\n=== FINAL COMMENTS SUMMARY ===');
        console.log('Total unique comments found:', userComments.length);
        userComments.forEach((comment, index) => {
          console.log(`Comment ${index + 1}:`, {
            id: comment.id,
            content: comment.content.substring(0, 30) + '...',
            postTitle: comment.postTitle,
            createdAt: comment.createdAt,
          });
        });
        console.log('=================================\n');

        setComments(userComments);
      } catch (commentsError) {
        console.warn('Could not fetch user comments:', commentsError);
        setComments([]);
      }
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError('Failed to load user profile');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (!userId) return;
    fetchUserData();
  }, [userId]);

  // Refresh function to reload all data
  const handleRefresh = () => {
    fetchUserData(true);
  };

  const handleDeleteUser = async (reason: string) => {
    if (!user) return;

    try {
      console.log('Admin Action: Deleting user:', user.friendlyId, 'Reason:', reason);

      // Actually delete the user using the backend API
      const userId = user.id || user.friendlyId;
      const response = await fetch(`http://localhost:4000/api/admin/user/${userId}`, {
        method: 'DELETE',
        credentials: 'include', // Important for cookies
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(errorData.message || `Failed to delete user: ${response.status}`);
      }

      const result = await response.json();
      console.log('User deleted successfully:', result);

      // Log admin action for audit trail
      console.log('Admin Action Success:', {
        action: 'delete_user',
        targetUser: user.friendlyId,
        targetUsername: user.username,
        reason,
        timestamp: new Date().toISOString(),
        adminUser: JSON.parse(localStorage.getItem('admin_user') || '{}').email,
        backendResponse: result.data,
      });

      setDeleteDialog({ isOpen: false, type: 'user', reason: '' });
      showToast(`User ${user.username} has been deleted successfully`, 'success');

      // Redirect after successful deletion
      setTimeout(() => {
        navigate('/admin/dashboard');
      }, 2000);
    } catch (error) {
      console.error('Delete user error:', error);
      showToast(error instanceof Error ? error.message : 'Failed to delete user', 'error');
    }
  };

  const handleDeletePost = async (post: UserPost, reason: string) => {
    try {
      // The post might have _id instead of id from MongoDB
      const postId = post.id || (post as { _id?: string })._id;
      console.log('Admin Action: Deleting post:', postId, 'Reason:', reason);

      if (!postId) {
        throw new Error('Post ID is missing');
      }

      // Actually delete the post using the backend API
      console.log('Making delete request with credentials:', document.cookie);
      const response = await fetch(`http://localhost:4000/api/admin/post/${postId}`, {
        method: 'DELETE',
        credentials: 'include', // Important for cookies
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(errorData.message || `Failed to delete post: ${response.status}`);
      }

      const result = await response.json();
      console.log('Post deleted successfully:', result);

      // Log admin action for audit trail
      console.log('Admin Action Success:', {
        action: 'delete_post',
        targetPost: post.id,
        targetUser: user?.friendlyId,
        reason,
        timestamp: new Date().toISOString(),
        adminUser: JSON.parse(localStorage.getItem('admin_user') || '{}').email,
        backendResponse: result.data,
      });

      setDeleteDialog({ isOpen: false, type: 'post', reason: '' });
      showToast('Post has been deleted successfully', 'success');

      // Create a new array for state update to ensure proper render
      const updatedPosts = [...posts].filter((p) => p.id !== post.id);
      setPosts(updatedPosts);

      // Log the updated state for debugging
      console.log(`Post deleted. Remaining posts: ${updatedPosts.length}`);
    } catch (error) {
      console.error('Delete post error:', error);
      showToast(error instanceof Error ? error.message : 'Failed to delete post', 'error');
    }
  };

  const handleDeleteProject = async (project: UserProject, reason: string) => {
    try {
      // The project might have _id instead of id from MongoDB
      const projectId = project.id || (project as { _id?: string })._id;
      console.log('Admin Action: Deleting project:', projectId, 'Reason:', reason);

      if (!projectId) {
        throw new Error('Project ID is missing');
      }

      // Actually delete the project using the backend API
      const response = await fetch(`http://localhost:4000/api/admin/project/${projectId}`, {
        method: 'DELETE',
        credentials: 'include', // Important for cookies
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(errorData.message || `Failed to delete project: ${response.status}`);
      }

      const result = await response.json();
      console.log('Project deleted successfully:', result);

      // Log admin action for audit trail
      console.log('Admin Action Success:', {
        action: 'delete_project',
        targetProject: project.id,
        targetUser: user?.friendlyId,
        reason,
        timestamp: new Date().toISOString(),
        adminUser: JSON.parse(localStorage.getItem('admin_user') || '{}').email,
        backendResponse: result.data,
      });

      setDeleteDialog({ isOpen: false, type: 'project', reason: '' });
      showToast('Project has been deleted successfully', 'success');

      // Remove from local state
      setProjects(projects.filter((p) => p.id !== project.id));
    } catch (error) {
      console.error('Delete project error:', error);
      showToast(error instanceof Error ? error.message : 'Failed to delete project', 'error');
    }
  };

  const handleDeleteComment = async (comment: UserComment, reason: string) => {
    try {
      // The comment might have _id instead of id from MongoDB
      const commentId = comment.id || (comment as { _id?: string })._id;
      const postId = comment.postId || (comment as { post?: string }).post;
      console.log(
        'Admin Action: Deleting comment:',
        commentId,
        'from post:',
        postId,
        'Reason:',
        reason,
      );

      if (!commentId || !postId) {
        throw new Error('Comment ID or Post ID is missing');
      }

      // Actually delete the comment using the backend API
      const response = await fetch(
        `http://localhost:4000/api/admin/post/${postId}/comment/${commentId}`,
        {
          method: 'DELETE',
          credentials: 'include', // Important for cookies
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ reason }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(errorData.message || `Failed to delete comment: ${response.status}`);
      }

      const result = await response.json();
      console.log('Comment deleted successfully:', result);

      // Log admin action for audit trail
      console.log('Admin Action Success:', {
        action: 'delete_comment',
        targetComment: comment.id,
        targetPost: comment.postId,
        targetUser: user?.friendlyId,
        reason,
        timestamp: new Date().toISOString(),
        adminUser: JSON.parse(localStorage.getItem('admin_user') || '{}').email,
        backendResponse: result.data,
      });

      setDeleteDialog({ isOpen: false, type: 'comment', reason: '' });
      showToast('Comment has been deleted successfully', 'success');

      // Remove from local state
      setComments(comments.filter((c) => c.id !== comment.id));
    } catch (error) {
      console.error('Delete comment error:', error);
      showToast(error instanceof Error ? error.message : 'Failed to delete comment', 'error');
    }
  };

  const openDeleteDialog = (
    type: 'user' | 'post' | 'project' | 'comment',
    item?: UserPost | UserProject | UserComment,
  ) => {
    setDeleteDialog({
      isOpen: true,
      type,
      item: item || undefined,
      reason: '',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading user profile...</p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Failed to Load User</h2>
          <p className="text-muted-foreground mb-4">{error || 'User not found'}</p>
          <Button onClick={() => navigate('/admin/dashboard')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => navigate('/admin/dashboard')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <Shield className="w-6 h-6 text-red-600" />
              <h1 className="text-xl font-bold">Admin User Profile</h1>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                {refreshing ? 'Refreshing...' : 'Refresh'}
              </Button>

              <Button variant="destructive" onClick={() => openDeleteDialog('user')}>
                <Trash2 className="w-4 h-4 mr-2" />
                Delete User
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User Profile Card */}
        <Card className="mb-8 dark:bg-[#3f3f3f] dark:border-gray-800">
          <CardHeader>
            <div className="flex items-center space-x-6">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user.profilePicture || undefined} alt={user.username} />
                <AvatarFallback className="text-lg">
                  {user.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold">{user.username}</h2>
                  <Badge variant={user.completedProfile ? 'default' : 'secondary'}>
                    {user.completedProfile ? 'Active' : 'Incomplete Profile'}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    ID: {user.friendlyId}
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    {user.profession || 'No profession specified'}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Joined: {new Date(user.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4" />
                    Last updated: {new Date(user.updatedAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Button
                  variant="outline"
                  onClick={() => window.open(`/profile/${user.friendlyId}`, '_blank')}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Public Profile
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.open(`/profile/${user.friendlyId}`, '_blank')}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open in New Tab
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 lg:grid-cols-2 gap-8">
          {/* User Posts */}
          <Card className="dark:border-gray-800 dark:bg-gray-900/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-cyan-500 dark:text-cyan-400" />
                  Posts
                  <Badge
                    variant="secondary"
                    className="ml-2 bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-400"
                  >
                    {posts.length}
                  </Badge>
                </CardTitle>
              </div>
              <CardDescription>All posts created by this user</CardDescription>
            </CardHeader>

            <CardContent>
              <div className="space-y-5">
                {posts.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                    <p className="text-muted-foreground">No posts found</p>
                    <p className="text-sm text-muted-foreground/70 mt-1">
                      This user hasn't created any posts yet
                    </p>
                  </div>
                ) : (
                  posts.map((post, index) => (
                    <div
                      key={post.id || index}
                      className="group relative bg-gradient-to-r from-slate-100/50 to-cyan-50/30 dark:from-gray-900/90 dark:to-gray-800/80 
                                border border-slate-200/60 dark:border-gray-700/50 rounded-xl p-4 
                                hover:shadow-md hover:border-cyan-200 dark:hover:border-cyan-800/50 
                                transition-all duration-200"
                    >
                      {/* Post Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-cyan-100 dark:bg-cyan-900/40 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-cyan-600 dark:text-cyan-400">
                              #{index + 1}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <Badge
                                variant="outline"
                                className="text-xs px-2 py-0.5 bg-white/60 dark:bg-gray-800/60"
                              >
                                � Post
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {new Date(post.createdAt).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                })}
                              </span>
                            </div>
                          </div>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openDeleteDialog('post', post)}
                          className="opacity-0 group-hover:opacity-100 text-red-500 dark:text-red-400 
                                    hover:text-red-700 dark:hover:text-red-300 
                                    hover:bg-red-50 dark:hover:bg-red-900/30 
                                    transition-all duration-200"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* Post Content */}
                      <div className="mb-3">
                        <div
                          className="bg-white/80 dark:bg-gray-800/50 border border-slate-200/60 dark:border-gray-700/40 
                                      rounded-lg p-3 dark:text-gray-200"
                        >
                          {post.title && (
                            <h4 className="font-medium mb-2 dark:text-gray-100">{post.title}</h4>
                          )}
                          <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300 line-clamp-2">
                            {post.content}
                          </p>
                        </div>
                      </div>

                      {/* Post Stats */}
                      <div className="flex flex-wrap items-center gap-3 mt-3">
                        <Badge
                          variant="outline"
                          className="bg-white/70 dark:bg-gray-800/70 flex items-center gap-1"
                        >
                          <span className="text-blue-600 dark:text-blue-400">💙</span>
                          <span className="text-xs">{post.likesCount || 0} likes</span>
                        </Badge>

                        <Badge
                          variant="outline"
                          className="bg-white/70 dark:bg-gray-800/70 flex items-center gap-1"
                        >
                          <span className="text-gray-600 dark:text-gray-400">💬</span>
                          <span className="text-xs">{post.commentsCount || 0} comments</span>
                        </Badge>

                        {/* {post.image && (
                          <Badge
                            variant="outline"
                            className="bg-white/70 dark:bg-gray-800/70 flex items-center gap-1"
                          >
                            <span className="text-gray-600 dark:text-gray-400">🖼️</span>
                            <span className="text-xs">Has image</span>
                          </Badge>
                        )} */}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* User Projects */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Projects ({projects.length})
                </CardTitle>
              </div>
              <CardDescription>All projects created by this user</CardDescription>
            </CardHeader>

            <CardContent>
              <div className="space-y-4">
                {projects.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No projects found</p>
                ) : (
                  projects.map((project) => (
                    <div
                      key={project.id}
                      className="flex justify-between items-start p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate mb-1">{project.title}</h4>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                          {project.description}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                          <Badge variant="outline" className="text-xs">
                            {project.status}
                          </Badge>
                          <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                        </div>
                        {project.technologies && (
                          <div className="flex flex-wrap gap-1">
                            {project.technologies.slice(0, 3).map((tech, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {tech}
                              </Badge>
                            ))}
                            {project.technologies.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{project.technologies.length - 3} more
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openDeleteDialog('project', project)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* User Comments */}
          <Card className="dark:border-gray-800 dark:bg-gray-900/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-purple-500 dark:text-purple-400" />
                  Comments
                  <Badge
                    variant="secondary"
                    className="ml-2 bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400"
                  >
                    {comments.length}
                  </Badge>
                </CardTitle>
              </div>
              <CardDescription>
                All comments and interactions by this user across posts
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="space-y-5">
                {comments.length === 0 ? (
                  <div className="text-center py-12">
                    <MessageSquare className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                    <p className="text-muted-foreground">No comments found</p>
                    <p className="text-sm text-muted-foreground/70 mt-1">
                      This user hasn't commented on any posts yet
                    </p>
                  </div>
                ) : (
                  comments.map((comment, index) => (
                    <div
                      key={comment.id}
                      className="group relative bg-gradient-to-r from-slate-50/50 to-blue-50/30 border border-slate-200/60 rounded-xl p-4 hover:shadow-md hover:border-blue-200 transition-all duration-200"
                    >
                      {/* Comment Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-600">#{index + 1}</span>
                          </div>
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs px-2 py-0.5 bg-white">
                                � Comment
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {new Date(comment.createdAt).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            </div>
                          </div>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openDeleteDialog('comment', comment)}
                          className="opacity-0 group-hover:opacity-100 text-red-500 dark:text-red-400 
                                    hover:text-red-700 dark:hover:text-red-300 
                                    hover:bg-red-50 dark:hover:bg-red-900/30 
                                    transition-all duration-200"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* Comment Content */}
                      <div className="mb-4">
                        <div
                          className="bg-white/80 dark:bg-gray-800/50 border border-slate-200/60 dark:border-gray-700/40 
                                      rounded-lg p-3 dark:text-gray-200"
                        >
                          <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                            "{comment.content}"
                          </p>
                        </div>
                      </div>

                      {/* Post Context */}
                      <div
                        className="bg-gradient-to-r from-slate-100/80 to-slate-50 dark:from-gray-800/50 dark:to-gray-700/50 
                                    border border-slate-200/50 dark:border-gray-600/50 rounded-lg p-3"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-slate-200 dark:bg-gray-600 rounded-md flex items-center justify-center shrink-0 mt-0.5">
                            <FileText className="w-3 h-3 text-slate-600 dark:text-gray-300" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs text-slate-500 dark:text-gray-400 font-medium mb-1">
                              Commented on post:
                            </p>
                            <p className="text-sm text-slate-700 dark:text-gray-300 line-clamp-2 leading-relaxed">
                              {comment.postTitle}
                            </p>
                            {comment.postId && (
                              <div className="flex items-center gap-2 mt-2">
                                <Badge
                                  variant="outline"
                                  className="text-xs px-2 py-0.5 bg-white/60 dark:bg-gray-700/60"
                                >
                                  ID: {comment.postId.slice(-8)}
                                </Badge>
                                {comment.likesCount !== undefined && (
                                  <Badge
                                    variant="outline"
                                    className="text-xs px-2 py-0.5 bg-white/60 dark:bg-gray-700/60"
                                  >
                                    💙 {comment.likesCount} likes
                                  </Badge>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.isOpen}
        onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, isOpen: open })}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-5 h-5" />
              Delete{' '}
              {deleteDialog.type === 'user'
                ? 'User Account'
                : deleteDialog.type === 'post'
                  ? 'Post'
                  : deleteDialog.type === 'project'
                    ? 'Project'
                    : 'Comment'}
            </DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the {deleteDialog.type}.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {deleteDialog.type === 'user' && user && (
              <div className="p-4 bg-muted rounded-lg">
                <p className="font-medium">{user.username}</p>
                <p className="text-sm text-muted-foreground">{user.friendlyId}</p>
                <p className="text-sm text-muted-foreground">
                  {projects.length} projects, {posts.length} posts
                </p>
              </div>
            )}

            {deleteDialog.type === 'post' &&
              deleteDialog.item &&
              'content' in deleteDialog.item && (
                <div className="p-4 bg-muted rounded-lg">
                  <p className="font-medium line-clamp-1">
                    {(deleteDialog.item as UserPost).title || 'Untitled Post'}
                  </p>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {(deleteDialog.item as UserPost).content}
                  </p>
                </div>
              )}

            {deleteDialog.type === 'project' &&
              deleteDialog.item &&
              'description' in deleteDialog.item && (
                <div className="p-4 bg-muted rounded-lg">
                  <p className="font-medium">{(deleteDialog.item as UserProject).title}</p>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {(deleteDialog.item as UserProject).description}
                  </p>
                </div>
              )}

            {deleteDialog.type === 'comment' &&
              deleteDialog.item &&
              'postId' in deleteDialog.item && (
                <div className="p-4 bg-muted rounded-lg">
                  <p className="font-medium line-clamp-2">
                    {(deleteDialog.item as UserComment).content}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    On: {(deleteDialog.item as UserComment).postTitle}
                  </p>
                </div>
              )}

            <div>
              <label htmlFor="reason" className="text-sm font-medium">
                Reason for deletion (optional)
              </label>
              <Textarea
                id="reason"
                placeholder={`Why are you deleting this ${deleteDialog.type}?`}
                value={deleteDialog.reason}
                onChange={(e) => setDeleteDialog({ ...deleteDialog, reason: e.target.value })}
                className="mt-1"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialog({ ...deleteDialog, isOpen: false })}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (deleteDialog.type === 'user') {
                  handleDeleteUser(deleteDialog.reason);
                } else if (
                  deleteDialog.type === 'post' &&
                  deleteDialog.item &&
                  'content' in deleteDialog.item
                ) {
                  handleDeletePost(deleteDialog.item as UserPost, deleteDialog.reason);
                } else if (
                  deleteDialog.type === 'project' &&
                  deleteDialog.item &&
                  'description' in deleteDialog.item
                ) {
                  handleDeleteProject(deleteDialog.item as UserProject, deleteDialog.reason);
                } else if (
                  deleteDialog.type === 'comment' &&
                  deleteDialog.item &&
                  'postId' in deleteDialog.item
                ) {
                  handleDeleteComment(deleteDialog.item as UserComment, deleteDialog.reason);
                }
              }}
            >
              Delete {deleteDialog.type}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
