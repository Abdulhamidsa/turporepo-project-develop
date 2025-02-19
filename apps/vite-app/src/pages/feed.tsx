import { useState } from 'react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/ui/components/ui/tabs';

import PostList from '../features/post/components/PostList';
import { ProjectsAll } from '../features/projects/components/ProjectAll';
import { AddContentButton } from '../features/user/components/AddContentButton';

export default function Feed() {
  const [, setActiveTab] = useState<'posts' | 'projects'>('posts');

  return (
    <div className="bg-background text-foreground min-h-screen">
      <div className="container mx-auto max-w-2xl p-4">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-primary text-3xl font-bold">Feed</h1>
        </div>

        {/* Add Post/Project Section */}
        <AddContentButton />

        {/* Tabs for Posts and Projects */}
        <Tabs defaultValue="posts" className="mt-6 w-full">
          <TabsList className="bg-muted border-border grid w-full grid-cols-2 overflow-hidden rounded-lg border p-0">
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
