import { useEffect, useRef, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/components/ui/tabs";
import { Briefcase, CakeIcon, LucideHome } from "lucide-react";
import { motion } from "framer-motion";
import "flag-icon-css/css/flag-icons.min.css";
import PageTransition from "../../layout/animation/PageTransition";
import { useUserProfileView } from "../../features/user/hooks/useUserProfileView";
import ProjectCard from "../../features/projects/components/ProjectCard";
import ProjectModal from "../../features/projects/components/ProjectModal";
import { getCountryFlagIcon } from "../../../utils/generateCountryFlag";
import { FetchedProjectType } from "@repo/zod/validation";
import UserPosts from "../../features/post/components/UserPosts";
import { useUserProjectsView } from "../../features/projects/hooks/useUserProjectsView";

export default function ProfileViewPage() {
  const [selectedProject, setSelectedProject] = useState<FetchedProjectType | null>(null);
  const { userProfile } = useUserProfileView();

  const { user, projects, isLoading, error } = useUserProjectsView(userProfile.friendlyId ?? "");

  const tabsContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (tabsContentRef.current) {
      const tabContents = tabsContentRef.current.querySelectorAll<HTMLDivElement>("[role='tabpanel']");
      let maxHeight = 0;
      tabContents.forEach((tabContent) => {
        maxHeight = Math.max(maxHeight, tabContent.scrollHeight);
      });
      tabsContentRef.current.style.minHeight = `${maxHeight}px`;
    }
  }, [userProfile, projects]);

  return (
    <PageTransition>
      <div className="min-h-screen bg-background flex flex-col items-center justify-start">
        {/* Cover Image Section */}
        <div className="relative w-full h-96 bg-gradient-to-r from-indigo-600 to-purple-700 shadow-lg">
          <img src={userProfile.coverImage || "/default-cover.jpg"} alt="Cover" className="absolute inset-0 w-full h-full object-cover opacity-50" />
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="text-white text-center">
              <h1 className="text-4xl font-bold">{userProfile.username}</h1>
              <p className="text-lg">@{userProfile.friendlyId}</p>
            </motion.div>
          </div>
        </div>

        {/* Profile Card Section */}
        <div className="relative -mt-24 w-full max-w-5xl mx-auto p-6 rounded-lg bg-white dark:bg-gray-900 shadow-lg">
          <div className="flex flex-col sm:flex-row items-center sm:items-start">
            <div className="relative w-40 h-40 rounded-full border-4 border-white shadow-lg">
              <img src={userProfile.profilePicture || "/default-avatar.png"} alt="Profile" className="w-full h-full object-cover rounded-full" />
            </div>

            <div className="flex-1 text-center sm:text-left mt-6 sm:mt-0 sm:ml-10">
              <h2 className="text-3xl font-bold text-foreground">{userProfile.username}</h2>
              <p className="text-muted-foreground mt-1">{userProfile.bio || "No bio available"}</p>
              <div className="mt-4 space-y-2 text-muted-foreground">
                <p className="flex items-center justify-center sm:justify-start">
                  <Briefcase className="h-5 w-5 mr-2" />
                  {userProfile.profession || "No profession listed"}
                </p>
                <p className="flex items-center justify-center sm:justify-start">
                  <LucideHome className="h-5 w-5 mr-2" />
                  {userProfile.countryOrigin ? <span className={`flag-icon flag-icon-${getCountryFlagIcon(userProfile.countryOrigin)}`} style={{ fontSize: "20px" }}></span> : <span>No country listed</span>}
                </p>
                <p className="flex items-center justify-center sm:justify-start">
                  <CakeIcon className="h-5 w-5 mr-2" />
                  {userProfile.age ? `${userProfile.age} years old` : "Age not provided"}
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* Tabs Section */}
        <div className="w-full max-w-5xl mt-12 px-6">
          <Tabs defaultValue="posts">
            <TabsList className="flex justify-center border border-gray-300 dark:border-gray-700 rounded-lg bg-muted overflow-hidden">
              <TabsTrigger value="posts" className="flex-1 py-2 text-lg">
                Posts
              </TabsTrigger>
              <TabsTrigger value="projects" className="flex-1 py-2 text-lg">
                Projects
              </TabsTrigger>
            </TabsList>
            <TabsContent value="posts" className="mt-6">
              <UserPosts friendlyId={user?.friendlyId ?? ""} />
            </TabsContent>
            <TabsContent value="projects" className="mt-6">
              {isLoading ? (
                <p className="text-center text-muted-foreground">Loading projects...</p>
              ) : error ? (
                <p className="text-center text-red-500">Failed to load projects.</p>
              ) : projects.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {projects.map((project) => (
                    <ProjectCard key={project.id} project={project} friendlyId={userProfile.friendlyId ?? ""} onClick={() => setSelectedProject(project)} />
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground">No projects available.</p>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {selectedProject && user && <ProjectModal project={selectedProject} user={user} isOpen={!!selectedProject} onClose={() => setSelectedProject(null)} />}
    </PageTransition>
  );
}
