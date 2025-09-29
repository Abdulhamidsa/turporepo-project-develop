import { useEffect, useRef, useState } from 'react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/ui/components/ui/tabs';
import { FetchedProjectType } from '@repo/zod/validation';
import { AlertCircle } from 'lucide-react';
import { useParams } from 'react-router-dom';

import ProfileCardView from '../../../components/ProfileCardView';
import UserPosts from '../../../features/post/components/UserPosts';
import ProjectCard from '../../../features/projects/components/ProjectCard';
import ProjectModal from '../../../features/projects/components/ProjectModal';
import { useUserProfileView } from '../../../features/user/hooks/useUserProfileView';
import { useUserProjectsView } from '../../../hooks/useUserProjectsView';
import PageTransition from '../../../layout/animation/PageTransition';

function GetCorrectHeight() {
  const { userProfile } = useUserProfileView();
  const { projects } = useUserProjectsView(userProfile.friendlyId ?? '');

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
}

export default function ProfessionalProfileView() {
  const [selectedProject, setSelectedProject] = useState<FetchedProjectType | null>(null);
  const [redirecting, setRedirecting] = useState(false);
  const { userProfile, error: profileError, isLoading: profileLoading } = useUserProfileView();
  GetCorrectHeight();

  // Get current URL parameter
  const { friendlyId } = useParams<{ friendlyId: string }>();

  // Handle user not found - redirect to main page
  useEffect(() => {
    // Log debug info to help troubleshoot
    console.log('Profile debug:', {
      friendlyId,
      profileLoading,
      profileError,
      hasUsername: !!userProfile?.username,
      userProfile,
    });

    // Check if profile load is complete and profile doesn't have required data
    if (!profileLoading && !profileError && !userProfile?.username && friendlyId) {
      // Store the attempted ID
      localStorage.setItem('lastAttemptedProfile', friendlyId);
      console.log('Redirecting due to missing profile data for:', friendlyId);
      setRedirecting(true);

      // Set a timeout for redirection
      const timer = setTimeout(() => {
        // Use history API for a smoother navigation
        window.location.href = '/';
      }, 3000); // Reduced to 3 seconds for better UX

      return () => clearTimeout(timer);
    }
  }, [profileLoading, profileError, userProfile, friendlyId]);

  const { user, projects, isLoading, error } = useUserProjectsView(userProfile.friendlyId ?? '');

  // If redirecting, show a message
  if (redirecting) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center">
        <div className="text-center p-8 max-w-md bg-card rounded-lg shadow-lg border border-muted">
          <div className="inline-block p-4 bg-amber-100 dark:bg-amber-900/30 rounded-full mb-4">
            <AlertCircle className="w-10 h-10 text-amber-500" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-4">User Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The user profile "{friendlyId}" doesn't exist or has been removed.
          </p>
          <p className="text-muted-foreground">
            You will be redirected to the main page in seconds...
          </p>
          <button
            onClick={() => (window.location.href = '/')}
            className="mt-6 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Go to Home Page Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="bg-background flex min-h-screen flex-col items-center justify-start">
        {/* Cover Image Section */}
        <div className="from-card to-primary-foreground relative h-96 w-full bg-gradient-to-r shadow-lg">
          <img
            src={userProfile.coverImage || '/placeholder.png'}
            alt="Cover"
            className="absolute inset-0 h-full w-full object-cover opacity-50"
          />
        </div>

        {/* Profile Card Section */}

        <ProfileCardView />

        {/* Tabs Section */}
        <div className="mt-12 w-full max-w-5xl px-6">
          <Tabs defaultValue="posts">
            <TabsList className="bg-muted flex justify-center overflow-hidden rounded-lg border border-gray-300 dark:border-gray-700">
              <TabsTrigger
                value="posts"
                className="text-md flex-1 data-[state=active]:border-b-2 data-[state=active]:border-red-500"
              >
                Posts
              </TabsTrigger>
              <TabsTrigger
                value="projects"
                className="text-md flex-1 data-[state=active]:border-b-2 data-[state=active]:border-red-500"
              >
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
