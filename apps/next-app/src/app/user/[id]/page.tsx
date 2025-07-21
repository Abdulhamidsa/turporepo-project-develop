import { Suspense } from 'react';

import LoadingSpinner from '../../../components/LoadingSpinner';
import ProfileHeader from '../../../components/ProfileHeader';
import ProjectsSection from '../../../components/ProjectsSection';
import { getUserProfile, getUserProject } from '../../../lib/api';

export const dynamic = 'force-dynamic';

interface PublicProfilePageProps {
  params: { id: string };
}

export default async function PublicProfilePage({ params }: PublicProfilePageProps) {
  const id = params.id;

  const userProfile = await getUserProfile(id);
  const userProjectResponse = await getUserProject(id);

  if (!userProfile) {
    return <p className="text-muted-foreground mt-10 text-center">User profile not found.</p>;
  }

  const userProjects = userProjectResponse?.data?.projects || [];

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="mx-auto max-w-4xl">
        {/* CV-like Paper Background */}
        <div className="bg-card shadow-2xl rounded-none border-l-4 border-primary">
          <Suspense fallback={<LoadingSpinner />}>
            <div className="divide-y divide-border">
              <ProfileHeader userProfile={userProfile} />
              <ProjectsSection projects={userProjects} />
            </div>
          </Suspense>
        </div>
      </div>
    </div>
  );
}
