import UserPosts from '../../post/components/UserPosts';

interface UserProfile {
  friendlyId?: string;
}

export default function PostTab({ userProfile }: { userProfile: UserProfile }) {
  // Show loading or empty state if no friendlyId
  if (!userProfile?.friendlyId) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Loading user profile...</p>
      </div>
    );
  }

  return <UserPosts friendlyId={userProfile.friendlyId} />;
}
