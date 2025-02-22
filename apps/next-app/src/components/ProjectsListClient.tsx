'use client';

import React, { useState } from 'react';

import { Badge } from '@repo/ui/components/ui/badge';
import { Button } from '@repo/ui/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/components/ui/card';
import { Code, Globe, Layout, PenTool, Server } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import ProjectModal from './ProjectModal';

export const Objectives = [
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

interface ProjectsListClientProps {
  projects: any[];
  page: number;
  totalPages: number;
  search: string;
}

export default function ProjectsListClient({
  projects,
  page,
  totalPages,
  search,
}: ProjectsListClientProps) {
  const [selectedProject, setSelectedProject] = useState<any>(null);

  const handleOpen = (project: any) => {
    setSelectedProject(project);
  };

  const handleClose = () => {
    setSelectedProject(null);
  };

  return (
    <>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.length > 0 ? (
          projects.map((project) => {
            const userProfession = project.user?.profession;
            const mapping = Objectives.find((o) => o.profession === userProfession);
            return (
              <Card
                key={project.id}
                className="cursor-pointer overflow-hidden"
                onClick={() => handleOpen(project)}
              >
                <Image
                  src={project.thumbnail}
                  alt={project.title}
                  width={400}
                  height={300}
                  className="h-48 w-full object-cover"
                />
                <CardHeader className="p-4">
                  <CardTitle className="text-lg">{project.title}</CardTitle>
                  <div className="mt-1 flex items-center gap-1 text-sm">
                    {mapping ? (
                      <>
                        <mapping.icon className={mapping.color} />
                        <span>{mapping.objective}</span>
                      </>
                    ) : (
                      <span>No objective provided</span>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag: any) => (
                      <Badge key={tag.id} variant="secondary" className="border-border bg-muted">
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <p className="text-muted-foreground text-center">No projects found.</p>
        )}
      </div>

      {selectedProject && <ProjectModal project={selectedProject} onClose={handleClose} />}

      <div className="mt-8 flex justify-center space-x-2">
        {page > 1 && (
          <Link href={`/projects?page=${page - 1}&search=${search}`}>
            <Button>Previous</Button>
          </Link>
        )}
        {page < totalPages && (
          <Link href={`/projects?page=${page + 1}&search=${search}`}>
            <Button>Next</Button>
          </Link>
        )}
      </div>
      <p className="mt-4 text-center">
        Page {page} of {totalPages}
      </p>
    </>
  );
}
