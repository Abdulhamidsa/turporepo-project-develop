import { useState } from 'react';

import CustomModal from '@repo/ui/components/CustomModal';
import { Avatar, AvatarFallback, AvatarImage } from '@repo/ui/components/ui/avatar';
import { Button } from '@repo/ui/components/ui/button';
import { timeAgo } from '@repo/utils/timeCalculation';
import { UserPostType } from '@repo/zod/validation/post';
import { Heart, Loader, MessageCircle, Trash2 } from 'lucide-react';

import { useDeletePost } from '../../../hooks/useDeletePost';
import { PostForm } from '../../user/components/PostForm';
import { useAuth } from '../../user/hooks/use.auth';
import { useUserPosts } from '../../user/hooks/useFetchUserPosts';

interface UserPostsProps {
  friendlyId: string;
  viewOnly?: boolean;
}

const UserPosts: React.FC<UserPostsProps> = ({ friendlyId, viewOnly = false }) => {
  const { posts, mutate } = useUserPosts(friendlyId);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<UserPostType | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isPostDialogOpen, setIsPostDialogOpen] = useState(false);
  const { loggedUser } = useAuth();
  const { deletePost } = useDeletePost();

  // Early return if friendlyId is empty or invalid
  if (!friendlyId || friendlyId.trim() === '') {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No user identifier provided.</p>
      </div>
    );
  }

  const openPostModal = (post: UserPostType) => {
    setSelectedPost(post);
    setIsPostModalOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedPost) return;
    setIsDeleting(true);
    const isDeleted = await deletePost(selectedPost._id);
    if (isDeleted) {
      setIsDeleteModalOpen(false);
      setSelectedPost(null);
      await mutate();
    }
    setIsDeleting(false);
  };

  return (
    <>
      {/* Simple Add Post Prompt */}
      {!viewOnly && loggedUser?.friendlyId === friendlyId && (
        <div className="mb-6">
          <button
            onClick={() => setIsPostDialogOpen(true)}
            className="w-full bg-card border border-border rounded-lg p-4 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 hover:border-primary/30"
          >
            <div className="flex items-center gap-3 text-left">
              <Avatar className="h-10 w-10">
                <AvatarImage src={loggedUser?.profilePicture || '/placeholder.png'} />
                <AvatarFallback className="bg-primary/10 text-primary font-medium">
                  {loggedUser?.username?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 bg-muted/30 rounded-full px-4 py-3 text-muted-foreground text-sm">
                What's on your mind, {loggedUser?.username?.split(' ')[0] || 'there'}?
              </div>
            </div>
          </button>
        </div>
      )}

      {/* Facebook-style Posts Feed */}
      <div className="space-y-4">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div
              key={post._id}
              className="bg-card border border-border rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Post Header */}
              <div className="p-4 pb-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={post.userId?.profilePicture || '/placeholder.png'} />
                    <AvatarFallback className="bg-primary/10 text-primary font-medium">
                      {post.userId?.username?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground text-sm">
                      {post.userId?.username || 'Anonymous'}
                    </h3>
                    <p className="text-muted-foreground text-xs">{timeAgo(post.createdAt ?? '')}</p>
                  </div>

                  {/* Three dots menu - always visible for better UX */}
                  <button
                    className="p-2 rounded-full hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground opacity-70 hover:opacity-100"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent opening the post modal
                      openPostModal({
                        ...post,
                        content: post.content ?? 'No Content',
                        image: post.image ?? '',
                        likes: post.likes ?? [],
                        comments:
                          post.comments?.map((comment) => ({
                            ...comment,
                            _id: comment._id ?? 'unknown',
                          })) ?? [],
                      });
                    }}
                    title="More options"
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Post Content */}
              {post.content && (
                <div className="px-4 pb-3">
                  <p className="text-foreground text-sm leading-relaxed">{post.content}</p>
                </div>
              )}

              {/* Post Image */}
              {post.image && (
                <div className="px-4 pb-3">
                  <div className="rounded-lg overflow-hidden">
                    <img
                      src={post.image}
                      alt="Post content"
                      className="w-full h-auto max-h-96 object-cover"
                    />
                  </div>
                </div>
              )}

              {/* Engagement Stats */}
              <div className="px-4 py-2 border-t border-border/50">
                <div className="flex items-center justify-between text-muted-foreground text-xs">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Heart className="h-3 w-3" />
                      {post.likes?.length || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="h-3 w-3" />
                      {post.comments?.length || 0}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {/* <div className="px-4 py-2 border-t border-border/50">
                <div className="flex items-center justify-around">
                  <button className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground">
                    <Heart className="h-4 w-4" />
                    <span className="text-sm font-medium">Like</span>
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground">
                    <MessageCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">Comment</span>
                  </button>
                </div>
              </div> */}
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No posts available.</p>
          </div>
        )}
      </div>

      {/* Post Dialog Modal */}
      <CustomModal isOpen={isPostDialogOpen} onClose={() => setIsPostDialogOpen(false)} size="lg">
        <PostForm onClose={() => setIsPostDialogOpen(false)} />
      </CustomModal>

      {/* Post Modal */}
      <CustomModal isOpen={isPostModalOpen} onClose={() => setIsPostModalOpen(false)} size="2xl">
        {selectedPost && (
          <div className="flex flex-col md:flex-row gap-4 md:gap-6">
            {/* Image Section */}
            {selectedPost.image && (
              <div className="w-full md:w-1/2">
                <div className="aspect-video md:aspect-square overflow-hidden rounded-lg bg-muted">
                  <img src={selectedPost.image} alt="Post" className="h-full w-full object-cover" />
                </div>
              </div>
            )}

            {/* Content Section */}
            <div className={`w-full ${selectedPost.image ? 'md:w-1/2' : ''} flex flex-col`}>
              <div className="flex-1 space-y-4">
                {/* Post Header */}
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8 md:h-10 md:w-10 border border-border">
                    <AvatarImage src={selectedPost.userId.profilePicture || '/placeholder.png'} />
                    <AvatarFallback className="bg-muted text-muted-foreground text-sm">
                      {selectedPost.userId?.username.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-foreground font-medium text-sm">
                      {selectedPost.userId?.username ?? 'Anonymous'}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      {timeAgo(selectedPost.createdAt ?? '')}
                    </span>
                  </div>
                </div>

                {/* Post Content */}
                {selectedPost.content && (
                  <div className="space-y-2">
                    <p className="text-foreground leading-relaxed text-sm">
                      {selectedPost.content}
                    </p>
                  </div>
                )}

                {/* Post Stats */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground border-y border-border py-3">
                  <span className="flex items-center gap-1">
                    <Heart className="h-4 w-4" />
                    {selectedPost.likes?.length || 0} likes
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="h-4 w-4" />
                    {selectedPost.comments?.length || 0} comments
                  </span>
                </div>

                {/* Comments Section */}
                <div className="space-y-3">
                  <h3 className="text-foreground font-medium text-sm">Comments</h3>
                  <div className="space-y-3 max-h-48 md:max-h-60 overflow-y-auto">
                    {selectedPost.comments.length > 0 ? (
                      selectedPost.comments.map((comment) => (
                        <div key={comment._id} className="bg-muted/50 rounded-lg p-3 space-y-2">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage
                                src={comment.userId.profilePicture || '/placeholder.png'}
                              />
                              <AvatarFallback className="bg-muted text-muted-foreground text-xs">
                                {comment.userId?.username.charAt(0).toUpperCase() || 'U'}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-foreground font-medium text-sm">
                              {comment.userId?.username ?? 'Anonymous'}
                            </span>
                            <span className="text-muted-foreground text-xs">
                              {timeAgo(comment.createdAt ?? '')}
                            </span>
                          </div>
                          <p className="text-muted-foreground text-sm ml-8">{comment.text}</p>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-6">
                        <p className="text-muted-foreground text-sm">No comments yet.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              {loggedUser?.username === selectedPost?.userId.username && (
                <div className="mt-4 pt-4 border-t border-border">
                  <Button
                    variant="outline"
                    onClick={() => setIsDeleteModalOpen(true)}
                    className="w-full text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Post
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </CustomModal>

      <CustomModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} size="md">
        <div className="text-center space-y-4">
          <h2 className="text-foreground text-xl font-semibold">Delete Post</h2>
          <p className="text-muted-foreground">
            Are you sure you want to delete this post? This action cannot be undone.
          </p>
          <div className="flex gap-3 justify-end pt-2">
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? (
                <Loader className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Trash2 className="h-4 w-4 mr-2" />
              )}
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </div>
      </CustomModal>
    </>
  );
};

export default UserPosts;
