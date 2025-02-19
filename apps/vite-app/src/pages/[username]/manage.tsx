import { useEffect, useRef, useState } from 'react';

import 'flag-icon-css/css/flag-icons.min.css';

import AIChat from '../../features/projects/components/AIChat';
import AddProjectModal from '../../features/projects/components/addProjectModal';
import { useAIChat } from '../../features/projects/hooks/useAIChat';
import CoverSection from '../../features/user/components/CoverSection';
import IncompleteProfileDialog from '../../features/user/components/IncompleteProfileDialog';
import ProfileDetails from '../../features/user/components/ProfileDetails';
import ProfileTabs from '../../features/user/components/ProfileTabs';
import { useUserProfile } from '../../features/user/hooks/use.user.profile';
import { useUserProjects } from '../../features/user/hooks/useUserProjects';
import PageTransition from '../../layout/animation/PageTransition';

export default function ProfilePage() {
  const { userProfile } = useUserProfile();
  const { projects, error } = useUserProjects();
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);

  const {
    chatOpen,
    chatStep,
    chatMessages,
    data,
    loading,
    startChat,
    selectProject,
    sendMessage,
    setChatOpen,
    goBack, // Pass this function along!
  } = useAIChat();

  const tabsContentRef = useRef<HTMLDivElement>(null);

  // Incomplete profile handling
  const [modalContent, setModalContent] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = () => {
    const missingFields: string[] = [];
    if (!userProfile.username) missingFields.push('Username');
    if (!userProfile.profession) missingFields.push('Profession');
    if (!userProfile.countryOrigin) missingFields.push('Country');
    if (!userProfile.age) missingFields.push('Age');
    if (!userProfile.bio) missingFields.push('Bio');
    if (!userProfile.profilePicture) missingFields.push('Profile Picture');
    setModalContent(missingFields);
    setShowModal(true);
  };

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

  if (error) {
    return (
      <p className="mt-8 text-center text-red-500">
        Failed to load projects. Please try again later.
      </p>
    );
  }

  return (
    <PageTransition>
      <IncompleteProfileDialog
        showModal={showModal}
        setShowModal={setShowModal}
        modalContent={modalContent}
      />

      <div className="bg-background min-h-screen">
        <CoverSection coverImage={userProfile.coverImage ?? null} />

        <div className="container mx-auto -mt-32 px-4 sm:-mt-40 sm:px-6 lg:px-8">
          <ProfileDetails userProfile={userProfile} onIncompleteProfileClick={handleOpenModal} />

          <div ref={tabsContentRef}>
            <ProfileTabs userProfile={userProfile} projects={projects} />
          </div>
        </div>
      </div>

      <AddProjectModal isOpen={isProjectDialogOpen} onClose={() => setIsProjectDialogOpen(false)} />

      {/* AI Chat System */}
      <AIChat
        chatOpen={chatOpen}
        chatStep={chatStep}
        chatMessages={chatMessages}
        data={data}
        loading={loading}
        projects={projects}
        startChat={startChat}
        selectProject={selectProject}
        sendMessage={sendMessage}
        setChatOpen={setChatOpen}
        goBack={goBack}
      />
    </PageTransition>
  );
}
