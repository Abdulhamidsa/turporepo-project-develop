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
    <div className="bg-background-muted dark:bg-background text-foreground dark:text-primary-foreground min-h-screen p-4 md:p-8">
      <div className="border-border bg-card dark:bg-muted mx-auto max-w-5xl overflow-hidden rounded-lg border shadow-lg">
        <Suspense fallback={<LoadingSpinner />}>
          <div className="flex flex-col gap-8">
            <ProfileHeader userProfile={userProfile} />
            <ProjectsSection projects={userProjects} />
          </div>
        </Suspense>
      </div>
    </div>
  );
}
