import { UserProfile } from '@repo/zod/validation/user';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

import UserPosts from '../../post/components/UserPosts';

interface PostsTabContentProps {
  userProfile: UserProfile;
  viewOnly?: boolean;
}

const PostsTabContent = ({ userProfile, viewOnly = false }: PostsTabContentProps) => {
  if (!userProfile.friendlyId) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-4">
        <div className="animate-pulse">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
        </div>
        <p className="text-muted-foreground text-sm">Loading user posts...</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="space-y-6"
    >
      {/* Header Section */}
      {/* <div className="text-center space-y-2 mb-8">
        <div className="flex items-center justify-center gap-3">
          <div className="p-3 bg-primary/10 rounded-full">
            <FileText className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">{userProfile.username}'s Posts</h2>
            <p className="text-muted-foreground text-sm">
              Discover thoughts, insights, and updates
            </p>
          </div>
        </div>
      </div> */}

      {/* Posts Content */}
      <div className="relative">
        {/* Background decoration */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-primary/20 via-primary to-primary/20 rounded-full" />

        {/* Posts Container */}
        <div className="pt-8">
          <UserPosts friendlyId={userProfile.friendlyId} viewOnly={viewOnly} />
        </div>
      </div>
    </motion.div>
  );
};

export default PostsTabContent;
