import { useEffect, useState } from 'react';

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/ui/components/ui/select';
import { Textarea } from '@repo/ui/components/ui/textarea';
import { showToast } from '@repo/ui/components/ui/toaster';
import { AlertTriangle, Calendar, Eye, FileText, Search, Trash2, User } from 'lucide-react';
import useSWR from 'swr';

// Content types for admin management
type ContentItem = {
  id: string;
  type: 'post' | 'project';
  title: string;
  content: string;
  authorUsername: string;
  authorId: string;
  createdAt: string;
  status: 'active' | 'flagged' | 'reported';
  reportCount?: number;
  // Additional fields from API
  author?: {
    username: string;
    id: string;
  };
  description?: string;
};

// Fetcher function for SWR
const fetcher = async (url: string) => {
  const response = await fetch(url, {
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error('Failed to fetch');
  }
  return response.json();
};

export default function AdminContentManager() {
  const [filteredContent, setFilteredContent] = useState<ContentItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'post' | 'project'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'flagged' | 'reported'>(
    'all',
  );
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    item?: ContentItem;
    reason: string;
  }>({
    isOpen: false,
    reason: '',
  });

  // Fetch posts and projects from the API
  const {
    data: postsData,
    error: postsError,
    mutate: mutatePosts,
  } = useSWR('http://localhost:4000/api/admin/posts', fetcher);
  const {
    data: projectsData,
    error: projectsError,
    mutate: mutateProjects,
  } = useSWR('http://localhost:4000/api/admin/projects', fetcher);

  const isLoading = !postsData && !postsError && !projectsData && !projectsError;

  // Filter content based on search and filters
  useEffect(() => {
    // Combine and normalize data from both endpoints inside useEffect
    const combinedContent: ContentItem[] = [
      ...(postsData?.posts || []).map(
        (post: {
          _id: string;
          title?: string;
          content?: string;
          description?: string;
          author?: { username: string; _id: string };
          authorId?: string;
          createdAt: string;
        }) => ({
          id: post._id,
          type: 'post' as const,
          title: post.title || 'Untitled Post',
          content: post.content || post.description || '',
          authorUsername: post.author?.username || 'Unknown User',
          authorId: post.author?._id || post.authorId || '',
          createdAt: post.createdAt,
          status: 'active' as const,
        }),
      ),
      ...(projectsData?.projects || []).map(
        (project: {
          _id: string;
          title?: string;
          description?: string;
          author?: { username: string; _id: string };
          authorId?: string;
          createdAt: string;
        }) => ({
          id: project._id,
          type: 'project' as const,
          title: project.title || 'Untitled Project',
          content: project.description || '',
          authorUsername: project.author?.username || 'Unknown User',
          authorId: project.author?._id || project.authorId || '',
          createdAt: project.createdAt,
          status: 'active' as const,
        }),
      ),
    ];

    let filtered = combinedContent;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.authorUsername.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Type filter
    if (filterType !== 'all') {
      filtered = filtered.filter((item) => item.type === filterType);
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter((item) => item.status === filterStatus);
    }

    setFilteredContent(filtered);
  }, [postsData?.posts, projectsData?.projects, searchQuery, filterType, filterStatus]);

  const handleDeleteContent = async (item: ContentItem, reason: string) => {
    try {
      // console.log('Deleting content:', item.id, 'Reason:', reason);

      // Make the actual DELETE request to the backend
      const endpoint =
        item.type === 'post'
          ? `http://localhost:4000/api/admin/post/${item.id}`
          : `http://localhost:4000/api/admin/project/${item.id}`;

      const response = await fetch(endpoint, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include HTTP-only cookies for authentication
        body: JSON.stringify({ reason }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(errorData.message || `Failed to delete ${item.type}: ${response.status}`);
      }

      // const result = await response.json();
      // console.log(`${item.type} deleted successfully:`, result);

      setDeleteDialog({ isOpen: false, reason: '' });
      showToast(`${item.type} has been deleted successfully`, 'success');

      // Log admin action
      // console.log('Admin Action Log:', {
      //   action: `delete_${item.type}`,
      //   targetId: item.id,
      //   targetType: item.type,
      //   authorId: item.authorId,
      //   reason,
      //   timestamp: new Date().toISOString(),
      //   result,
      // });

      // Refresh the data after deletion - trigger SWR revalidation
      if (item.type === 'post') {
        await mutatePosts(); // Trigger posts revalidation
      } else {
        await mutateProjects(); // Trigger projects revalidation
      }
    } catch (error) {
      console.error('Delete content error:', error);
      showToast(error instanceof Error ? error.message : 'Failed to delete content', 'error');
    }
  };

  const openDeleteDialog = (item: ContentItem) => {
    setDeleteDialog({
      isOpen: true,
      item,
      reason: '',
    });
  };

  const getStatusColor = (status: string): 'default' | 'destructive' | 'secondary' | 'outline' => {
    switch (status) {
      case 'active':
        return 'default';
      case 'flagged':
        return 'destructive';
      case 'reported':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'post':
        return <FileText className="w-4 h-4" />;
      case 'project':
        return <FileText className="w-4 h-4" />;
      case 'comment':
        return <FileText className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading content...</p>
        </div>
      </div>
    );
  }

  if (postsError || projectsError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-muted-foreground">
            Failed to load content. Please check your connection and try again.
          </p>
          <Button
            onClick={() => {
              mutatePosts();
              mutateProjects();
            }}
            className="mt-4"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Content Moderation
          </CardTitle>
          <CardDescription>
            Manage and moderate user-generated content across the platform
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Type Filter */}
            <Select
              value={filterType}
              onValueChange={(value: typeof filterType) => setFilterType(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Content Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="post">Posts</SelectItem>
                <SelectItem value="project">Projects</SelectItem>
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select
              value={filterStatus}
              onValueChange={(value: typeof filterStatus) => setFilterStatus(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="flagged">Flagged</SelectItem>
                <SelectItem value="reported">Reported</SelectItem>
              </SelectContent>
            </Select>

            {/* Results Count */}
            <div className="flex items-center text-sm text-muted-foreground">
              {filteredContent.length} items found
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content List */}
      <div className="space-y-4">
        {filteredContent.map((item) => (
          <Card
            key={item.id}
            className={
              item.status === 'flagged' || item.status === 'reported'
                ? 'border-red-200 bg-red-50/30'
                : ''
            }
          >
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                {/* Content Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    {getTypeIcon(item.type)}
                    <h3 className="font-medium truncate">{item.title}</h3>
                    <Badge variant={getStatusColor(item.status)}>{item.status}</Badge>
                    {item.reportCount && (
                      <Badge variant="destructive" className="text-xs">
                        {item.reportCount} reports
                      </Badge>
                    )}
                  </div>

                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{item.content}</p>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {item.authorUsername}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {item.type}
                    </Badge>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => console.log('View content:', item.id)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openDeleteDialog(item)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredContent.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No content found matching your filters</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Delete Content Dialog */}
      <Dialog
        open={deleteDialog.isOpen}
        onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, isOpen: open })}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-5 h-5" />
              Delete Content
            </DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the content.
            </DialogDescription>
          </DialogHeader>

          {deleteDialog.item && (
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <p className="font-medium">{deleteDialog.item.title}</p>
                <p className="text-sm text-muted-foreground">
                  {deleteDialog.item.type} by {deleteDialog.item.authorUsername}
                </p>
                <p className="text-sm text-muted-foreground mt-2 line-clamp-3">
                  {deleteDialog.item.content}
                </p>
              </div>

              <div>
                <label htmlFor="reason" className="text-sm font-medium">
                  Reason for deletion (required)
                </label>
                <Textarea
                  id="reason"
                  placeholder="Spam, inappropriate content, copyright violation, etc."
                  value={deleteDialog.reason}
                  onChange={(e) => setDeleteDialog({ ...deleteDialog, reason: e.target.value })}
                  className="mt-1"
                  required
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
                deleteDialog.item && handleDeleteContent(deleteDialog.item, deleteDialog.reason)
              }
              disabled={!deleteDialog.reason.trim()}
            >
              Delete Content
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
