'use client';

import React, { useState } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@repo/ui/components/ui/avatar';
import { Badge } from '@repo/ui/components/ui/badge';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ExternalLink, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface ProjectModalProps {
  project: any;
  onClose: () => void;
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  // Use raw data directly from props
  const mediaItems = project.media || [];
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % mediaItems.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + mediaItems.length) % mediaItems.length);
  };

  const displayImage = mediaItems.length > 0 ? mediaItems[currentIndex].url : project.thumbnail;

  // Prevent scrolling when modal is open
  React.useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-2 sm:p-4 md:p-6 overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        transition={{ duration: 0.2 }}
        className="bg-card text-foreground w-full max-w-xs sm:max-w-lg md:max-w-2xl overflow-hidden rounded-lg shadow-lg my-4 sm:my-8 md:my-16"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image Gallery Section */}
        <div className="relative h-44 sm:h-56 md:h-64">
          <Image
            src={displayImage || '/placeholder.svg'}
            alt={project.title || 'Project Image'}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 640px, 800px"
            priority
          />

          {/* Gallery Controls */}
          {mediaItems.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="bg-background/80 hover:bg-background absolute left-2 top-1/2 -translate-y-1/2 rounded-full p-1.5 sm:p-2 shadow-md"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
              <button
                onClick={nextImage}
                className="bg-background/80 hover:bg-background absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1.5 sm:p-2 shadow-md"
                aria-label="Next image"
              >
                <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>

              {/* Image Counter */}
              <div className="absolute bottom-2 right-2 bg-background/70 text-xs px-2 py-1 rounded-md">
                {currentIndex + 1}/{mediaItems.length}
              </div>
            </>
          )}

          {/* Close Button */}
          <button
            onClick={onClose}
            className="bg-background/80 hover:bg-background absolute right-2 top-2 rounded-full p-1.5 shadow-md transition"
            aria-label="Close modal"
          >
            <X className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>

        {/* Content Section - Mobile Friendly */}
        <div className="p-3 sm:p-5 md:p-6 max-h-[60vh] overflow-y-auto">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-1 sm:mb-2">{project.title}</h2>

          <p className="text-muted-foreground text-xs sm:text-sm md:text-base mb-3 md:mb-4">
            {project.description}
          </p>

          {/* Tags - Improved Mobile Layout */}
          <div className="mb-3 md:mb-4 flex flex-wrap gap-1 sm:gap-1.5 md:gap-2">
            {project.tags?.map((tag: any) => (
              <Badge key={tag.id} variant="outline" className="text-xs py-0 px-2 sm:px-3">
                {tag.name}
              </Badge>
            ))}
          </div>

          {/* Links - Better Mobile Sizing */}
          {project.url && (
            <div className="flex flex-wrap gap-2 sm:gap-3 mb-3 md:mb-4">
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-1.5 rounded text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 transition"
              >
                <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4" />
                View Project
              </a>
            </div>
          )}

          {/* User Details - Improved Mobile Layout */}
          {project.user && (
            <div className="mt-3 pt-3 md:mt-4 md:pt-4 border-t border-border flex items-center space-x-2 sm:space-x-3">
              <Link href={`/user/${project.user.friendlyId}`}>
                <Avatar className="h-7 w-7 sm:h-8 sm:w-8 md:h-10 md:w-10">
                  <AvatarImage
                    src={project.user.profilePicture || ''}
                    alt={project.user.username || ''}
                  />
                  <AvatarFallback>
                    {(project.user.username || '').slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Link>
              <div>
                <Link href={`/user/${project.user.friendlyId}`}>
                  <p className="font-medium text-xs sm:text-sm md:text-base">
                    {project.user.username}
                  </p>
                </Link>
                {project.user.profession && (
                  <p className="text-muted-foreground text-xs md:text-sm">
                    {project.user.profession}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
