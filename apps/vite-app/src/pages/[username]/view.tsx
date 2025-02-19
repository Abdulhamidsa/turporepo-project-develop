import { useEffect, useRef, useState } from 'react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/ui/components/ui/tabs';
import { FetchedProjectType } from '@repo/zod/validation';
import 'flag-icon-css/css/flag-icons.min.css';
import { motion } from 'framer-motion';
import { Briefcase, CakeIcon, LucideHome } from 'lucide-react';

import { getCountryFlagIcon } from '../../../utils/generateCountryFlag';
import UserPosts from '../../features/post/components/UserPosts';
import ProjectCard from '../../features/projects/components/ProjectCard';
import ProjectModal from '../../features/projects/components/ProjectModal';
import { useUserProjectsView } from '../../features/projects/hooks/useUserProjectsView';
import { useUserProfileView } from '../../features/user/hooks/useUserProfileView';
import PageTransition from '../../layout/animation/PageTransition';

export default function ProfileViewPage() {
  const [selectedProject, setSelectedProject] = useState<FetchedProjectType | null>(null);
  const { userProfile } = useUserProfileView();

  // const { userProfile } = useUserProfile();

  const { user, projects, isLoading, error } = useUserProjectsView(userProfile.friendlyId ?? '');

  const tabsContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (tabsContentRef.current) {
      const tabContents =
        tabsContentRef.current.querySelectorAll<HTMLDivElement>("[role='tabpanel']");
      let maxHeight = 0;
      tabContents.forEach((tabContent) => {
        maxHeight = Math.max(maxHeight, tabContent.scrollHeight);
      });
      tabsContentRef.current.style.minHeight = `${maxHeight}px`;
    }
  }, [userProfile, projects]);

  return (
    <PageTransition>
      <div className="bg-background flex min-h-screen flex-col items-center justify-start">
        {/* Cover Image Section */}
        <div className="relative h-96 w-full bg-gradient-to-r from-indigo-600 to-purple-700 shadow-lg">
          <img
            src={userProfile.coverImage || '/placeholder.jpg'}
            alt="Cover"
            className="absolute inset-0 h-full w-full object-cover opacity-50"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-center text-white"
            >
              <h1 className="text-4xl font-bold">{userProfile.username}</h1>
              <p className="text-lg">@{userProfile.friendlyId}</p>
            </motion.div>
          </div>
        </div>

        {/* Profile Card Section */}
        <div className="relative mx-auto -mt-24 w-full max-w-5xl rounded-lg bg-white p-6 shadow-lg dark:bg-gray-900">
          <div className="flex flex-col items-center sm:flex-row sm:items-start">
            <div className="relative h-40 w-40 rounded-full border-4 border-white shadow-lg">
              <img
                src={userProfile.profilePicture || '/default-avatar.png'}
                alt="Profile"
                className="h-full w-full rounded-full object-cover"
              />
            </div>

            <div className="mt-6 flex-1 text-center sm:ml-10 sm:mt-0 sm:text-left">
              <h2 className="text-foreground text-3xl font-bold">{userProfile.username}</h2>
              <p className="text-muted-foreground mt-1">{userProfile.bio || 'No bio available'}</p>
              <div className="text-muted-foreground mt-4 space-y-2">
                <p className="flex items-center justify-center sm:justify-start">
                  <Briefcase className="mr-2 h-5 w-5" />
                  {userProfile.profession || 'No profession listed'}
                </p>
                <p className="flex items-center justify-center sm:justify-start">
                  <LucideHome className="mr-2 h-5 w-5" />
                  {userProfile.countryOrigin ? (
                    <span
                      className={`flag-icon flag-icon-${getCountryFlagIcon(userProfile.countryOrigin)}`}
                      style={{ fontSize: '20px' }}
                    ></span>
                  ) : (
                    <span>No country listed</span>
                  )}
                </p>
                <p className="flex items-center justify-center sm:justify-start">
                  <CakeIcon className="mr-2 h-5 w-5" />
                  {userProfile.age ? `${userProfile.age} years old` : 'Age not provided'}
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* Tabs Section */}
        <div className="mt-12 w-full max-w-5xl px-6">
          <Tabs defaultValue="posts">
            <TabsList className="bg-muted flex justify-center overflow-hidden rounded-lg border border-gray-300 dark:border-gray-700">
              <TabsTrigger value="posts" className="flex-1 py-2 text-lg">
                Posts
              </TabsTrigger>
              <TabsTrigger value="projects" className="flex-1 py-2 text-lg">
                Projects
              </TabsTrigger>
            </TabsList>
            <TabsContent value="posts" className="mt-6">
              <UserPosts friendlyId={user?.friendlyId ?? ''} />
            </TabsContent>
            <TabsContent value="projects" className="mt-6">
              {isLoading ? (
                <p className="text-muted-foreground text-center">Loading projects...</p>
              ) : error ? (
                <p className="text-center text-red-500">Failed to load projects.</p>
              ) : projects.length > 0 ? (
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                  {projects.map((project) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      friendlyId={userProfile.friendlyId ?? ''}
                      onClick={() => setSelectedProject(project)}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center">No projects available.</p>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {selectedProject && user && (
        <ProjectModal
          project={selectedProject}
          user={user}
          isOpen={!!selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </PageTransition>
  );
}
