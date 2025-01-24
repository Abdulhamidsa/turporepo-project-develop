import { useState, useEffect, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/components/ui/tabs";
import { Button } from "@repo/ui/components/ui/button";
import { AlertCircle, Briefcase, CakeIcon, LucideHome, Maximize2 } from "lucide-react";
import { motion } from "framer-motion";
import "flag-icon-css/css/flag-icons.min.css";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@repo/ui/components/ui/dialog";
import PageTransition from "../../layout/animation/PageTransition";
import { useUserProfile } from "../../features/user/hooks/use.user.profile";
import ProjectCard from "../../features/projects/components/ProjectCard";
import ProjectModal from "../../features/projects/components/ProjectModal";
import ProfilePictureEdit from "../../features/user/components/ProfilePicture";
import { getCountryFlagIcon } from "../../../utils/generateCountryFlag";
import { FetchedProjectType } from "@repo/zod/validation";
import CoverImageEdit from "../../features/user/components/CoverImage";
import { useUserProjects } from "../../features/user/hooks/useUserProjects";
import UserPosts from "../../features/post/components/UserPosts";

export default function ProfilePage() {
  const [selectedProject, setSelectedProject] = useState<FetchedProjectType | null>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const { userProfile } = useUserProfile();
  const { projects, error } = useUserProjects();
  const tabsContentRef = useRef<HTMLDivElement>(null);
  const [modalContent, setModalContent] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = () => {
    const missingFields = [];
    if (!userProfile.username) missingFields.push("Username");
    if (!userProfile.profession) missingFields.push("Profession");
    if (!userProfile.countryOrigin) missingFields.push("Country");
    if (!userProfile.age) missingFields.push("Age");
    if (!userProfile.bio) missingFields.push("Bio");
    if (!userProfile.profilePicture) missingFields.push("Profile Picture");
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
    return <p className="text-center text-red-500 mt-8">Failed to load projects. Please try again later.</p>;
  }

  return (
    <PageTransition>
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Profile Incomplete</DialogTitle>
            <DialogDescription>
              <p>Your profile is currently private. To make it public, please complete the following fields:</p>
              <ul className="list-disc list-inside mt-2">
                {modalContent.map((field, index) => (
                  <li key={index}>{field}</li>
                ))}
              </ul>
            </DialogDescription>
          </DialogHeader>
          <Button onClick={() => setShowModal(false)}>Close</Button>
        </DialogContent>
      </Dialog>

      <div className="min-h-screen bg-background">
        {/* Cover Section */}
        <div className="relative h-64 sm:h-80 md:h-96 overflow-hidden">
          <CoverImageEdit label="Cover Image" field="coverImage" />
          {/* <Button className="absolute top-4 left-4 bg-background/80 hover:bg-background" size="icon" onClick={() => setIsFullScreen(true)}>
            <Maximize2 className="h-4 w-4" />
          </Button> */}
        </div>
        {/* Full Screen Cover Image Dialog */}
        <Dialog open={isFullScreen} onOpenChange={setIsFullScreen}>
          <DialogContent className="max-w-full h-full p-0">
            <div className="relative w-full h-full">
              <img src={userProfile.coverImage ?? ""} alt="Cover Image" className="w-full h-full object-cover" />
              <Button className="absolute top-4 right-4 bg-background/80 hover:bg-background" size="icon" onClick={() => setIsFullScreen(false)}>
                <Maximize2 className="h-4 w-4" />
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Profile Details Section */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-32 sm:-mt-40">
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="bg-card relative text-card-foreground rounded-lg shadow-xl p-6 sm:p-8 mb-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-start sm:space-x-8">
              {/* Avatar Section */}
              <div className="flex-shrink-0 flex justify-center mb-6 sm:mb-0">
                <ProfilePictureEdit label="Profile Picture" field="profilePicture" />
              </div>

              {/* Main Content */}
              <div className="flex-1 text-center sm:text-left">
                {!userProfile.completedProfile && (
                  <div className="absolute right-6 top-4">
                    <AlertCircle className="h-8 w-8 text-red-500 cursor-pointer" onClick={handleOpenModal} />
                  </div>
                )}
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">{userProfile.username}</h1>
                <p className="text-lg sm:text-xl text-muted-foreground">@{userProfile?.friendlyId}</p>

                <div className="mt-4 space-y-2">
                  <p className="text-muted-foreground flex items-center justify-center sm:justify-start">
                    <Briefcase className="h-5 w-5 mr-2" />
                    {userProfile.profession || "No profession listed"}
                  </p>
                  <p className="text-muted-foreground flex items-center justify-center sm:justify-start">
                    <LucideHome className="h-5 w-5 mr-2" />
                    {userProfile?.countryOrigin ? <span className={`flag-icon flag-icon-${getCountryFlagIcon(userProfile.countryOrigin)}`} style={{ fontSize: "20px" }}></span> : <span>No country listed</span>}
                  </p>{" "}
                  <div className="text-muted-foreground flex items-center justify-center sm:justify-start">
                    <CakeIcon className="h-5 w-5 mr-2" /> {/* Replace with a better icon if needed */}
                    {userProfile.age ? `${userProfile.age}` : "Age not provided"}
                  </div>
                </div>
                <p className="mt-6 text-foreground">{userProfile.bio || "No bio available"}</p>
              </div>

              {/* Links */}
              {/* <div className="flex flex-col items-center sm:items-end mt-6 sm:mt-0 space-y-4">
                <div className="flex flex-wrap justify-center sm:justify-end space-x-4">
                  <a href="#" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground hover:bg-primary-hover shadow-lg">
                    <FileText className="h-5 w-5" />
                  </a>
                  <a href="#" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground hover:bg-primary-hover shadow-lg">
                    <Globe className="h-5 w-5" />
                  </a>
                </div>
              </div> */}
            </div>
          </motion.div>

          {/* Tabs */}
          <div ref={tabsContentRef}>
            <Tabs defaultValue="posts" className="mt-8">
              <TabsList className="grid w-full grid-cols-2 bg-muted border border-border rounded-lg overflow-hidden">
                <TabsTrigger value="posts">Posts</TabsTrigger>
                <TabsTrigger value="projects">Projects</TabsTrigger>
                {/* <TabsTrigger value="about">About</TabsTrigger> */}
              </TabsList>
              <TabsContent value="posts" className="mt-6">
                <UserPosts friendlyId={userProfile.friendlyId ?? ""} />
              </TabsContent>
              <TabsContent value="projects" className="mt-6">
                {projects.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.map((project) => (
                      <ProjectCard
                        key={project.id}
                        project={{
                          id: project.id,
                          title: project.title,
                          description: project.description,
                          url: project.url ?? "",
                          thumbnail: project.thumbnail,
                          tags: project.tags,
                          media: project.media,
                          createdAt: project.createdAt,
                          updatedAt: project.updatedAt,
                        }}
                        onClick={() => setSelectedProject(project)}
                        friendlyId={userProfile.friendlyId ?? ""}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground p-4 col-span-full">No projects available.</p>
                )}
              </TabsContent>
              {selectedProject && (
                <ProjectModal
                  project={selectedProject}
                  user={{
                    friendlyId: userProfile.friendlyId ?? "",
                    username: userProfile.username ?? "",
                    profilePicture: userProfile.profilePicture ?? "",
                  }}
                  isOpen={!!selectedProject}
                  onClose={() => setSelectedProject(null)}
                />
              )}
              {/* <TabsContent value="about" className="mt-6">
                <AboutMe />
              </TabsContent> */}
            </Tabs>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
