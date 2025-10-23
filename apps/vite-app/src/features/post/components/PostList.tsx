import React, { useEffect, useRef, useState } from 'react';

import { useFetchPosts } from '../../user/hooks/useFetchAllPosts';
import { PostFeed } from './PostFeed';

const PostList: React.FC = () => {
  const { posts, isLoading, error, loadMore, isReachingEnd, isValidating } = useFetchPosts();
  const [filter, setFilter] = useState<'all' | 'popular' | 'recent'>('all');

  const loaderRef = useRef<HTMLDivElement | null>(null);

  // Calculate engagement score for filtering
  const getEngagementScore = (post: { likesCount?: number; comments?: unknown[] }) => {
    return (post.likesCount || 0) + (post.comments?.length || 0);
  };

  // Filter posts based on selected filter
  const filteredPosts = posts.filter((post) => {
    switch (filter) {
      case 'popular':
        return getEngagementScore(post) >= 5;
      case 'recent':
        return (
          post.createdAt && new Date(post.createdAt).getTime() > Date.now() - 24 * 60 * 60 * 1000
        ); // Last 24 hours
      default:
        return true;
    }
  });

  // Debug logging
  // console.log('PostList Debug:', {
  //   postsLength: posts.length,
  //   isLoading,
  //   error: error ? String(error) : null,
  //   posts: posts.slice(0, 2), // Show first 2 posts for debugging
  // });

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

  // Handle empty state
  if (!isLoading && posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-6 max-w-md mx-auto text-center">
        <div className="w-20 h-20 rounded-full bg-muted/30 flex items-center justify-center">
          <span className="text-6xl">📝</span>
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-foreground">No posts yet</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Looks like your feed is empty! Be the first to share something interesting with your
            network.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Professional Filter Controls */}
      <div className="mb-8">
        <div className="flex flex-col justify-end sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as typeof filter)}
                className="appearance-none bg-background border border-border rounded-lg px-4 py-2.5 pr-10 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 cursor-pointer hover:border-primary/50 min-w-[140px]"
              >
                <option value="all">All Posts</option>
                <option value="popular">Popular</option>
                <option value="recent">Recent</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg
                  className="w-4 h-4 text-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
            <span className="text-sm font-medium text-muted-foreground hidden sm:inline">
              {filteredPosts.length} posts
            </span>
          </div>
        </div>

        {/* Mobile counter */}
        <div className="sm:hidden text-xs text-muted-foreground">
          Showing {filteredPosts.length} of {posts.length} posts
        </div>
      </div>

      <div className="space-y-6 pb-8">
        {filteredPosts.map((post, index) => {
          // Create visual rhythm with varied spacing
          const hasImage = !!post.image;
          const isHighEngagement = getEngagementScore(post) >= 5;

          // Clean spacing without colors
          let extraSpacing = 'mb-6';
          if (isHighEngagement) extraSpacing = 'mb-8';
          else if (hasImage) extraSpacing = 'mb-7';

          return (
            <div
              key={post._id}
              className={`transition-all duration-500 ${extraSpacing}`}
              style={{
                animationName: 'fadeInSlideUp',
                animationDuration: '0.6s',
                animationTimingFunction: 'ease-out',
                animationFillMode: 'forwards',
                animationDelay: `${index * 100}ms`,
                opacity: 0,
                transform: 'translateY(20px)',
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
                index={index}
              />
            </div>
          );
        })}

        {filteredPosts.length === 0 && posts.length > 0 && (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-semibold">No posts match this filter</h3>
              <p className="text-muted-foreground text-sm">
                Try selecting a different filter to see more posts.
              </p>
            </div>
          </div>
        )}

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
