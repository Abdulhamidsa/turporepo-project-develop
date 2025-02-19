'use client';

import { Badge } from '@repo/ui/components/ui/badge';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import Image from 'next/image';

interface ProjectModalProps {
  project: any;
  onClose: () => void;
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
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
            src={project.thumbnail || '/placeholder.svg'}
            alt={project.title}
            width={800}
            height={400}
            className="h-64 w-full object-cover"
          />
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
              className="bg-primary text-primary-foreground hover:bg-secondary inline-block rounded px-4 py-2 transition-colors"
            >
              View Project
            </a>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
