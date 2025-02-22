import { useEffect, useRef, useState } from 'react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/ui/components/ui/tabs';
import { Tooltip, TooltipProvider, TooltipTrigger } from '@repo/ui/components/ui/tooltip';
import { FetchedProjectType } from '@repo/zod/validation';
import { UserProfile } from '@repo/zod/validation/user';
import { AnimatePresence, motion } from 'framer-motion';
import { Bot, Plus } from 'lucide-react';

import UserPosts from '../../post/components/UserPosts';
import AIChat from '../../projects/components/AIChat';
import ProjectCard from '../../projects/components/ProjectCard';
import ProjectModal from '../../projects/components/ProjectModal';
import AddProjectModal from '../../projects/components/addProjectModal';
import { useAIChat } from '../../projects/hooks/useAIChat';

interface ProfileTabsProps {
  userProfile: UserProfile;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  projects: any[];
}

const ProfileTabs = ({ userProfile, projects }: ProfileTabsProps) => {
  const [selectedProject, setSelectedProject] = useState<FetchedProjectType | null>(null);
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);
  const tabsContentRef = useRef<HTMLDivElement>(null);
  const { chatStep, chatMessages, data, loading, startChat, selectProject, sendMessage, goBack } =
    useAIChat();
  const [chatOpen, setChatOpen] = useState(false);

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

  return (
    <>
      <div ref={tabsContentRef}>
        <Tabs defaultValue="posts" className="mt-8">
          <TabsList className="bg-muted border-border grid w-full grid-cols-2 overflow-hidden rounded-lg border">
            <TabsTrigger
              value="posts"
              className="data-[state=active]:border-b-2 data-[state=active]:border-red-500"
            >
              Posts
            </TabsTrigger>
            <TabsTrigger
              value="projects"
              className="data-[state=active]:border-b-2 data-[state=active]:border-red-500"
            >
              Projects
            </TabsTrigger>
          </TabsList>
          <TabsContent value="posts" className="mt-6">
            <div className="">
              <UserPosts friendlyId={userProfile.friendlyId ?? ''} />
            </div>
          </TabsContent>
          <TabsContent value="projects" className="mt-6">
            <TooltipProvider>
              <Tooltip content="AI Chat">
                <TooltipTrigger asChild>
                  <button
                    className="bg-primary fixed bottom-16 right-3 z-50 flex h-12 w-12 items-center justify-center rounded-full shadow-lg transition-transform hover:scale-110"
                    onClick={() => setChatOpen(true)}
                  >
                    <Bot className="h-6 w-6 text-white" />
                  </button>
                </TooltipTrigger>
              </Tooltip>
            </TooltipProvider>
            {/* AI Chat Drawer */}
            <AnimatePresence>
              {chatOpen && (
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  className="fixed bottom-16 right-4 z-50 w-[350px] overflow-hidden rounded-lg bg-white shadow-lg"
                >
                  <AIChat
                    {...{
                      chatOpen,
                      chatStep,
                      chatMessages,
                      data,
                      loading,
                      projects,
                      startChat,
                      selectProject,
                      sendMessage,
                      setChatOpen,
                      goBack,
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div
                className="bg-card hover:bg-primary-foreground group relative flex h-full w-full items-center justify-center rounded-lg border p-4 transition duration-300 ease-in-out hover:cursor-pointer"
                onClick={() => setIsProjectDialogOpen(true)}
              >
                <Plus className="text-primary-foreground h-52 w-12 opacity-100 transition-all duration-300 ease-in-out group-hover:opacity-0" />
                <span className="text-card absolute text-lg font-semibold opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100">
                  Add Project
                </span>
              </div>

              {projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={{
                    ...project,
                    url: project.url ?? '',
                  }}
                  onClick={() => setSelectedProject(project)}
                  friendlyId={userProfile.friendlyId ?? ''}
                />
              ))}
            </div>
            {projects.length === 0 && (
              <p className="text-muted-foreground col-span-full p-4 text-center">
                No projects available.
              </p>
            )}
          </TabsContent>
          {selectedProject && (
            <ProjectModal
              project={selectedProject}
              user={{
                friendlyId: userProfile.friendlyId ?? '',
                username: userProfile.username ?? '',
                profilePicture: userProfile.profilePicture ?? '',
              }}
              isOpen={!!selectedProject}
              onClose={() => setSelectedProject(null)}
            />
          )}
        </Tabs>
      </div>
      <AddProjectModal isOpen={isProjectDialogOpen} onClose={() => setIsProjectDialogOpen(false)} />
    </>
  );
};

export default ProfileTabs;
