import { useState } from 'react';

import CustomModal from '@repo/ui/components/CustomModal';
import { Avatar, AvatarFallback, AvatarImage } from '@repo/ui/components/ui/avatar';
import { Card, CardContent } from '@repo/ui/components/ui/card';
import { timeAgo } from '@repo/utils/timeCalculation';
import { UserPostType } from '@repo/zod/validation/post';
import { Loader, Trash2 } from 'lucide-react';

import { useDeletePost } from '../../../hooks/useDeletePost';
import { useAuth } from '../../user/hooks/use.auth';
import { useUserPosts } from '../../user/hooks/useFetchUserPosts';

interface UserPostsProps {
  friendlyId: string;
}

const UserPosts: React.FC<UserPostsProps> = ({ friendlyId }) => {
  const { posts, refetch } = useUserPosts(friendlyId);
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

  const openDeleteModal = (post: UserPostType) => {
    setSelectedPost(post);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedPost) return;
    setIsDeleting(true);
    const isDeleted = await deletePost(selectedPost._id);
    if (isDeleted) {
      setIsDeleteModalOpen(false);
      setSelectedPost(null);
      await refetch();
    }
    setIsDeleting(false);
  };

  return (
    <div className="container mx-auto grid grid-cols-1 gap-6 p-4 sm:grid-cols-2 lg:grid-cols-3">
      {posts.length > 0 ? (
        posts.map((post) => (
          <Card
            key={post._id}
            className="bg-card text-card-foreground group relative cursor-pointer overflow-hidden"
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
              {post.image && (
                <div className="relative">
                  <img
                    src={post.image}
                    alt="Post"
                    className="h-[200px] w-full rounded-t-lg object-cover transition-all duration-300 group-hover:opacity-80"
                  />
                </div>
              )}

              {loggedUser?.username === post.userId.username && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openDeleteModal({
                      ...post,
                      image: post.image ?? null,
                      comments: post.comments ?? [],
                      likes: post.likes ?? [],
                    });
                  }}
                  className="absolute right-3 top-3 rounded-full bg-red-600 p-2 text-white opacity-0 transition-all duration-300 hover:bg-red-700 group-hover:opacity-100"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              )}

              <div className="p-4">
                <h3 className="truncate text-lg font-bold">{post.content || 'No Content'}</h3>
                <p className="text-sm text-gray-500">Likes: {post.likes?.length || 0}</p>
                <p className="text-sm text-gray-500">Comments: {post.comments?.length || 0}</p>
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <p className="text-muted-foreground col-span-full text-center">No posts available.</p>
      )}

      <CustomModal isOpen={isPostModalOpen} onClose={() => setIsPostModalOpen(false)} size="lg">
        {selectedPost && (
          <div className="max-h-[80vh] overflow-y-auto">
            <h2 className="mb-4 text-xl font-bold">{selectedPost.content || 'No Content'}</h2>

            {selectedPost.image && (
              <div className="relative flex justify-center">
                <img
                  src={selectedPost.image}
                  alt="Post"
                  className="max-h-[400px] w-full cursor-pointer rounded-lg object-cover"
                />
              </div>
            )}

            <p className="text-sm text-gray-500">Likes: {selectedPost.likes?.length || 0}</p>

            {/* Comments Section */}
            <h3 className="mb-2 mt-4 text-lg font-bold">Comments</h3>
            <div className="max-h-[300px] overflow-y-auto">
              {selectedPost.comments.length > 0 ? (
                <ul className="space-y-3">
                  {selectedPost.comments.map((comment) => (
                    <li
                      key={comment._id}
                      className="rounded-lg border border-gray-700 p-2 shadow-sm"
                    >
                      <div className="mb-1 flex items-center space-x-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={comment.userId.profilePicture || '/placeholder.png'} />
                          <AvatarFallback>
                            {comment.userId?.username.charAt(0).toUpperCase() || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <strong className="text-foreground text-xs">
                            {comment.userId?.username ?? 'Anonymous'}
                          </strong>
                          <span className="text-muted-foreground text-xs">
                            {timeAgo(comment.createdAt ?? '')}
                          </span>
                        </div>
                      </div>
                      <p className="text-muted-foreground text-xs">{comment.text}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-center text-gray-400">No comments yet.</p>
              )}
            </div>
          </div>
        )}
      </CustomModal>

      <CustomModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} size="sm">
        <div className="text-center">
          <h2 className="mb-4 text-lg font-bold">Are you sure you want to delete this post?</h2>
          <div className="flex justify-center space-x-4">
            <button
              onClick={handleDelete}
              className="bg-primary hover:bg-primary-dark rounded-md px-4 py-2 text-white"
              disabled={isDeleting}
            >
              {isDeleting ? <Loader className="h-5 w-5 animate-spin" /> : 'Yes, Delete'}
            </button>
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="bg-muted text-foreground hover:bg-muted-dark rounded-md px-4 py-2"
            >
              Cancel
            </button>
          </div>
        </div>
      </CustomModal>
    </div>
  );
};

export default UserPosts;
