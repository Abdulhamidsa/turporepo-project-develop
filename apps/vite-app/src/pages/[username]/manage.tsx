import { useEffect, useRef, useState } from 'react';

import AddProjectModal from '../../features/projects/components/addProjectModal';
import CoverSection from '../../features/user/components/CoverSection';
import ProfileDetails from '../../features/user/components/ProfileDetails';
import ProfileTabs from '../../features/user/components/ProfileTabs';
import { useUserProfile } from '../../features/user/hooks/use.user.profile';
import { useUserProjects } from '../../features/user/hooks/useUserProjects';
import PageTransition from '../../layout/animation/PageTransition';

export default function ProfilePage() {
  const { userProfile } = useUserProfile();
  const { projects, error } = useUserProjects();
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);

  const tabsContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (tabsContentRef.current) {
      const tabContents = tabsContentRef.current.querySelectorAll("[role='tabpanel']");
      let maxHeight = 0;
      tabContents.forEach((tabContent) => {
        maxHeight = Math.max(maxHeight, tabContent.scrollHeight);
      });
      tabsContentRef.current.style.minHeight = `${maxHeight}px`;
    }
  }, [projects, userProfile]);

  if (error) {
    return (
      <p className="mt-8 text-center text-red-500">
        Failed to load projects. Please try again later.
      </p>
    );
  }

  return (
    <PageTransition>
      <div className="bg-background min-h-screen">
        <CoverSection coverImage={userProfile.coverImage ?? null} />

        <div className="container mx-auto -mt-32 px-2 sm:-mt-40 sm:px-6 lg:px-8">
          <ProfileDetails userProfile={userProfile} />
          <div ref={tabsContentRef}>
            <ProfileTabs
              userProfile={{
                ...userProfile,
                bio: userProfile.bio ?? null,
                username: userProfile.username ?? null,
                countryOrigin: userProfile.countryOrigin ?? null,
                profession: userProfile.profession ?? null,
                friendlyId: userProfile.friendlyId ?? '',
                profilePicture: userProfile.profilePicture ?? null,
                coverImage: userProfile.coverImage ?? null,
                completedProfile: userProfile.completedProfile ?? false,
              }}
              projects={projects}
            />
          </div>
        </div>
      </div>

      <AddProjectModal isOpen={isProjectDialogOpen} onClose={() => setIsProjectDialogOpen(false)} />
    </PageTransition>
  );
}
