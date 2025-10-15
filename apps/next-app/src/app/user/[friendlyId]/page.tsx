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
  console.log('userProfile', userProfile);
  if (!userProfile) {
    return <p className="text-muted-foreground mt-10 text-center">User profile not found.</p>;
  }

  const userProjects = userProjectResponse?.data?.projects || [];

  return (
    <div className="min-h-screen bg-slate-900 py-8 px-4">
      <div className="mx-auto max-w-5xl">
        {/* CV Document Container */}
        <div className="bg-slate-800 shadow-2xl border border-slate-700 relative overflow-hidden">
          {/* CV Header with Large Letters */}
          <div className="absolute top-4 right-6 text-6xl font-bold text-slate-700/20 select-none">
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
