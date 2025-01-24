import { useState } from "react";
import { useUserPosts } from "../../user/hooks/useFetchUserPosts";
import { Card, CardContent } from "@repo/ui/components/ui/card";
import { Trash2, Loader } from "lucide-react";
import CustomModal from "@repo/ui/components/CustomModal";
import { UserPostType } from "@repo/zod/validation/post";
import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui/components/ui/avatar";
import { timeAgo } from "@repo/utils/timeCalculation";
import { useAuth } from "../../user/hooks/use.auth";
import { useDeletePost } from "../../../hooks/useDeletePost";

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
    <div className="container mx-auto p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.length > 0 ? (
        posts.map((post) => (
          <Card
            key={post._id}
            className="relative bg-card text-card-foreground cursor-pointer overflow-hidden group"
            onClick={() =>
              openPostModal({
                ...post,
                content: post.content ?? "No Content",
                image: post.image ?? "",
                likes: post.likes ?? [],
                comments:
                  post.comments?.map((comment) => ({
                    ...comment,
                    _id: comment._id ?? "unknown",
                  })) ?? [],
              })
            }
          >
            <CardContent className="p-0 relative">
              {post.image && (
                <div className="relative">
                  <img src={post.image} alt="Post" className="w-full h-[200px] object-cover rounded-t-lg transition-all duration-300 group-hover:opacity-80" />
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
                  className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 bg-red-600 hover:bg-red-700 text-white rounded-full p-2 transition-all duration-300"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}

              <div className="p-4">
                <h3 className="text-lg font-bold truncate">{post.content || "No Content"}</h3>
                <p className="text-sm text-gray-500">Likes: {post.likes?.length || 0}</p>
                <p className="text-sm text-gray-500">Comments: {post.comments?.length || 0}</p>
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <p className="text-center text-muted-foreground col-span-full">No posts available.</p>
      )}

      <CustomModal isOpen={isPostModalOpen} onClose={() => setIsPostModalOpen(false)} size="lg">
        {selectedPost && (
          <div className="max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">{selectedPost.content || "No Content"}</h2>

            {selectedPost.image && (
              <div className="relative flex justify-center">
                <img src={selectedPost.image} alt="Post" className="w-full max-h-[400px] object-cover rounded-lg cursor-pointer" />
              </div>
            )}

            <p className="text-sm text-gray-500">Likes: {selectedPost.likes?.length || 0}</p>

            {/* Comments Section */}
            <h3 className="text-lg font-bold mt-4 mb-2">Comments</h3>
            <div className="max-h-[300px] overflow-y-auto">
              {selectedPost.comments.length > 0 ? (
                <ul className="space-y-3">
                  {selectedPost.comments.map((comment) => (
                    <li key={comment._id} className="p-2 border border-gray-700 rounded-lg shadow-sm">
                      <div className="flex items-center space-x-2 mb-1">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={comment.userId.profilePicture || "/placeholder.png"} />
                          <AvatarFallback>{comment.userId?.username.charAt(0).toUpperCase() || "U"}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <strong className="text-xs text-foreground">{comment.userId?.username ?? "Anonymous"}</strong>
                          <span className="text-xs text-muted-foreground">{timeAgo(comment.createdAt ?? "")}</span>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">{comment.text}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400 text-center">No comments yet.</p>
              )}
            </div>
          </div>
        )}
      </CustomModal>

      <CustomModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} size="sm">
        <div className="text-center">
          <h2 className="text-lg font-bold mb-4">Are you sure you want to delete this post?</h2>
          <div className="flex justify-center space-x-4">
            <button onClick={handleDelete} className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark" disabled={isDeleting}>
              {isDeleting ? <Loader className="animate-spin w-5 h-5" /> : "Yes, Delete"}
            </button>
            <button onClick={() => setIsDeleteModalOpen(false)} className="bg-muted text-foreground px-4 py-2 rounded-md hover:bg-muted-dark">
              Cancel
            </button>
          </div>
        </div>
      </CustomModal>
    </div>
  );
};

export default UserPosts;
