import { UserProfile } from '@repo/zod/validation/user';

import ModernProfileTabs from './ModernProfileTabs';

interface ProfileTabsProps {
  userProfile: UserProfile;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  projects: any[];
  viewOnly?: boolean;
}

const ProfileTabs = ({ userProfile, projects, viewOnly = false }: ProfileTabsProps) => {
  return (
    <div className="min-h-[500px]">
      <ModernProfileTabs userProfile={userProfile} projects={projects} viewOnly={viewOnly} />
    </div>
  );
};

export default ProfileTabs;
