import { ProjectCardProps } from '@repo/data/types/types';
import { Badge } from '@repo/ui/components/ui/badge';
import { Card, CardContent } from '@repo/ui/components/ui/card';

export default function ProjectCard({ project, onClick }: ProjectCardProps) {
  return (
    <>
      <Card
        className="bg-card text-card-foreground group relative w-full cursor-pointer overflow-hidden"
        onClick={onClick}
      >
        <CardContent className="relative p-0">
          <img
            src={project.thumbnail || '/placeholder.png'}
            alt={project.title}
            className="h-64 w-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 transition-all duration-300 ease-in-out group-hover:bg-opacity-40"></div>

          {/* Project Details */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
            <h3 className="mb-2 text-xl font-bold">{project.title}</h3>
            <p className="text-muted-foreground mb-4 text-sm">{project.description}</p>
            <div className="mb-2 flex flex-wrap gap-2">
              {project.tags.slice(0, 3).map((tag) => (
                <Badge
                  key={tag.id}
                  variant="secondary"
                  className="bg-secondary text-secondary-foreground text-xs"
                >
                  {tag.name}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
