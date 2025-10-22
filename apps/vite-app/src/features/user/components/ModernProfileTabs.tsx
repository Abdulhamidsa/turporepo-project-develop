import { useState } from 'react';

import { FetchedProjectType } from '@repo/zod/validation';
import { UserProfile } from '@repo/zod/validation/user';
import { AnimatePresence, motion } from 'framer-motion';
import { FileText, FolderOpen } from 'lucide-react';

import PostsTabContent from './PostsTabContent';
import ProjectsTabContent from './ProjectsTabContent';

interface ModernProfileTabsProps {
  userProfile: UserProfile;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  projects: any[];
  viewOnly?: boolean;
}

type TabType = 'posts' | 'projects';

const ModernProfileTabs = ({ userProfile, projects, viewOnly = false }: ModernProfileTabsProps) => {
  const [activeTab, setActiveTab] = useState<TabType>('posts');
  const [selectedProject, setSelectedProject] = useState<FetchedProjectType | null>(null);

  const tabs = [
    {
      id: 'posts' as TabType,
      label: 'Posts',
      icon: FileText,
      count: undefined, // We could add post count here if available
    },
    {
      id: 'projects' as TabType,
      label: 'Projects',
      icon: FolderOpen,
      count: projects.length,
    },
  ];

  return (
    <div className="w-full">
      {/* Modern Tab Navigation */}
      <div className="relative mb-8">
        {/* Tab List */}
        <div className="flex justify-between space-x-1 bg-muted/30 backdrop-blur-sm rounded-full p-1 max-w-md mx-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  relative flex items-center justify-center gap-2 px-6 py-3 rounded-full
                  font-medium text-sm transition-all duration-300 ease-out
                  hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary/20
                  ${
                    isActive
                      ? 'text-primary-foreground shadow-lg shadow-primary/25'
                      : 'text-muted-foreground hover:text-foreground'
                  }
                `}
              >
                {/* Background for active tab */}
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-primary rounded-full"
                    initial={false}
                    transition={{
                      type: 'spring',
                      stiffness: 500,
                      damping: 30,
                    }}
                  />
                )}

                {/* Tab content */}
                <div className="relative flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span
                      className={`
                      px-2 py-0.5 rounded-full text-xs font-semibold
                      ${
                        isActive
                          ? 'bg-primary-foreground/20 text-primary-foreground'
                          : 'bg-muted text-muted-foreground'
                      }
                    `}
                    >
                      {tab.count}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Decorative line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      {/* Tab Content with Animation */}
      <div className="relative min-h-[400px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{
              duration: 0.3,
              ease: 'easeInOut',
            }}
            className="w-full"
          >
            {activeTab === 'posts' && (
              <PostsTabContent userProfile={userProfile} viewOnly={viewOnly} />
            )}

            {activeTab === 'projects' && (
              <ProjectsTabContent
                userProfile={userProfile}
                projects={projects}
                viewOnly={viewOnly}
                selectedProject={selectedProject}
                setSelectedProject={setSelectedProject}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ModernProfileTabs;
