'use client';

import { useState } from 'react';

import { AnimatePresence } from 'framer-motion';
import { ChevronRight, Code } from 'lucide-react';
import Image from 'next/image';

import ProjectModal from './ProjectModal';

interface ProjectsSectionProps {
  projects: any[];
}

export default function ProjectsSection({ projects }: ProjectsSectionProps) {
  const [selectedProject, setSelectedProject] = useState(null);

  return (
    <div className="bg-card">
      {/* CV Section Header */}
      <div className="bg-accent/60 px-4 sm:px-8 py-4 sm:py-6 border-b border-border">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary bg-opacity-20 rounded-lg flex items-center justify-center">
            <Code className="w-4 h-4 sm:w-6 sm:h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">PROFESSIONAL PORTFOLIO</h2>
            <p className="text-muted-foreground text-xs sm:text-sm">
              Featured projects and technical achievements
            </p>
          </div>
        </div>
      </div>

      {/* Projects Content */}
      <div className="p-4 sm:p-6 md:p-8">
        {projects.length > 0 ? (
          <div className="grid gap-4 sm:gap-6">
            {projects.map((project: any, index: number) => (
              <div key={project.id} className="relative">
                {/* CV-Style Project Entry */}
                <div
                  className="bg-accent/30 border border-border rounded-lg p-4 sm:p-6 hover:border-primary/50 transition-colors cursor-pointer group"
                  onClick={() => setSelectedProject(project)}
                >
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
                    {/* Project Image */}
                    <div className="lg:col-span-1">
                      <div className="aspect-square rounded-lg overflow-hidden border border-border">
                        <Image
                          src={project.thumbnail || '/placeholder.svg'}
                          alt={project.title}
                          width={200}
                          height={200}
                          className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
                        />
                      </div>
                    </div>

                    {/* Project Details */}
                    <div className="lg:col-span-3 space-y-3 sm:space-y-4">
                      {/* Header */}
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                        <div>
                          <h3 className="text-lg sm:text-xl font-bold group-hover:text-primary transition-colors">
                            {project.title}
                          </h3>
                          <div className="flex items-center gap-2 text-muted-foreground mt-1">
                            <span className="text-xs sm:text-sm font-medium">
                              PROJECT #{String(index + 1).padStart(2, '0')}
                            </span>
                            <span className="w-1 h-1 bg-muted-foreground rounded-full"></span>
                            <span className="text-xs sm:text-sm">Featured Work</span>
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                        {project.description}
                      </p>

                      {/* Technologies */}
                      <div className="space-y-2">
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                          TECHNOLOGIES & SKILLS
                        </h4>
                        <div className="flex flex-wrap gap-1.5 sm:gap-2">
                          {project.tags?.map((tag: any) => (
                            <span
                              key={tag.id}
                              className="px-2 sm:px-3 py-1 bg-card border border-border text-muted-foreground rounded-full text-xs font-medium hover:border-primary/30 transition-colors"
                            >
                              {tag.name}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Action Indicator */}
                      <div className="flex items-center gap-1 text-primary/70 text-xs sm:text-sm">
                        <span>Click to view detailed information</span>
                        <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* CV Timeline Line */}
                {index < projects.length - 1 && (
                  <div className="absolute left-6 bottom-0 w-px h-6 bg-gradient-to-b from-border to-transparent"></div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 sm:py-16">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-accent border border-border rounded-lg flex items-center justify-center mx-auto mb-4">
              <Code className="w-8 h-8 sm:w-10 sm:h-10 text-muted-foreground" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2">No Projects Available</h3>
            <p className="text-muted-foreground text-sm">
              Portfolio projects will be displayed here once added.
            </p>
          </div>
        )}

        <AnimatePresence>
          {selectedProject && (
            <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
