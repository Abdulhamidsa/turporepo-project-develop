import { useRef, useState } from 'react';

import CustomModal from '@repo/ui/components/CustomModal';
import { Avatar, AvatarFallback, AvatarImage } from '@repo/ui/components/ui/avatar';
import { Card, CardContent, CardFooter, CardHeader } from '@repo/ui/components/ui/card';
import { showToast } from '@repo/ui/components/ui/toaster';
import { timeAgo } from '@repo/utils/timeCalculation';
import { CommentType } from '@repo/zod/validation/post';
import { Heart, Loader2, MessageCircle, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { ProfessionBadge } from '../../../../../../packages/ui/src/components/ProfessionBadge';
import { routesConfig } from '../../../../routes/routesConfig';
import { toggleLikePost } from '../../../hooks/toggleLikePost';
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
  const [isHovered, setIsHovered] = useState(false);

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
    if (!loggedUser) {
      // Non-logged-in users go to public route with blurred content
      navigate(`/explore/professionals/${user.friendlyId}`);
    } else if (loggedUser.friendlyId === user.friendlyId) {
      // Navigate to manage mode for own profile
      navigate(routesConfig.userPortfolio(user.friendlyId));
    } else {
      // Logged-in users viewing others go to user route
      navigate(routesConfig.userPortfolioView(user.friendlyId));
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
    <Card
      className="bg-card/95 backdrop-blur-sm border-border/50 text-card-foreground mx-auto w-full max-w-lg transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 rounded-xl border group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Post Header */}
      <CardHeader className="pb-4">
        <div className="flex items-start space-x-4">
          <div onClick={handleAvatarClick} className="cursor-pointer transition-all duration-200">
            <Avatar className="h-14 w-14 ring-2 ring-primary/20 transition-all duration-200 hover:ring-primary/40">
              <AvatarImage
                src={user.profilePicture || '/placeholder.png'}
                className="object-cover transition-all duration-200 hover:brightness-110"
              />
              <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-lg font-semibold text-primary">
                {user.username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h4
                onClick={handleAvatarClick}
                className="text-foreground text-lg font-semibold cursor-pointer hover:text-primary transition-colors duration-200 truncate"
              >
                {user.username}
              </h4>
              <div className="transition-colors duration-200">
                <ProfessionBadge profession={user.profession} />
              </div>
            </div>
            <p className="text-muted-foreground text-sm font-medium">{timeAgo(post.createdAt)}</p>
          </div>
        </div>
      </CardHeader>

      {/* Post Content */}
      <CardContent className="px-6 pb-6">
        <div className="space-y-4">
          <p className="text-foreground text-base leading-relaxed font-medium">{post.content}</p>
          {post.image && (
            <div className="overflow-hidden rounded-2xl bg-muted/30 transition-all duration-300 cursor-zoom-in">
              <img
                src={post.image}
                alt="Post content"
                className="h-auto w-full object-cover transition-all duration-500 hover:brightness-105"
              />
            </div>
          )}
        </div>
      </CardContent>

      {/* Like and Comment Actions */}
      <CardFooter className="px-6 pt-0 pb-6">
        <div className="flex items-center justify-between w-full">
          <div
            className={`flex items-center gap-3 px-4 py-2.5 rounded-full cursor-pointer transition-all duration-300 hover:bg-primary/5 ${
              isToggling ? 'pointer-events-none opacity-60' : ''
            } ${likedByUser ? 'bg-primary/10' : 'bg-muted/40'}`}
            onClick={handleLikeClick}
          >
            {isToggling ? (
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
            ) : (
              <Heart
                className={`h-5 w-5 transition-all duration-200 ${
                  likedByUser
                    ? 'fill-primary text-primary scale-110'
                    : 'text-muted-foreground hover:text-primary'
                }`}
              />
            )}
            <span
              className={`text-sm font-semibold transition-colors duration-200 ${
                likedByUser ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              {likesCount}
            </span>
          </div>

          <div
            className={`flex items-center gap-3 px-4 py-2.5 rounded-full cursor-pointer transition-all duration-300 hover:bg-primary/5 ${
              showComments ? 'bg-primary/10' : 'bg-muted/40'
            }`}
            onClick={() => setShowComments(!showComments)}
          >
            <MessageCircle
              className={`h-5 w-5 transition-all duration-200 ${
                showComments ? 'text-primary' : 'text-muted-foreground hover:text-primary'
              }`}
            />
            <span
              className={`text-sm font-semibold transition-colors duration-200 ${
                showComments ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              {comments.length}
            </span>
          </div>
        </div>
      </CardFooter>

      {/* Comments Section with Elegant Animation */}
      <div
        className={`overflow-hidden transition-all duration-700 ease-out border-t border-border/30 ${
          showComments
            ? 'max-h-[400px] opacity-100 translate-y-0'
            : 'max-h-0 opacity-0 -translate-y-2'
        }`}
      >
        {/* Add Comment Input */}
        <div className="px-6 pt-4">
          <CommentBox postId={post._id} onCommentAdded={handleCommentAdded} />
        </div>

        {/* Comments Container */}
        <div className="px-6 pb-4 mt-4">
          <div className="max-h-48 space-y-3 overflow-y-auto scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent hover:scrollbar-thumb-primary/40">
            {comments.length > 0 ? (
              comments.map((cmt, index) => (
                <div
                  key={cmt._id}
                  ref={cmt._id === highlightedCommentId ? lastCommentRef : null}
                  className={`group p-4 rounded-xl transition-all duration-300 hover:bg-muted/30 ${
                    cmt._id === highlightedCommentId
                      ? 'bg-primary/5 border-2 border-primary/20 shadow-lg'
                      : 'bg-muted/20 border border-border/30'
                  }`}
                  style={{
                    animationDelay: `${index * 50}ms`,
                    animation: showComments ? 'fadeInUp 0.4s ease-out forwards' : 'none',
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <Avatar className="h-8 w-8 ring-1 ring-primary/20">
                        <AvatarImage
                          src={cmt.userId.profilePicture || '/placeholder.png'}
                          className="object-cover"
                        />
                        <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-xs font-semibold text-primary">
                          {cmt.userId.username.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <strong className="text-sm font-semibold text-foreground truncate">
                            {cmt.userId.username ?? 'Anonymous'}
                          </strong>
                          <span className="text-muted-foreground text-xs">
                            {timeAgo(cmt.createdAt ?? '')}
                          </span>
                        </div>
                        <p className="text-sm text-foreground leading-relaxed">{cmt.text}</p>
                      </div>
                    </div>

                    {loggedUser?.username === cmt.userId.username && (
                      <button
                        onClick={() => openDeleteModal(cmt._id)}
                        disabled={deletingComment}
                        className="opacity-0 group-hover:opacity-100 transition-all duration-200 p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                      >
                        {deletingComment ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <MessageCircle className="h-12 w-12 text-muted-foreground/40 mx-auto mb-3" />
                <p className="text-muted-foreground text-sm font-medium">
                  No comments yet. Be the first to start the conversation!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Elegant Confirmation Modal */}
      <CustomModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} size="sm">
        <div className="text-center p-6">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-destructive/10 mb-4">
            <Trash2 className="h-6 w-6 text-destructive" />
          </div>
          <h2 className="mb-2 text-xl font-semibold text-foreground">Delete Comment</h2>
          <p className="mb-6 text-muted-foreground text-sm">
            Are you sure you want to delete this comment? This action cannot be undone.
          </p>
          <div className="flex justify-center space-x-3">
            <button
              onClick={confirmDeleteComment}
              className="bg-destructive hover:bg-destructive/90 text-white rounded-lg px-6 py-2.5 font-medium transition-all duration-200"
            >
              Delete
            </button>
            <button
              onClick={() => setIsModalOpen(false)}
              className="bg-muted hover:bg-muted/80 text-foreground rounded-lg px-6 py-2.5 font-medium transition-all duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      </CustomModal>
    </Card>
  );
}
