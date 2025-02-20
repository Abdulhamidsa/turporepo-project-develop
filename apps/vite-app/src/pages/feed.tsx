import { useState } from 'react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/ui/components/ui/tabs';

import SuggestedUsers from '../components/SuggestedUsers';
import PostList from '../features/post/components/PostList';
import { ProjectsAll } from '../features/projects/components/ProjectAll';
import { AddContentButton } from '../features/user/components/AddContentButton';

export default function Feed() {
  const [, setActiveTab] = useState<'posts' | 'projects'>('posts');

  return (
    <div className="bg-background text-foreground flex min-h-screen justify-center">
      {/* Main Container */}
      <div className="container mx-auto flex w-full max-w-5xl gap-6 px-4 py-6">
        {/* Left Column: Feed */}
        <div className="flex w-full flex-col lg:w-2/3">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-primary text-3xl font-bold">Feed</h1>
          </div>

          {/* Add Post/Project Button */}
          <AddContentButton />

          {/* Suggested Users - Shown as horizontal scroll on mobile */}
          <div className="mt-4 block overflow-x-auto lg:hidden">
            <div className="fixed top-0 hidden lg:block">
              <SuggestedUsers layout="horizontal" />
            </div>
          </div>

          {/* Tabs for Posts and Projects */}
          <Tabs defaultValue="posts" className="mt-6 w-full">
            <TabsList className="border-border grid w-full grid-cols-2 overflow-hidden rounded-lg border">
              <TabsTrigger
                value="posts"
                onClick={() => setActiveTab('posts')}
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground h-full text-center"
              >
                Posts
              </TabsTrigger>
              <TabsTrigger
                value="projects"
                onClick={() => setActiveTab('projects')}
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground h-full text-center"
              >
                Projects
              </TabsTrigger>
            </TabsList>

            {/* Scrollable Feed */}
            <TabsContent value="posts" className="mt-6 space-y-6">
              <PostList />
            </TabsContent>
            <TabsContent value="projects" className="mt-6 space-y-6">
              <ProjectsAll />
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Column: Suggested Users (Sticky Sidebar on Desktop) */}
        <div className="hidden w-1/3 lg:block">
          <div className="sticky top-24">
            <SuggestedUsers layout="vertical" />
          </div>
        </div>
      </div>
    </div>
  );
}
