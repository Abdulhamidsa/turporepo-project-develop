'use client';

import React, { useState } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@repo/ui/components/ui/avatar';
import { Badge } from '@repo/ui/components/ui/badge';
import { Button } from '@repo/ui/components/ui/button';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ExternalLink, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { getProfileImageUrl, getProjectMediaUrl } from '../utils/imageOptimization';

interface ProjectModalProps {
  project: any;
  onClose: () => void;
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  const mediaItems = project.media || [];
  const [currentIndex, setCurrentIndex] = useState(0);

  // Using imported utility functions for image optimization

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % mediaItems.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + mediaItems.length) % mediaItems.length);
  };

  const displayImage =
    mediaItems.length > 0
      ? getProjectMediaUrl(mediaItems[currentIndex].url)
      : getProjectMediaUrl(project.thumbnail);

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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="bg-card text-foreground w-full max-w-md sm:max-w-xl md:max-w-3xl overflow-hidden rounded-xl shadow-xl my-4 sm:my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col md:flex-row h-full">
          {/* Image Gallery Section - Improved Layout */}
          <div className="relative w-full md:w-1/2 h-60 sm:h-72 md:h-auto">
            <Image
              src={displayImage}
              alt={project.title || 'Project Image'}
              fill
              className="object-cover md:object-contain bg-black"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
              quality={95}
            />

            {/* Gallery Controls - Improved */}
            {mediaItems.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="bg-background/80 hover:bg-background absolute left-2 top-1/2 -translate-y-1/2 rounded-full p-2 shadow-md transition-transform hover:scale-105"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={nextImage}
                  className="bg-background/80 hover:bg-background absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-2 shadow-md transition-transform hover:scale-105"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>

                {/* Image Counter - Better Styling */}
                <div className="absolute bottom-3 right-3 bg-background/80 text-sm px-2.5 py-1 rounded-md font-medium">
                  {currentIndex + 1}/{mediaItems.length}
                </div>
              </>
            )}

            {/* Close Button - Enhanced */}
            <button
              onClick={onClose}
              className="bg-background/80 hover:bg-background absolute right-3 top-3 rounded-full p-2 shadow-md transition-transform hover:scale-105"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content Section - Improved Layout & Spacing */}
          <div className="md:w-1/2 p-5 sm:p-6 max-h-[60vh] md:max-h-[80vh] md:overflow-y-auto">
            <h2 className="text-xl sm:text-2xl font-bold mb-2">{project.title}</h2>

            <p className="text-muted-foreground text-sm sm:text-base mb-4">{project.description}</p>

            {/* Tags - Better Layout */}
            <div className="mb-5">
              <h3 className="text-sm font-medium mb-2">Technologies</h3>
              <div className="flex flex-wrap gap-2">
                {project.tags?.map((tag: any) => (
                  <Badge key={tag.id} variant="secondary" className="px-2.5 py-0.5">
                    {tag.name}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Links - Enhanced */}
            {project.url && (
              <div className="mb-5">
                <h3 className="text-sm font-medium mb-2">Project Links</h3>
                <Button asChild variant="default" className="w-full sm:w-auto">
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    View Live Project
                  </a>
                </Button>
              </div>
            )}

            {/* User Details - Enhanced with Card */}
            {project.user && (
              <div className="mt-4 pt-4 border-t border-border">
                <h3 className="text-sm font-medium mb-3">Project Creator</h3>
                <Link
                  href={`/user/${project.user.friendlyId}`}
                  className="flex items-center gap-3 p-3 rounded-lg bg-accent/50 hover:bg-accent transition-colors"
                >
                  <Avatar className="h-10 w-10 border-2 border-background">
                    <AvatarImage
                      src={getProfileImageUrl(project.user.profilePicture, 100)}
                      alt={project.user.username || ''}
                    />
                    <AvatarFallback className="bg-primary/20 text-primary">
                      {(project.user.username || '').slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{project.user.username}</p>
                    {project.user.profession && (
                      <p className="text-muted-foreground text-sm">{project.user.profession}</p>
                    )}
                  </div>
                </Link>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
