import { ProjectCardProps } from '@repo/data/types/types';
import { Badge } from '@repo/ui/components/ui/badge';
import { Card, CardContent } from '@repo/ui/components/ui/card';
import { timeAgo } from '@repo/utils/timeCalculation';
import { ExternalLink, MoreHorizontal } from 'lucide-react';

export default function ProjectCard({ project, onClick }: ProjectCardProps) {
  return (
    <Card className="bg-card border border-border hover:shadow-xl hover:shadow-primary/10 hover:border-primary/20 transition-all duration-300 cursor-pointer group overflow-hidden">
      <div className="relative">
        {/* Project Image */}
        <div className="aspect-[4/3] overflow-hidden">
          <img
            src={project.thumbnail || '/placeholder.png'}
            alt={project.title}
            className="w-full h-full object-cover transition-all duration-500 group-hover:brightness-110"
          />
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Live Demo Button */}
        {project.url && (
          <button
            className="absolute bottom-3 left-3 flex items-center gap-2 px-3 py-2 bg-white/90 text-black rounded-lg font-medium shadow-lg backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white"
            onClick={(e) => {
              e.stopPropagation();
              window.open(project.url, '_blank');
            }}
          >
            <ExternalLink className="h-4 w-4" />
            <span className="text-sm">View</span>
          </button>
        )}

        {/* Three Dots Menu */}
        <button className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm shadow-sm">
          <MoreHorizontal className="h-4 w-4 text-gray-700" />
        </button>
      </div>

      <CardContent className="p-5 space-y-4" onClick={onClick}>
        {/* Project Title */}
        <div className="space-y-2">
          <h3 className="font-semibold text-xl text-foreground line-clamp-2 group-hover:text-primary transition-colors duration-300">
            {project.title}
          </h3>

          {/* Project Description */}
          {project.description && (
            <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
              {project.description}
            </p>
          )}
        </div>

        {/* Technology Tags */}
        <div className="flex flex-wrap gap-2">
          {project.tags.slice(0, 3).map((tag) => (
            <Badge
              key={tag.id}
              variant="secondary"
              className="text-xs px-3 py-1 bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors"
            >
              {tag.name}
            </Badge>
          ))}
          {project.tags.length > 3 && (
            <Badge
              variant="outline"
              className="text-xs px-3 py-1 border-muted-foreground/30 text-muted-foreground"
            >
              +{project.tags.length - 3}
            </Badge>
          )}
        </div>

        {/* Footer with metadata */}
        <div className="flex items-center justify-between pt-3 border-t border-border/30">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-xs text-muted-foreground font-medium">
              {timeAgo(project.createdAt)}
            </span>
          </div>
          <div className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-full">
            {project.tags.length} tech{project.tags.length !== 1 ? 's' : ''}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
