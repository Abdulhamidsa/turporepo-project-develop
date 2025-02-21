'use client';

import React, { useEffect, useState } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@repo/ui/components/ui/avatar';
import { Badge } from '@repo/ui/components/ui/badge';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface ProjectModalProps {
  project: any;
  onClose: () => void;
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  const mediaItems = React.useMemo(() => project.media || [], [project.media]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    console.log('Media items:', mediaItems);
  }, [mediaItems]);

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % mediaItems.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + mediaItems.length) % mediaItems.length);
  };

  const displayImage = mediaItems.length > 0 ? mediaItems[currentIndex].url : project.thumbnail;

  console.log('Current image index:', currentIndex, 'Display image URL:', displayImage);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-card text-foreground dark:bg-muted w-full max-w-2xl overflow-hidden rounded-lg shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          <Image
            src={displayImage || '/placeholder.svg'}
            alt={project.title}
            width={800}
            height={400}
            className="h-64 w-full object-cover"
          />
          {mediaItems.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="bg-background hover:bg-muted absolute left-2 top-1/2 -translate-y-1/2 transform rounded-full p-2 shadow-md"
              >
                <ChevronLeft className="text-foreground dark:text-muted-foreground h-6 w-6" />
              </button>
              <button
                onClick={nextImage}
                className="bg-background hover:bg-muted absolute right-2 top-1/2 -translate-y-1/2 transform rounded-full p-2 shadow-md"
              >
                <ChevronRight className="text-foreground dark:text-muted-foreground h-6 w-6" />
              </button>
            </>
          )}
          <button
            onClick={onClose}
            className="bg-background hover:bg-muted absolute right-4 top-4 rounded-full p-2 shadow-md transition"
          >
            <X className="text-foreground dark:text-muted-foreground h-6 w-6" />
          </button>
        </div>
        <div className="p-6">
          <h2 className="text-foreground dark:text-primary-foreground mb-2 text-2xl font-bold">
            {project.title}
          </h2>
          <p className="text-muted-foreground mb-4">{project.description}</p>
          <div className="mb-4 flex flex-wrap gap-2">
            {project.tags.map((tag: any) => (
              <Badge
                key={tag.id}
                variant="outline"
                className="border-border bg-muted text-foreground"
              >
                {tag.name}
              </Badge>
            ))}
          </div>
          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-primary text-primary-foreground hover:bg-secondary mb-4 inline-block rounded px-4 py-2 transition"
            >
              View Project
            </a>
          )}

          {/* User Details */}
          {project.user && (
            <div className="mt-6 flex items-center space-x-4">
              <Link href={`/user/${project.user.friendlyId}`}>
                <Avatar className="h-10 w-10 cursor-pointer">
                  <AvatarImage
                    src={project.user.profilePicture || ''}
                    alt={project.user.username}
                  />
                  <AvatarFallback>{project.user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
              </Link>
              <div>
                <Link href={`/user/${project.user.friendlyId}`}>
                  <p className="cursor-pointer font-semibold">{project.user.username}</p>
                </Link>
                <p className="text-muted-foreground text-sm">
                  {project.user.profession || 'No profession provided'}
                </p>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
