import { ProjectCardProps } from '@repo/data/types/types';
import { Card, CardContent } from '@repo/ui/components/ui/card';
import { getProjectImageUrl } from '@repo/utils/imageOptimization';
import { timeAgo } from '@repo/utils/timeCalculation';
import { MoreVertical } from 'lucide-react';

export default function ProjectCard({ project, onClick }: ProjectCardProps) {
  return (
    <Card className="bg-card border border-border hover:shadow-2xl hover:shadow-primary/20 hover:border-primary/30 transition-all duration-300 group overflow-hidden w-full">
      <div className="relative">
        {/* Project Image */}
        <div className="aspect-[4/3] overflow-hidden bg-muted/20">
          <img
            src={getProjectImageUrl(project.thumbnail, 800)}
            alt={project.title}
            className="w-full p-4 h-full object-cover transition-all duration-500 group-hover:brightness-110"
            loading="lazy"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder.png';
            }}
          />
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

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
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
          <span className="text-sm text-muted-foreground font-medium">
            {timeAgo(project.createdAt)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
