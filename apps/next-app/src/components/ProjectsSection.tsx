'use client';

import { useState } from 'react';

import { Badge } from '@repo/ui/components/ui/badge';
import { AnimatePresence, motion } from 'framer-motion';
import { Code } from 'lucide-react';
import Image from 'next/image';

import ProjectModal from './ProjectModal';

interface ProjectsSectionProps {
  projects: any[];
}

export default function ProjectsSection({ projects }: ProjectsSectionProps) {
  const [selectedProject, setSelectedProject] = useState(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-foreground dark:text-primary mb-6 flex items-center text-3xl font-bold">
        <Code className="text-primary dark:text-primary-foreground mr-2 h-8 w-8" /> Featured
        Projects
      </h2>

      {projects.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project: any, index: number) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="border-border bg-card dark:bg-muted cursor-pointer rounded-2xl border shadow-md transition-transform hover:scale-105 hover:shadow-lg"
              onClick={() => setSelectedProject(project)}
            >
              <div className="overflow-hidden rounded-t-2xl">
                <Image
                  src={project.thumbnail || '/placeholder.svg'}
                  alt={project.title}
                  width={400}
                  height={200}
                  className="h-48 w-full object-cover"
                />
              </div>
              <div className="p-5">
                <h3 className="text-foreground dark:text-primary-foreground mb-2 text-xl font-bold">
                  {project.title}
                </h3>
                <p className="text-muted-foreground dark:text-muted line-clamp-2 text-sm">
                  {project.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.tags.slice(0, 3).map((tag: any) => (
                    <Badge
                      key={tag.id}
                      variant="secondary"
                      className="bg-muted text-foreground border-border"
                    >
                      {tag.name}
                    </Badge>
                  ))}
                  {project.tags.length > 3 && (
                    <Badge variant="secondary" className="bg-muted text-foreground border-border">
                      +{project.tags.length - 3}
                    </Badge>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground text-center">No projects listed</p>
      )}

      <AnimatePresence>
        {selectedProject && (
          <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
