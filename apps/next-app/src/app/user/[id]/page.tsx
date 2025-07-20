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
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-8 px-4">
      <div className="mx-auto max-w-4xl">
        {/* CV-like Paper Background */}
        <div className="bg-white dark:bg-slate-800 shadow-2xl rounded-none border-l-4 border-blue-600 dark:border-blue-400">
          <Suspense fallback={<LoadingSpinner />}>
            <div className="divide-y divide-gray-200 dark:divide-slate-700">
              <ProfileHeader userProfile={userProfile} />
              <ProjectsSection projects={userProjects} />
            </div>
          </Suspense>
        </div>
      </div>
    </div>
  );
}
