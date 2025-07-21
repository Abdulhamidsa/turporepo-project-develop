'use client';

import { useState } from 'react';

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
      className="px-8 py-12"
    >
      {/* Section Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-1 h-8 bg-primary rounded-full"></div>
          <h2 className="text-3xl font-bold text-foreground tracking-tight">
            Portfolio & Projects
          </h2>
        </div>
        <p className="text-muted-foreground text-lg font-light max-w-2xl">
          A collection of my professional work and personal projects showcasing technical skills and
          creativity.
        </p>
      </div>

      {projects.length > 0 ? (
        <div className="space-y-8">
          {projects.map((project: any, index: number) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group relative"
            >
              {/* Project Card */}
              <div
                className="bg-card shadow-md hover:shadow-lg transition-shadow duration-300 border border-border overflow-hidden cursor-pointer rounded-lg"
                onClick={() => setSelectedProject(project)}
              >
                <div className="lg:flex">
                  {/* Project Image */}
                  <div className="lg:w-1/3 relative overflow-hidden">
                    <div className="aspect-video lg:aspect-square relative">
                      <Image
                        src={project.thumbnail || '/placeholder.svg'}
                        alt={project.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  </div>

                  {/* Project Content */}
                  <div className="lg:w-2/3 p-8">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-card-foreground mb-2 hover:text-primary transition-colors">
                          {project.title}
                        </h3>
                        <div className="flex items-center gap-2 text-primary mb-4">
                          <Code className="w-5 h-5" />
                          <span className="font-medium text-sm uppercase tracking-wide">
                            Project #{index + 1}
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="text-muted-foreground leading-relaxed mb-6 font-light text-lg">
                      {project.description}
                    </p>

                    {/* Technologies Used */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold text-card-foreground uppercase tracking-wide">
                        Technologies Used
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {project.tags.map((tag: any) => (
                          <span
                            key={tag.id}
                            className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-sm font-medium border border-border"
                          >
                            {tag.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Connecting Line for CV Style */}
              {index < projects.length - 1 && (
                <div className="absolute left-8 bottom-0 w-px h-8 bg-gradient-to-b from-border to-transparent"></div>
              )}
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Code className="w-10 h-10 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">No Projects Yet</h3>
          <p className="text-muted-foreground">
            Projects will appear here once they are added to the portfolio.
          </p>
        </div>
      )}

      <AnimatePresence>
        {selectedProject && (
          <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
