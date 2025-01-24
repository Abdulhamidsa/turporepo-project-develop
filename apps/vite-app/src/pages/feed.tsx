import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/components/ui/tabs";
import PostList from "../features/post/components/PostList";
import { ProjectsAll } from "../features/projects/components/ProjectAll";
import { AddContentButton } from "../features/user/components/AddContentButton";

export default function Feed() {
  const [, setActiveTab] = useState<"posts" | "projects">("posts");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto p-4 max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-primary">Feed</h1>
        </div>

        {/* Add Post/Project Section */}
        <AddContentButton />

        {/* Tabs for Posts and Projects */}
        <Tabs defaultValue="posts" className="w-full mt-6">
          <TabsList className="grid w-full p-0 grid-cols-2 bg-muted border border-border rounded-lg overflow-hidden">
            <TabsTrigger value="posts" onClick={() => setActiveTab("posts")} className="data-[state=active]:bg-primary h-full data-[state=active]:text-primary-foreground text-center">
              Posts
            </TabsTrigger>
            <TabsTrigger value="projects" onClick={() => setActiveTab("projects")} className="data-[state=active]:bg-primary h-full data-[state=active]:text-primary-foreground text-center">
              Projects
            </TabsTrigger>
          </TabsList>
          <TabsContent value="posts" className="mt-6">
            <PostList />
          </TabsContent>
          <TabsContent value="projects" className="mt-6">
            <ProjectsAll />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
