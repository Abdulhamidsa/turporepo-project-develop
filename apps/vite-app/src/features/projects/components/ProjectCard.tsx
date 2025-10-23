import { ProjectCardProps } from '@repo/data/types/types';
import { Badge } from '@repo/ui/components/ui/badge';
import { Card, CardContent } from '@repo/ui/components/ui/card';
import { timeAgo } from '@repo/utils/timeCalculation';
import { ExternalLink, MoreVertical } from 'lucide-react';

export default function ProjectCard({ project, onClick }: ProjectCardProps) {
  return (
    <Card className="bg-card border border-border hover:shadow-2xl hover:shadow-primary/20 hover:border-primary/30 transition-all duration-300 group overflow-hidden w-full">
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
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Live Demo Button */}
        {project.url && (
          <button
            className="absolute bottom-4 left-4 flex items-center gap-2 px-4 py-3 bg-white/95 text-black rounded-xl font-semibold shadow-xl backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:shadow-2xl"
            onClick={(e) => {
              e.stopPropagation();
              window.open(project.url, '_blank');
            }}
          >
            <ExternalLink className="h-4 w-4" />
            <span className="text-sm">View Live</span>
          </button>
        )}

        {/* Three Dots Menu */}
        <button
          onClick={onClick}
          className="absolute top-4 right-4 p-3 bg-white/95 rounded-xl opacity-90 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm shadow-lg hover:bg-white hover:shadow-xl"
        >
          <MoreVertical className="h-5 w-5 text-black" />
        </button>
      </div>

      <CardContent className="p-6 space-y-4">
        {/* Project Title */}
        <h3 className="font-bold text-xl text-foreground line-clamp-2 group-hover:text-primary transition-colors duration-300 leading-tight">
          {project.title}
        </h3>

        {/* Project Description */}
        {project.description && (
          <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
            {project.description}
          </p>
        )}

        {/* Technology Tags */}
        <div className="flex flex-wrap gap-2">
          {project.tags.slice(0, 4).map((tag) => (
            <Badge
              key={tag.id}
              variant="secondary"
              className="text-xs px-3 py-1.5 bg-primary/10 text-primary border border-primary/20 font-medium hover:bg-primary/20 transition-colors"
            >
              {tag.name}
            </Badge>
          ))}
          {project.tags.length > 4 && (
            <Badge
              variant="outline"
              className="text-xs px-3 py-1.5 border-muted-foreground/30 text-muted-foreground font-medium"
            >
              +{project.tags.length - 4} more
            </Badge>
          )}
        </div>

        {/* Footer with metadata */}
        <div className="flex items-center justify-between pt-4 border-t border-border/30">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
            <span className="text-sm text-muted-foreground font-medium">
              {timeAgo(project.createdAt)}
            </span>
          </div>
          <div className="text-sm text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full font-medium">
            {project.tags.length} tech{project.tags.length !== 1 ? 's' : ''}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
