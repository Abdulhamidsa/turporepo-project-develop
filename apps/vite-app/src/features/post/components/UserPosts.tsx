import { useState } from 'react';

import CustomModal from '@repo/ui/components/CustomModal';
import { Avatar, AvatarFallback, AvatarImage } from '@repo/ui/components/ui/avatar';
import { Button } from '@repo/ui/components/ui/button';
import { Card, CardContent } from '@repo/ui/components/ui/card';
import { timeAgo } from '@repo/utils/timeCalculation';
import { UserPostType } from '@repo/zod/validation/post';
import { Loader, Plus, Trash2 } from 'lucide-react';

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
            {loggedUser?.username === selectedPost?.userId.username && (
              <div className="mt-4 flex justify-end">
                <Button
                  variant="destructive"
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="flex items-center space-x-2 rounded bg-red-600 p-3.5 text-white transition-all duration-300 hover:bg-red-700"
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </div>
            )}
          </div>
        )}
      </CustomModal>

      <CustomModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} size="sm">
        <div className="text-center">
          <h2 className="mb-4 text-lg  font-bold">Are you sure you want to delete this post?</h2>
          <div className="flex justify-center space-x-4">
            <button
              onClick={handleDelete}
              className="bg-destructive hover:bg-primary-dark rounded-md px-4 py-2 text-white"
              disabled={isDeleting}
            >
              {isDeleting ? <Loader className="h-5 w-5 animate-spin " /> : 'Yes, Delete'}
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
    </>
  );
};

export default UserPosts;
