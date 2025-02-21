'use client';

import type React from 'react';
import { useRef } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@repo/ui/components/ui/avatar';
import { Badge } from '@repo/ui/components/ui/badge';
import { Button } from '@repo/ui/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/components/ui/card';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface Project {
  id: string;
  title: string;
  thumbnail: string;
  description: string;
  tags: { id: string; name: string }[];
  user?: {
    username: string;
    profilePicture?: string;
  };
}

interface FeaturedProjectsProps {
  projects: Project[];
}

export const FeaturedProjects: React.FC<FeaturedProjectsProps> = ({ projects }) => {
  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollPrev = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -carouselRef.current.offsetWidth, behavior: 'smooth' });
    }
  };

  const scrollNext = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: carouselRef.current.offsetWidth, behavior: 'smooth' });
    }
  };

  return (
    <section className="bg-background w-full py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-foreground mb-12 text-center text-4xl font-bold">Featured Projects</h2>
        <div className="relative">
          <div
            ref={carouselRef}
            className="scrollbar-hide flex snap-x snap-mandatory overflow-x-auto"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {projects.map((project) => (
              <div
                key={project.id}
                className="w-full flex-shrink-0 snap-start px-2 sm:w-1/2 lg:w-1/3 xl:w-1/4"
              >
                <Card className="flex h-full flex-col">
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
                      <div className="mb-2 flex items-center space-x-2">
                        {project.user && (
                          <Avatar className="h-6 w-6">
                            <AvatarImage
                              src={project.user.profilePicture || ''}
                              alt={project.user.username}
                            />
                            <AvatarFallback>
                              {project.user.username.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        {project.user && <span className="text-sm">{project.user.username}</span>}
                      </div>
                      <p className="text-muted-foreground mb-4 line-clamp-2 text-sm">
                        {project.description}
                      </p>
                      <div className="mb-4 flex flex-wrap gap-2">
                        {project.tags.map((tag) => (
                          <Badge key={tag.id} variant="secondary">
                            {tag.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Link href={`/projects/${project.id}`}>
                      <Button variant="outline" className="mt-auto w-full">
                        View Details
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            ))}
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
    </section>
  );
};
