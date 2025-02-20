import { useEffect, useRef, useState } from 'react';

import { Button } from '@repo/ui/components/ui/button';
import { Checkbox } from '@repo/ui/components/ui/checkbox';
import { Tooltip, TooltipProvider, TooltipTrigger } from '@repo/ui/components/ui/tooltip';
import { AnimatePresence, motion } from 'framer-motion';
import { Bot, ShieldAlert, X } from 'lucide-react';

import AIChat from '../../features/projects/components/AIChat';
import AddProjectModal from '../../features/projects/components/addProjectModal';
import { useAIChat } from '../../features/projects/hooks/useAIChat';
import CoverSection from '../../features/user/components/CoverSection';
import ProfileDetails from '../../features/user/components/ProfileDetails';
import ProfileTabs from '../../features/user/components/ProfileTabs';
import { useUserProfile } from '../../features/user/hooks/use.user.profile';
import { useUserProjects } from '../../features/user/hooks/useUserProjects';
import PageTransition from '../../layout/animation/PageTransition';

export default function ProfilePage() {
  const { userProfile } = useUserProfile();
  const { projects, error } = useUserProjects();
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);

  // AI states
  const [aiEnabled, setAiEnabled] = useState(false);
  const [showEnablePopup, setShowEnablePopup] = useState(false);
  const [showDisablePopup, setShowDisablePopup] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [chatOpen, setChatOpen] = useState(false); // Fix: AIChat opens properly now

  const { chatStep, chatMessages, data, loading, startChat, selectProject, sendMessage, goBack } =
    useAIChat();

  const tabsContentRef = useRef<HTMLDivElement>(null);

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

  const handleEnableAI = () => {
    setShowEnablePopup(false);
    setAiEnabled(true);
  };

  const handleDisableAI = () => {
    setShowDisablePopup(false);
    setAiEnabled(false);
    setChatOpen(false); // Also close AI chat when disabling
  };

  if (error) {
    return (
      <p className="mt-8 text-center text-red-500">
        Failed to load projects. Please try again later.
      </p>
    );
  }

  return (
    <PageTransition>
      <div className="bg-background min-h-screen">
        <CoverSection coverImage={userProfile.coverImage ?? null} />

        <div className="container mx-auto -mt-32 px-4 sm:-mt-40 sm:px-6 lg:px-8">
          <ProfileDetails userProfile={userProfile} />

          {/* Tabs */}
          <div ref={tabsContentRef}>
            <ProfileTabs
              userProfile={{
                ...userProfile,
                bio: userProfile.bio ?? null,
                username: userProfile.username ?? null,
                countryOrigin: userProfile.countryOrigin ?? null,
                profession: userProfile.profession ?? null,
                friendlyId: userProfile.friendlyId ?? '',
                profilePicture: userProfile.profilePicture ?? null,
                coverImage: userProfile.coverImage ?? null,
                completedProfile: userProfile.completedProfile ?? false,
              }}
              projects={projects}
            />
          </div>
        </div>
      </div>

      {/* Floating AI Toggle Button */}
      <TooltipProvider>
        <Tooltip content={aiEnabled ? 'Disable AI' : 'Enable AI'}>
          <TooltipTrigger asChild>
            <button
              className={`fixed bottom-20 right-4 flex h-12 w-12 items-center justify-center rounded-full shadow-lg transition-transform hover:scale-110 ${
                aiEnabled ? 'bg-green-500' : 'bg-gray-500'
              }`}
              onClick={() => {
                if (!aiEnabled) {
                  setShowEnablePopup(true);
                } else {
                  setShowDisablePopup(true);
                }
              }}
            >
              <ShieldAlert className="h-6 w-6 text-white" />
            </button>
          </TooltipTrigger>
        </Tooltip>
      </TooltipProvider>

      {/* Floating AI Chat Button (Only visible if AI is enabled) */}
      {aiEnabled && (
        <TooltipProvider>
          <Tooltip content="AI Chat">
            <TooltipTrigger asChild>
              <button
                className="bg-primary fixed bottom-4 right-4 flex h-12 w-12 items-center justify-center rounded-full shadow-lg transition-transform hover:scale-110"
                onClick={() => setChatOpen(true)}
              >
                <Bot className="h-6 w-6 text-white" />
              </button>
            </TooltipTrigger>
          </Tooltip>
        </TooltipProvider>
      )}

      {/* Enable AI Popup */}
      <AnimatePresence>
        {showEnablePopup && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-24 right-4 w-64 rounded-lg bg-white p-4 shadow-lg"
          >
            <h2 className="text-md font-semibold">Enable AI Chat?</h2>
            <p className="text-sm text-gray-600">AI will assist you with your projects.</p>
            <div className="mt-3 flex items-center space-x-2">
              <Checkbox
                id="accept-terms"
                checked={acceptedTerms}
                onCheckedChange={() => setAcceptedTerms(!acceptedTerms)}
              />
              <label htmlFor="accept-terms" className="cursor-pointer text-sm">
                I accept the terms
              </label>
            </div>
            <div className="mt-3 flex justify-end space-x-2">
              <Button variant="outline" size="sm" onClick={() => setShowEnablePopup(false)}>
                Cancel
              </Button>
              <Button size="sm" disabled={!acceptedTerms} onClick={handleEnableAI}>
                Enable
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Disable AI Popup */}
      <AnimatePresence>
        {showDisablePopup && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-24 right-4 w-64 rounded-lg bg-white p-4 shadow-lg"
          >
            <h2 className="text-md font-semibold text-red-600">Disable AI Chat?</h2>
            <p className="text-sm text-gray-600">You can enable it again anytime.</p>
            <div className="mt-3 flex justify-end space-x-2">
              <Button variant="outline" size="sm" onClick={() => setShowDisablePopup(false)}>
                Cancel
              </Button>
              <Button size="sm" className="bg-red-500 text-white" onClick={handleDisableAI}>
                Disable
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Chat Drawer */}
      <AnimatePresence>
        {chatOpen && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className="fixed bottom-0 right-4 w-[350px] overflow-hidden rounded-lg bg-white shadow-lg"
          >
            <div className="bg-primary flex items-center justify-between px-4 py-2 text-white">
              <h3 className="text-md font-semibold">AI Chat</h3>
              <button onClick={() => setChatOpen(false)}>
                <X className="h-5 w-5 text-white" />
              </button>
            </div>
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

      {/* Add Project Modal */}
      <AddProjectModal isOpen={isProjectDialogOpen} onClose={() => setIsProjectDialogOpen(false)} />
    </PageTransition>
  );
}
