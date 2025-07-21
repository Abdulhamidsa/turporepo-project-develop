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
    <div className="bg-slate-800">
      {/* CV Section Header */}
      <div className="bg-slate-750 px-8 py-6 border-b border-slate-600">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Code className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">PROFESSIONAL PORTFOLIO</h2>
            <p className="text-slate-400 text-sm">Featured projects and technical achievements</p>
          </div>
        </div>
      </div>

      {/* Projects Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-8"
      >
        {projects.length > 0 ? (
          <div className="grid gap-6">
            {projects.map((project: any, index: number) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                {/* CV-Style Project Entry */}
                <div
                  className="bg-slate-700 border border-slate-600 rounded-lg p-6 hover:border-indigo-500 transition-colors cursor-pointer group"
                  onClick={() => setSelectedProject(project)}
                >
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Project Image */}
                    <div className="lg:col-span-1">
                      <div className="aspect-square rounded-lg overflow-hidden border border-slate-600">
                        <Image
                          src={project.thumbnail || '/placeholder.svg'}
                          alt={project.title}
                          width={200}
                          height={200}
                          className="w-full h-full object-cover group-hover:opacity-75 transition-opacity"
                        />
                      </div>
                    </div>

                    {/* Project Details */}
                    <div className="lg:col-span-3 space-y-4">
                      {/* Header */}
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                        <div>
                          <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">
                            {project.title}
                          </h3>
                          <div className="flex items-center gap-2 text-indigo-400 mt-1">
                            <span className="text-sm font-medium">
                              PROJECT #{String(index + 1).padStart(2, '0')}
                            </span>
                            <span className="w-1 h-1 bg-indigo-400 rounded-full"></span>
                            <span className="text-sm text-slate-400">Featured Work</span>
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-slate-300 leading-relaxed">{project.description}</p>

                      {/* Technologies */}
                      <div className="space-y-2">
                        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                          TECHNOLOGIES & SKILLS
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {project.tags.map((tag: any) => (
                            <span
                              key={tag.id}
                              className="px-3 py-1 bg-slate-800 border border-slate-600 text-slate-300 rounded-full text-xs font-medium hover:border-indigo-500 transition-colors"
                            >
                              {tag.name}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Action Indicator */}
                      <div className="flex items-center gap-2 text-slate-500 text-sm">
                        <span>Click to view detailed information</span>
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CV Timeline Line */}
                {index < projects.length - 1 && (
                  <div className="absolute left-6 bottom-0 w-px h-6 bg-gradient-to-b from-slate-600 to-transparent"></div>
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-slate-700 border border-slate-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Code className="w-10 h-10 text-slate-500" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No Projects Available</h3>
            <p className="text-slate-400">Portfolio projects will be displayed here once added.</p>
          </div>
        )}

        <AnimatePresence>
          {selectedProject && (
            <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
