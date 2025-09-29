import { useEffect, useMemo, useRef, useState } from 'react';

import { getEndpoints } from '@repo/api/endpoints';
import { UserProfile, defaultUserProfile, userProfileSchema } from '@repo/zod/validation/user';
import { useParams } from 'react-router-dom';
import useSWR from 'swr';

import AddProjectModal from '../../features/projects/components/addProjectModal';
import CoverSection from '../../features/user/components/CoverSection';
import ProfileDetails from '../../features/user/components/ProfileDetails';
import ProfileTabs from '../../features/user/components/ProfileTabs';
import { useAuth } from '../../features/user/hooks/use.auth';
import { useUserProfile } from '../../features/user/hooks/use.user.profile';
import { useUserProjects } from '../../features/user/hooks/useUserProjects';
import PageTransition from '../../layout/animation/PageTransition';

const ENDPOINTS = getEndpoints(import.meta.env.VITE_BASE_URL);

export default function ProfilePage() {
  const { friendlyId } = useParams<{ friendlyId: string }>();
  const { loggedUser } = useAuth();
  const { userProfile: ownProfile } = useUserProfile();
  const { projects: ownProjects, error: ownProjectsError } = useUserProjects();
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);

  // Check if viewing own profile or someone else's
  const isOwnProfile = !friendlyId || loggedUser?.friendlyId === friendlyId;

  // Fetch other user's profile data when viewing someone else's profile
  const { data: otherUserProfile, error: otherUserError } = useSWR(
    !isOwnProfile && friendlyId ? ENDPOINTS.users.fetchUserPublicProfile(friendlyId) : null,
    async (endpoint) => {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}${endpoint}`);
      if (!response.ok) throw new Error('Failed to fetch profile');
      const data = await response.json();
      return userProfileSchema.parse(data);
    },
  );

  // Fetch other user's projects when viewing someone else's profile
  const { data: otherUserProjects } = useSWR(
    !isOwnProfile && friendlyId ? ENDPOINTS.projects.fetchByFriendlyId(friendlyId) : null,
    async (endpoint) => {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}${endpoint}`);
      if (!response.ok) return [];
      const data = await response.json();
      return Array.isArray(data) ? data : data.projects || [];
    },
  );

  // Determine which data to use and normalize undefined to null
  const userProfile: UserProfile = useMemo(() => {
    const rawProfile = isOwnProfile ? ownProfile : otherUserProfile || defaultUserProfile;
    return {
      bio: rawProfile.bio ?? null,
      username: rawProfile.username ?? null,
      age: rawProfile.age ?? null,
      countryOrigin: rawProfile.countryOrigin ?? null,
      profession: rawProfile.profession ?? null,
      friendlyId: rawProfile.friendlyId ?? '',
      profilePicture: rawProfile.profilePicture ?? null,
      coverImage: rawProfile.coverImage ?? null,
      completedProfile: rawProfile.completedProfile ?? false,
    };
  }, [isOwnProfile, ownProfile, otherUserProfile]);
  const projects = useMemo(() => {
    return isOwnProfile ? ownProjects : otherUserProjects || [];
  }, [isOwnProfile, ownProjects, otherUserProjects]);
  const error = isOwnProfile ? ownProjectsError : otherUserError;

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
            <ProfileTabs userProfile={userProfile} projects={projects} viewOnly={!isOwnProfile} />
          </div>
        </div>
      </div>

      {isOwnProfile && (
        <AddProjectModal
          isOpen={isProjectDialogOpen}
          onClose={() => setIsProjectDialogOpen(false)}
        />
      )}
    </PageTransition>
  );
}
