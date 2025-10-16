'use client';

import { useState } from 'react';

import { Badge } from '@repo/ui/components/ui/badge';
import { AnimatePresence } from 'framer-motion';
import { ChevronRight, ExternalLink } from 'lucide-react';
import Image from 'next/image';

import ProjectModal from './ProjectModal';

// Utility function to get project image URL
const getProjectImageUrl = (thumbnail: string, size: number) => {
  return `${thumbnail}?w=${size}&q=75`; // Example logic for generating image URL
};

interface ProjectsSectionProps {
  projects: any[]; // Accept raw project data directly
}

export default function ProjectsSection({ projects }: ProjectsSectionProps) {
  const [selectedProject, setSelectedProject] = useState(null);

  // Using imported utility function for project images

  return (
    <div className="bg-background">
      {/* Projects Content - Modern Clean Design */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 py-8">
        {projects && projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project: any) => (
              <div key={project.id} className="relative">
                {/* Modern Project Card */}
                <div
                  className="bg-card border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer group h-full flex flex-col"
                  onClick={() => setSelectedProject(project)}
                >
                  {/* Project Image with Better Quality */}
                  <div className="relative w-full h-48 overflow-hidden">
                    <Image
                      src={getProjectImageUrl(project.thumbnail, 800)}
                      alt={project.title || 'Project'}
                      fill
                      className="object-cover transition-transform group-hover:scale-105 duration-300"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      quality={90}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    {project.url && (
                      <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="bg-background/90 hover:bg-background p-2 rounded-full flex items-center justify-center shadow-md"
                          aria-label="Visit project website"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Project Content */}
                  <div className="p-5 flex-grow flex flex-col">
                    {/* Title and Tags */}
                    <div className="mb-3">
                      <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-1">
                        {project.title}
                      </h3>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {project.tags?.slice(0, 3).map((tag: any) => (
                          <Badge key={tag.id} variant="secondary" className="text-xs py-0 px-2">
                            {tag.name}
                          </Badge>
                        ))}
                        {project.tags?.length > 3 && (
                          <Badge variant="outline" className="text-xs py-0 px-2">
                            +{project.tags.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-grow">
                      {project.description}
                    </p>

                    {/* Action Button */}
                    <div className="flex items-center justify-end mt-auto pt-2 border-t border-border">
                      <button className="flex items-center gap-1 text-xs sm:text-sm text-primary group-hover:underline">
                        <span>View details</span>
                        <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-card border border-border rounded-xl">
            <div className="w-20 h-20 bg-accent/50 flex items-center justify-center rounded-full mx-auto mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-muted-foreground"
              >
                <rect width="8" height="8" x="8" y="8" rx="1" />
                <path d="M12 2v2" />
                <path d="M12 20v2" />
                <path d="M20 12h2" />
                <path d="M2 12h2" />
                <path d="m17 3-1 1" />
                <path d="m8 3 1 1" />
                <path d="m16 19 1 1" />
                <path d="m7 19 1 1" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">No Projects Yet</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              This portfolio doesn&apos;t have any projects to showcase yet. Check back later for
              updates.
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
