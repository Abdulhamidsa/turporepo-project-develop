'use client';

import { useState } from 'react';

import { AnimatePresence } from 'framer-motion';
import { ChevronRight, Code } from 'lucide-react';
import Image from 'next/image';

import ProjectModal from './ProjectModal';

interface ProjectsSectionProps {
  projects: any[]; // Accept raw project data directly
}

export default function ProjectsSection({ projects }: ProjectsSectionProps) {
  const [selectedProject, setSelectedProject] = useState(null);

  return (
    <div className="bg-card">
      {/* Portfolio Section Header */}
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

      {/* Projects Content - Improved Mobile First Design */}
      <div className="p-3 sm:p-5 md:p-6 lg:p-8">
        {projects && projects.length > 0 ? (
          <div className="grid gap-3 sm:gap-4 md:gap-6">
            {projects.map((project: any, index: number) => (
              <div key={project.id} className="relative">
                {/* Project Entry - Better Mobile Layout */}
                <div
                  className="bg-accent/30 border border-border rounded-lg p-3 sm:p-4 md:p-6 hover:border-primary/50 transition-colors cursor-pointer group"
                  onClick={() => setSelectedProject(project)}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                    {/* Project Image - Better Size Management */}
                    <div className="sm:col-span-1">
                      <div className="aspect-square max-w-[180px] sm:max-w-full mx-auto sm:mx-0 rounded-lg overflow-hidden border border-border">
                        <Image
                          src={project.thumbnail || '/placeholder.svg'}
                          alt={project.title || 'Project Image'}
                          width={200}
                          height={200}
                          className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
                        />
                      </div>
                    </div>

                    {/* Project Details - Better Text Sizing */}
                    <div className="sm:col-span-2 lg:col-span-3 space-y-2 sm:space-y-3 md:space-y-4">
                      {/* Header */}
                      <div>
                        <h3 className="text-base sm:text-lg md:text-xl font-bold group-hover:text-primary transition-colors">
                          {project.title}
                        </h3>
                        <div className="flex items-center gap-2 text-muted-foreground mt-1">
                          <span className="text-xs font-medium">
                            PROJECT #{String(index + 1).padStart(2, '0')}
                          </span>
                          <span className="w-1 h-1 bg-muted-foreground rounded-full"></span>
                          <span className="text-xs">Featured Work</span>
                        </div>
                      </div>

                      {/* Description - Better Line Height Control */}
                      <p className="text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed line-clamp-2 md:line-clamp-3">
                        {project.description}
                      </p>

                      {/* Technologies - More Compact Mobile View */}
                      <div className="space-y-1 md:space-y-2">
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                          TECHNOLOGIES & SKILLS
                        </h4>
                        <div className="flex flex-wrap gap-1 sm:gap-1.5 md:gap-2">
                          {project.tags?.map((tag: any) => (
                            <span
                              key={tag.id}
                              className="px-2 py-0.5 bg-card border border-border text-muted-foreground rounded-full text-xs font-medium hover:border-primary/30 transition-colors"
                            >
                              {tag.name}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Action Indicator */}
                      <div className="flex items-center gap-1 text-primary/70 text-xs">
                        <span>Click to view detailed information</span>
                        <ChevronRight className="w-3 h-3" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 sm:py-12 md:py-16">
            <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-accent border border-border rounded-lg flex items-center justify-center mx-auto mb-4">
              <Code className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-muted-foreground" />
            </div>
            <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-2">
              No Projects Available
            </h3>
            <p className="text-muted-foreground text-xs sm:text-sm">
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
