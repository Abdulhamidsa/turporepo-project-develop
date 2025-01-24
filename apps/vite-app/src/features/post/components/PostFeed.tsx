import { useState, useRef } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@repo/ui/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui/components/ui/avatar";
import { Heart, Loader2, MessageCircle, Trash2 } from "lucide-react";
import { toggleLikePost } from "../../../../services/postService";
import { CommentBox } from "./CommentBox";
import { CommentType } from "@repo/zod/validation/post";
import { timeAgo } from "@repo/utils/timeCalculation";
import { Link, useNavigate } from "react-router-dom";
import { routesConfig } from "../../../../routes/routesConfig";
import { ProfessionBadge } from "../../../components/ProfessionBadge";
import { useAuth } from "../../user/hooks/use.auth";
import { useDeleteComment } from "../../../hooks/useDeleteComment";
import { showToast } from "@repo/ui/components/ui/toaster";
import CustomModal from "@repo/ui/components/CustomModal";

type PostProps = {
  post: {
    _id: string;
    content: string;
    image: string | null;
    createdAt: string;
    likedByUser: boolean;
    likesCount: number;
    comments: CommentType[];
  };
  user: {
    _id: string;
    username: string;
    friendlyId: string;
    profilePicture: string;
    profession: string;
  };
};

