import { Suspense } from 'react';

import LoadingSpinner from '../../../components/LoadingSpinner';
import ProfileHeader from '../../../components/ProfileHeader';
import ProjectsSection from '../../../components/ProjectsSection';
import { getUserProfile, getUserProject } from '../../../lib/api';

export default async function PublicProfilePage({ params }: { params: { friendlyId: string } }) {
  const { friendlyId } = params;

  const userProfile = await getUserProfile(friendlyId);
  const userProjectResponse = await getUserProject(friendlyId);

  if (!userProfile) {
    return <p className="text-muted-foreground mt-10 text-center">User profile not found.</p>;
  }

  const userProjects = userProjectResponse?.data?.projects || [];

  return (
    <div className="container py-8 px-4 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <div className="bg-card border-border relative overflow-hidden rounded-lg shadow-md">
          <div className="absolute top-4 right-6 text-6xl font-bold text-muted/20 select-none">
            CV
          </div>

          <Suspense fallback={<LoadingSpinner />}>
            <div className="relative z-10">
              <ProfileHeader userProfile={userProfile} />
              <ProjectsSection projects={userProjects} />
            </div>
          </Suspense>
        </div>
      </div>
    </div>
  );
}
