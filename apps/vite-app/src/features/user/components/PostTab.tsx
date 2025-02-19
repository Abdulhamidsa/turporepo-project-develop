import UserPosts from '../../post/components/UserPosts';

interface UserProfile {
  friendlyId?: string;
}

export default function PostTab({ userProfile }: { userProfile: UserProfile }) {
  return <UserPosts friendlyId={userProfile.friendlyId ?? ''} />;
}
