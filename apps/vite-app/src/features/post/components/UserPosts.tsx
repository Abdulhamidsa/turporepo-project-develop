import { useState } from 'react';

import CustomModal from '@repo/ui/components/CustomModal';
import { Avatar, AvatarFallback, AvatarImage } from '@repo/ui/components/ui/avatar';
import { Button } from '@repo/ui/components/ui/button';
import { Card, CardContent } from '@repo/ui/components/ui/card';
import { timeAgo } from '@repo/utils/timeCalculation';
import { UserPostType } from '@repo/zod/validation/post';
import { Heart, Loader, MessageCircle, Plus, Trash2 } from 'lucide-react';

import { useDeletePost } from '../../../hooks/useDeletePost';
import { PostForm } from '../../user/components/PostForm';
import { useAuth } from '../../user/hooks/use.auth';
import { useUserPosts } from '../../user/hooks/useFetchUserPosts';

interface UserPostsProps {
  friendlyId: string;
}

const UserPosts: React.FC<UserPostsProps> = ({ friendlyId }) => {
  const { posts, mutate } = useUserPosts(friendlyId);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<UserPostType | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { loggedUser } = useAuth();
  const { deletePost } = useDeletePost();

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

  const [isPostDialogOpen, setIsPostDialogOpen] = useState(false);

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {loggedUser?.friendlyId === friendlyId && (
          <div
            className="bg-card hover:bg-primary-foreground group relative flex h-full w-full items-center justify-center rounded-lg border p-4 transition duration-300 ease-in-out hover:cursor-pointer"
            onClick={() => setIsPostDialogOpen(true)}
          >
            <Plus className="text-primary-foreground h-52 w-12 opacity-100 transition-all duration-300 ease-in-out group-hover:opacity-0" />
            <span className="text-card absolute text-lg font-semibold opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100">
              Add Post
            </span>
          </div>
        )}

        {posts.length > 0 ? (
          posts.map((post) => (
            <Card
              key={post._id}
              className="bg-card text-card-foreground group relative w-full cursor-pointer overflow-hidden rounded-lg shadow-md transition hover:shadow-lg"
              onClick={() =>
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
                })
              }
            >
              <CardContent className="relative p-0">
                {post.image ? (
                  <img src={post.image} alt="Post" className="h-56 w-full object-cover" />
                ) : (
                  <div className="text-card bg-card flex h-56 w-full items-center justify-center">
                    <p className="text-muted-foreground text-sm">No image</p>
                  </div>
                )}

                <div className="absolute inset-0 bg-black bg-opacity-0 transition-all duration-300 ease-in-out group-hover:bg-opacity-40"></div>

                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                  <h3 className="mb-2 text-lg font-bold line-clamp-2">
                    {post.content && post.content.length > 100
                      ? `${post.content.slice(0, 100)}...`
                      : (post.content ?? 'No Content')}
                  </h3>

                  <p className="text-muted-foreground text-xs">
                    Likes: {post.likes?.length || 0} | Comments: {post.comments?.length || 0}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-muted-foreground col-span-full text-center">No posts available.</p>
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
