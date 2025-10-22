import { useState } from 'react';

import { Tooltip, TooltipProvider, TooltipTrigger } from '@repo/ui/components/ui/tooltip';
import { FetchedProjectType } from '@repo/zod/validation';
import { UserProfile } from '@repo/zod/validation/user';
import { AnimatePresence, motion } from 'framer-motion';
import { Bot, Plus } from 'lucide-react';

import { useAIChat } from '../../../hooks/useAIChat';
import AIChat from '../../projects/components/AIChat';
import ProjectCard from '../../projects/components/ProjectCard';
import ProjectModal from '../../projects/components/ProjectModal';
import AddProjectModal from '../../projects/components/addProjectModal';

interface ProjectsTabContentProps {
  userProfile: UserProfile;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  projects: any[];
  viewOnly?: boolean;
  selectedProject: FetchedProjectType | null;
  setSelectedProject: (project: FetchedProjectType | null) => void;
}

const ProjectsTabContent = ({
  userProfile,
  projects,
  viewOnly = false,
  selectedProject,
  setSelectedProject,
}: ProjectsTabContentProps) => {
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  const {
    chatStep,
    chatMessages,
    data,
    loading,
    startChat,
    selectProject,
    sendMessage,
    goBack,
    handleConsentGiven,
  } = useAIChat();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="space-y-8"
    >
      {/* Header Section */}
      <div className="text-center space-y-4 mb-12">
        {/* <div className="flex items-center justify-center gap-3">
          <div className="p-3 bg-primary/10 rounded-full">
            <FolderOpen className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              {viewOnly ? `${userProfile.username}'s Projects` : 'Your Projects'}
            </h2>
            <p className="text-muted-foreground text-sm">
              {viewOnly
                ? 'Explore creative works and achievements'
                : 'Showcase your creative works and achievements'}
            </p>
          </div>
        </div> */}

        {/* Stats */}
        {/* <div className="flex items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-full">
            <FolderOpen className="h-4 w-4 text-primary" />
            <span className="font-medium">{projects.length} Projects</span>
          </div>
          {!viewOnly && (
            <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="font-medium text-primary">AI Assisted</span>
            </div>
          )}
        </div> */}
      </div>

      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-primary/20 via-primary to-primary/20 rounded-full" />

      {/* AI Chat Button (for own profile only) */}
      {!viewOnly && (
        <TooltipProvider>
          <Tooltip
            content={
              projects.length === 0 ? 'Add projects to use AI Assistant' : 'AI Project Assistant'
            }
          >
            <TooltipTrigger asChild>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={`fixed bottom-12 right-4 sm:bottom-16 sm:right-6 z-50 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full shadow-lg transition-all duration-200 ${
                  projects.length === 0
                    ? 'bg-muted border-2 border-dashed border-muted-foreground/30 cursor-not-allowed'
                    : 'bg-gradient-to-r from-primary to-primary/80 shadow-primary/25 cursor-pointer'
                }`}
                onClick={() => {
                  if (projects.length > 0) {
                    setChatOpen(true);
                  }
                }}
              >
                <Bot
                  className={`h-5 w-5 sm:h-6 sm:w-6 ${
                    projects.length === 0 ? 'text-muted-foreground/50' : 'text-primary-foreground'
                  }`}
                />
              </motion.button>
            </TooltipTrigger>
          </Tooltip>
        </TooltipProvider>
      )}

      {/* AI Chat Modal */}
      <AnimatePresence>
        {chatOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-4 z-50 flex items-center justify-center sm:inset-auto sm:bottom-20 sm:right-4 sm:top-auto sm:left-auto"
          >
            <AIChat
              {...{
                chatOpen,
                chatStep,
                chatMessages,
                data,
                loading,
                projects,
                userProfilePicture: userProfile.profilePicture || undefined,
                userName: userProfile.username || undefined,
                startChat,
                selectProject,
                sendMessage,
                setChatOpen,
                goBack,
                onConsentGiven: handleConsentGiven,
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Projects Collection */}
      <div className="pt-4">
        {/* Add Project Section (for own profile only) */}
        {!viewOnly && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8"
          >
            <div
              className="group relative flex items-center gap-4 p-6 rounded-2xl border-2 border-dashed border-muted-foreground/20 bg-gradient-to-r from-card/80 to-muted/20 backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:bg-gradient-to-r hover:from-primary/5 hover:to-primary/10 cursor-pointer"
              onClick={() => setIsProjectDialogOpen(true)}
            >
              {/* Icon */}
              <div className="flex-shrink-0 p-4 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
                <Plus className="h-6 w-6 text-primary" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-300 mb-1">
                  Create New Project
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Share your latest work, experiments, or achievements with the community
                </p>
              </div>

              {/* Arrow indicator */}
              {/* <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Sparkles className="h-5 w-5 text-primary" />
              </div> */}
            </div>
          </motion.div>
        )}

        {/* Projects Masonry Layout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="columns-1 md:columns-2 xl:columns-3 2xl:columns-4 gap-6 space-y-6"
        >
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 * (index + 1) }}
              className="break-inside-avoid mb-6"
            >
              <ProjectCard
                project={{
                  ...project,
                }}
                onClick={() => setSelectedProject(project)}
                friendlyId={userProfile.friendlyId ?? ''}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {projects.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center py-16 space-y-6"
          >
            {/* Empty state illustration */}
            {/* <div className="mx-auto w-24 h-24 bg-muted/30 rounded-full flex items-center justify-center">
              <FolderOpen className="h-12 w-12 text-muted-foreground/50" />
            </div> */}

            {/* <div className="space-y-2">
              <h3 className="text-xl font-semibold text-foreground">
                {viewOnly ? 'No Projects Yet' : 'Start Your First Project'}
              </h3>
              <p className="text-muted-foreground text-sm max-w-md mx-auto leading-relaxed">
                {viewOnly
                  ? `${userProfile.username} hasn't shared any projects yet. Check back later!`
                  : 'Ready to showcase your work? Create your first project and let your creativity shine.'}
              </p>
            </div> */}

            {/* {!viewOnly && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsProjectDialogOpen(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full font-medium transition-all duration-200 hover:shadow-lg hover:shadow-primary/25"
              >
                <Plus className="h-4 w-4" />
                Create Project
              </motion.button>
            )} */}
          </motion.div>
        )}
      </div>

      {/* Project Modal */}
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

      {/* Add Project Modal */}
      <AddProjectModal isOpen={isProjectDialogOpen} onClose={() => setIsProjectDialogOpen(false)} />
    </motion.div>
  );
};

export default ProjectsTabContent;
