import { useRef, useState } from 'react';

import CustomModal from '@repo/ui/components/CustomModal';
import { Avatar, AvatarFallback, AvatarImage } from '@repo/ui/components/ui/avatar';
import { Card, CardContent, CardFooter, CardHeader } from '@repo/ui/components/ui/card';
import { showToast } from '@repo/ui/components/ui/toaster';
import { timeAgo } from '@repo/utils/timeCalculation';
import { CommentType } from '@repo/zod/validation/post';
import { Heart, Loader2, MessageCircle, Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

import { ProfessionBadge } from '../../../../../../packages/ui/src/components/ProfessionBadge';
import { routesConfig } from '../../../../routes/routesConfig';
import { toggleLikePost } from '../../../../services/postService';
import { useDeleteComment } from '../../../hooks/useDeleteComment';
import { useAuth } from '../../user/hooks/use.auth';
import { CommentBox } from './CommentBox';

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

  const [isToggling, setIsToggling] = useState(false);

  const handleDeleteComment = async (commentId: string) => {
    const isDeleted = await deleteComment(commentId);
    if (isDeleted) {
      setComments((prevComments) => prevComments.filter((c) => c._id !== commentId));
      showToast('Comment deleted successfully!', 'success');
    } else {
      showToast('Failed to delete comment. Please try again later.', 'error');
    }
  };

  const handleLikeClick = async () => {
    if (isToggling) return;
    setIsToggling(true);
    try {
      await toggleLikePost(post._id);
      setLikedByUser((prev) => !prev);
      setLikesCount((prev) => (likedByUser ? prev - 1 : prev + 1));
    } catch (error) {
      console.error('Error toggling like:', error);
    } finally {
      setIsToggling(false);
    }
  };

  const handleCommentAdded = (updatedComments: CommentType[]) => {
    setComments(updatedComments);
    const lastComment = updatedComments[updatedComments.length - 1];
    setHighlightedCommentId(lastComment._id);

    setTimeout(() => setHighlightedCommentId(null), 3000);

    setTimeout(() => {
      if (lastCommentRef.current) {
        lastCommentRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
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
    <Card className="bg-card text-card-foreground m-auto w-full max-w-md space-y-2 rounded-md shadow-md">
      {/* Post Header */}
      <CardHeader className="flex flex-row items-start space-x-2">
        {loggedUser?.friendlyId === user.friendlyId ? (
          <div onClick={handleAvatarClick} className="cursor-pointer">
            <Avatar className="h-12 w-12 flex-shrink-0">
              <AvatarImage src={user.profilePicture || '/placeholder.png'} />
              <AvatarFallback className="text-2xl">
                {user.username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
        ) : (
          <Link to={routesConfig.userPortfolioView(user.friendlyId)}>
            <Avatar className="h-12 w-12 flex-shrink-0">
              <AvatarImage src={user.profilePicture || '/placeholder.png'} />
              <AvatarFallback className="text-2xl">
                {user.username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Link>
        )}

        <div className="flex-grow leading-tight">
          <div className="flex flex-col items-start space-y-1 sm:flex-row sm:items-center sm:space-x-2 sm:space-y-0">
            <h4 className="text-foreground text-lg font-bold">{user.username}</h4>
            <ProfessionBadge profession={user.profession} />
          </div>
          <p className="text-muted-foreground text-xs">{timeAgo(post.createdAt)}</p>
        </div>
      </CardHeader>

      {/* Post Content */}
      <CardContent className="border-muted space-y-2 border-b pb-2">
        <p className="text-foreground text-sm">{post.content}</p>
        {post.image && (
          <div className="overflow-hidden rounded-md">
            <img src={post.image} alt="Post" className="h-auto w-full object-contain" />
          </div>
        )}
      </CardContent>

      {/* Like and Comment Icon Section */}
      <CardFooter className="flex items-center justify-between space-x-2 pt-4">
        <div
          className={`flex cursor-pointer items-center space-x-1 transition-transform duration-300 ${
            likedByUser ? 'text-primary scale-110' : 'text-muted-foreground'
          } ${isToggling ? 'pointer-events-none opacity-60' : ''}`}
          onClick={handleLikeClick}
        >
          {isToggling ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Heart className="h-5 w-5" />
          )}
          <span className="text-sm font-medium">{likesCount}</span>
        </div>
        <div
          className="text-muted-foreground hover:text-primary flex cursor-pointer items-center space-x-1"
          onClick={() => setShowComments(!showComments)}
        >
          <MessageCircle className="h-5 w-5" />
          <span className="text-sm font-medium">{comments.length}</span>
        </div>
      </CardFooter>

      {/* Comments Section with Animation */}
      <div
        className={`overflow-hidden transition-all duration-500 ${
          showComments ? 'mt-2 max-h-[300px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        {/* Add Comment Input */}
        <CommentBox postId={post._id} onCommentAdded={handleCommentAdded} />

        {/* Comments Container */}
        <div className="scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-muted mt-2 max-h-40 space-y-2 overflow-y-auto rounded-md p-2">
          {comments.length > 0 ? (
            comments.map((cmt) => (
              <div
                key={cmt._id}
                ref={cmt._id === highlightedCommentId ? lastCommentRef : null}
                className={`bg-card rounded-md border p-2 ${
                  cmt._id === highlightedCommentId ? 'border-primary' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="mb-1 flex items-center space-x-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={cmt.userId.profilePicture || '/placeholder.png'} />
                      <AvatarFallback>{cmt.userId.username.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <strong className="text-xs">{cmt.userId.username ?? 'Anonymous'}</strong>
                      <span className="text-muted-foreground text-xs">
                        {timeAgo(cmt.createdAt ?? '')}
                      </span>
                    </div>
                  </div>

                  {loggedUser?.username === cmt.userId.username && (
                    <button
                      onClick={() => openDeleteModal(cmt._id)}
                      disabled={deletingComment}
                      className="text-destructive transition hover:text-red-500"
                    >
                      {deletingComment ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </button>
                  )}
                </div>
                <p className="text-xs">{cmt.text}</p>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground text-xs italic">
              No comments yet. Be the first to comment!
            </p>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      <CustomModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} size="sm">
        <div className="text-center">
          <h2 className="mb-4 text-lg font-bold">Are you sure you want to delete this comment?</h2>
          <div className="flex justify-center space-x-4">
            <button
              onClick={confirmDeleteComment}
              className="bg-primary hover:bg-primary-dark rounded-md px-4 py-2 text-white"
            >
              Yes, Delete
            </button>
            <button
              onClick={() => setIsModalOpen(false)}
              className="bg-muted text-foreground hover:bg-muted-dark rounded-md px-4 py-2"
            >
              Cancel
            </button>
          </div>
        </div>
      </CustomModal>
    </Card>
  );
}
