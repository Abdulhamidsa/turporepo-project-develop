import { Suspense } from 'react';

import LoadingSpinner from '../../../components/LoadingSpinner';
import ProfileHeader from '../../../components/ProfileHeader';
import ProjectsSection from '../../../components/ProjectsSection';
import { getUserProfile, getUserProject } from '../../../lib/api';

// Match the pattern used in projects/page.tsx
type AsyncParams = Promise<{ friendlyId: string }>;

export default async function PublicProfilePage({ params }: { params: AsyncParams }) {
  const resolvedParams = await params;
  const { friendlyId } = resolvedParams;

  // Get raw data directly from API - minimal processing
  const userProfile = await getUserProfile(friendlyId);
  const userProjectResponse = await getUserProject(friendlyId);

  if (!userProfile) {
    return <p className="text-muted-foreground mt-10 text-center">User profile not found.</p>;
  }

  // Pass raw data directly to components
  return (
    <div className="container py-4 sm:py-6 md:py-8 px-3 sm:px-4 md:px-6">
      <div className="mx-auto max-w-5xl">
        <div className="bg-card border-border relative overflow-hidden rounded-lg shadow-md">
          <Suspense fallback={<LoadingSpinner />}>
            <div className="relative z-10">
              <ProfileHeader userProfile={userProfile} />
              <ProjectsSection projects={userProjectResponse?.data?.projects || []} />
            </div>
          </Suspense>
        </div>
      </div>
    </div>
  );
}
