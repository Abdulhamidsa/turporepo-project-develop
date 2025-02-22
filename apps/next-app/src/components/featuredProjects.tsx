'use client';

import React, { useRef, useState } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@repo/ui/components/ui/avatar';
import { Button } from '@repo/ui/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/components/ui/card';
import { ChevronLeft, ChevronRight, Code, Globe, Layout, PenTool, Server } from 'lucide-react';
import Image from 'next/image';

import ProjectModal from './ProjectModal';

const Objectives = [
  {
    profession: 'Software Engineer',
    objective: 'Software Engineering',
    icon: Code,
    color: 'text-blue-500',
  },
  { profession: 'UI/UX Designer', objective: 'UI/UX Design', icon: Layout, color: 'text-pink-500' },
  {
    profession: 'Web Developer',
    objective: 'Web Development',
    icon: Globe,
    color: 'text-green-500',
  },
  {
    profession: 'Product Designer',
    objective: 'Product Design',
    icon: PenTool,
    color: 'text-purple-500',
  },
  {
    profession: 'DevOps Engineer',
    objective: 'DevOps Engineering',
    icon: Server,
    color: 'text-orange-500',
  },
];

interface Project {
  id: string;
  title: string;
  thumbnail: string;
  description: string;
  tags: { id: string; name: string }[];
  user?: {
    username: string;
    profilePicture?: string;
    profession?: string;
  };
}

interface FeaturedProjectsProps {
  projects: Project[];
}

export const FeaturedProjects: React.FC<FeaturedProjectsProps> = ({ projects }) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const scrollPrev = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: -carouselRef.current.offsetWidth,
        behavior: 'smooth',
      });
    }
  };

  const scrollNext = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: carouselRef.current.offsetWidth,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="bg-background w-full py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-foreground mb-12 text-center text-2xl font-bold md:text-2xl lg:text-4xl">
          Featured Projects
        </h2>
        <div className="relative">
          <div
            ref={carouselRef}
            className="scrollbar-hide flex snap-x snap-mandatory overflow-x-auto"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {projects.length > 0 ? (
              projects.map((project) => {
                const mapping = Objectives.find((m) => m.profession === project.user?.profession);
                return (
                  <div
                    key={project.id}
                    className="w-full flex-shrink-0 snap-start px-2 sm:w-1/2 lg:w-1/3 xl:w-1/4"
                  >
                    <div onClick={() => setSelectedProject(project)} className="cursor-pointer">
                      <Card className="flex h-full flex-col transition-all duration-300 hover:shadow-xl">
                        <Image
                          src={project.thumbnail || '/placeholder.svg'}
                          alt={project.title}
                          width={400}
                          height={300}
                          className="h-48 w-full object-cover"
                        />
                        <CardHeader className="p-4">
                          <CardTitle className="text-lg">{project.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-grow flex-col justify-between p-4">
                          <div>
                            {project.user && (
                              <div className="flex flex-col gap-3">
                                <div className="flex items-center gap-1">
                                  <Avatar className="h-6 w-6">
                                    <AvatarImage
                                      src={project.user.profilePicture || '/placeholder.svg'}
                                      alt={project.user.username}
                                    />
                                    <AvatarFallback>
                                      {project.user.username.slice(0, 2).toUpperCase()}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="text-sm">{project.user.username}</span>
                                </div>
                                <div className="flex items-center gap-1 text-sm">
                                  {mapping ? (
                                    <>
                                      <mapping.icon className={mapping.color} />
                                      <span>{mapping.objective}</span>
                                    </>
                                  ) : (
                                    <span>No objective provided</span>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-muted-foreground text-center">No projects found.</p>
            )}
          </div>
          <Button
            variant="outline"
            size="icon"
            className="bg-background/80 absolute -left-4 top-1/2 z-10 -translate-y-1/2 transform rounded-full shadow-md"
            onClick={scrollPrev}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="bg-background/80 absolute -right-4 top-1/2 z-10 -translate-y-1/2 transform rounded-full shadow-md"
            onClick={scrollNext}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      {selectedProject && (
        <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
      )}
    </section>
  );
};