export function PostFeed({ post, user }: PostProps) {
  const { loggedUser } = useAuth();
  const navigate = useNavigate();
  const [likedByUser, setLikedByUser] = useState(post.likedByUser);
  const [likesCount, setLikesCount] = useState(post.likesCount);
  const [comments, setComments] = useState<CommentType[]>(post.comments);
  const [showComments, setShowComments] = useState(false);
  const { deleteComment, isLoading: deletingComment } = useDeleteComment(post._id);

  const [highlightedCommentId, setHighlightedCommentId] = useState<string | null>(null);
  const lastCommentRef = useRef<HTMLDivElement | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);

  const handleDeleteComment = async (commentId: string) => {
    const isDeleted = await deleteComment(commentId);
    if (isDeleted) {
      setComments((prevComments) => prevComments.filter((c) => c._id !== commentId));
      showToast("Comment deleted successfully!", "success");
    } else {
      showToast("Failed to delete comment. Please try again later.", "error");
    }
  };

  const handleLikeClick = async () => {
    try {
      await toggleLikePost(post._id);
      setLikedByUser(!likedByUser);
      setLikesCount((prev) => (likedByUser ? prev - 1 : prev + 1));
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const handleCommentAdded = (updatedComments: CommentType[]) => {
    setComments(updatedComments);
    const lastComment = updatedComments[updatedComments.length - 1];
    setHighlightedCommentId(lastComment._id);

    setTimeout(() => setHighlightedCommentId(null), 3000);

    setTimeout(() => {
      if (lastCommentRef.current) {
        lastCommentRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }, 100);
  };

  const handleAvatarClick = () => {
    const targetUrl = routesConfig.userPortfolio(user.friendlyId);
    if (loggedUser?.friendlyId === user.friendlyId) {
      navigate(targetUrl);
    }
  };

  const openDeleteModal = (commentId: string) => {
    setCommentToDelete(commentId);
    setIsModalOpen(true);
  };

  const confirmDeleteComment = () => {
    if (commentToDelete) {
      handleDeleteComment(commentToDelete);
      setCommentToDelete(null);
      setIsModalOpen(false);
    }
  };

  return (
    <Card className="space-y-2 m-auto w-full max-w-md bg-card text-card-foreground rounded-md shadow-md">
      {/* Post Header */}
      <CardHeader className="flex items-start flex-row space-x-2">
        {loggedUser?.friendlyId === user.friendlyId ? (
          <div onClick={handleAvatarClick} className="cursor-pointer">
            <Avatar className="flex-shrink-0 h-12 w-12">
              <AvatarImage src={user.profilePicture || "/placeholder.png"} />
              <AvatarFallback className="text-2xl">{user.username.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
          </div>
        ) : (
          <Link to={routesConfig.userPortfolioView(user.friendlyId)}>
            <Avatar className="flex-shrink-0 h-12 w-12">
              <AvatarImage src={user.profilePicture || "/placeholder.png"} />
              <AvatarFallback className="text-2xl">{user.username.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
          </Link>
        )}
        <div className="leading-tight flex-grow">
          <div className="flex items-center space-x-2">
            <h4 className="font-bold text-lg text-foreground pr-1">{user.username}</h4>
            <ProfessionBadge profession={user.profession} />
          </div>
          <p className="text-xs text-muted-foreground">{timeAgo(post.createdAt)}</p>
        </div>
      </CardHeader>

      {/* Post Content */}
      <CardContent className="space-y-2 border-b border-muted pb-2">
        <p className="text-foreground text-sm">{post.content}</p>
        {post.image && (
          <div className="rounded-md overflow-hidden">
            <img src={post.image} alt="Post" className="w-full h-auto object-contain" />
          </div>
        )}
      </CardContent>

      {/* Like and Comment Icon Section */}
      <CardFooter className="flex items-center justify-between space-x-2 pt-4">
        <div className={`flex items-center space-x-1 cursor-pointer transition-transform duration-300 ${likedByUser ? "text-primary scale-110" : "text-muted-foreground"}`} onClick={handleLikeClick}>
          <Heart className="w-5 h-5" />
          <span className="text-sm font-medium">{likesCount}</span>
        </div>
        <div className="flex items-center space-x-1 cursor-pointer text-muted-foreground hover:text-primary" onClick={() => setShowComments(!showComments)}>
          <MessageCircle className="w-5 h-5" />
          <span className="text-sm font-medium">{comments.length}</span>
        </div>
      </CardFooter>

      {/* Comments Section with Animation */}
      <div className={`transition-all duration-500 overflow-hidden ${showComments ? "max-h-[300px] opacity-100 mt-2" : "max-h-0 opacity-0"}`}>
        {/* Add Comment Input */}
        <CommentBox postId={post._id} onCommentAdded={handleCommentAdded} />

        {/* Comments Container */}
        <div className="mt-2 max-h-40 overflow-y-auto space-y-2 rounded-md p-2 scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-muted">
          {comments.length > 0 ? (
            comments.map((cmt) => (
              <div key={cmt._id} ref={cmt._id === highlightedCommentId ? lastCommentRef : null} className={`border rounded-md p-2 bg-card ${cmt._id === highlightedCommentId ? "border-primary" : ""}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 mb-1">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={cmt.userId.profilePicture || "/placeholder.png"} />
                      <AvatarFallback>{cmt.userId.username.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <strong className="text-xs">{cmt.userId.username ?? "Anonymous"}</strong>
                      <span className="text-xs text-muted-foreground">{timeAgo(cmt.createdAt ?? "")}</span>
                    </div>
                  </div>

                  {loggedUser?.username === cmt.userId.username && (
                    <button onClick={() => openDeleteModal(cmt._id)} disabled={deletingComment} className="text-destructive hover:text-red-500 transition">
                      {deletingComment ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    </button>
                  )}
                </div>
                <p className="text-xs">{cmt.text}</p>
              </div>
            ))
          ) : (
            <p className="italic text-xs text-muted-foreground">No comments yet. Be the first to comment!</p>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      <CustomModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} size="sm">
        <div className="text-center">
          <h2 className="text-lg font-bold mb-4">Are you sure you want to delete this comment?</h2>
          <div className="flex justify-center space-x-4">
            <button onClick={confirmDeleteComment} className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark">
              Yes, Delete
            </button>
            <button onClick={() => setIsModalOpen(false)} className="bg-muted text-foreground px-4 py-2 rounded-md hover:bg-muted-dark">
              Cancel
            </button>
          </div>
        </div>
      </CustomModal>
    </Card>
  );
}
