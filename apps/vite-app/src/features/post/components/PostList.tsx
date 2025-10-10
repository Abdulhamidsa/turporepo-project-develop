import React, { useEffect, useRef } from 'react';

import { useFetchPosts } from '../../user/hooks/useFetchAllPosts';
import { PostFeed } from './PostFeed';

const PostList: React.FC = () => {
  const { posts, isLoading, error, loadMore, isReachingEnd, isValidating } = useFetchPosts();

  const loaderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const currentLoader = loaderRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isValidating && !isReachingEnd) {
          loadMore();
        }
      },
      { threshold: 1 },
    );

    if (currentLoader) {
      observer.observe(currentLoader);
    }

    return () => {
      if (currentLoader) {
        observer.unobserve(currentLoader);
      }
    };
  }, [loadMore, isReachingEnd, isValidating]);

  if (isLoading && posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
        <p className="text-muted-foreground font-medium">Loading your feed...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
          <span className="text-destructive text-xl">⚠</span>
        </div>
        <p className="text-destructive font-medium">Error loading posts</p>
        <p className="text-muted-foreground text-sm">{String(error)}</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="space-y-8 pb-8">
        {posts.map((post, index) => (
          <div
            key={post._id}
            className="transition-all duration-500"
            style={{
              animationDelay: `${index * 100}ms`,
              animation: 'fadeInUp 0.6s ease-out forwards',
            }}
          >
            <PostFeed
              post={{
                _id: post._id,
                content: post.content,
                image: post.image ?? null,
                createdAt: post.createdAt ?? '',
                likedByUser: post.likedByUser ?? false,
                likesCount: post.likesCount ?? 0,
                comments: post.comments ?? [],
              }}
              user={{
                _id: post.userId._id,
                username: post.userId.username,
                profession: post.userId.profession ?? '',
                friendlyId: post.userId.friendlyId,
                profilePicture: post.userId.profilePicture ?? '',
              }}
            />
          </div>
        ))}

        {!isReachingEnd && (
          <div ref={loaderRef} className="flex flex-col items-center py-8 space-y-3">
            {isValidating && (
              <>
                <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                <p className="text-muted-foreground text-sm font-medium">Loading more posts...</p>
              </>
            )}
          </div>
        )}

        {isReachingEnd && posts.length > 0 && (
          <div className="text-center py-8">
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-muted/50">
              <span className="text-muted-foreground text-sm font-medium">
                You're all caught up!
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostList;
