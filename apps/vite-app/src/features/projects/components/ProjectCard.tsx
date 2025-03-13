import { ProjectCardProps } from '@repo/data/types/types';
import { Badge } from '@repo/ui/components/ui/badge';
import { Card, CardContent } from '@repo/ui/components/ui/card';

export default function ProjectCard({ project, onClick }: ProjectCardProps) {
  return (
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

        <div className="absolute inset-0 bg-black bg-opacity-0 transition-all duration-300 ease-in-out group-hover:bg-opacity-70 flex flex-col justify-center items-center p-4 text-center">
          <h3 className="mb-2 text-xl font-bold text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            {project.title}
          </h3>

          <div className="flex flex-wrap gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            {project.tags.slice(0, 3).map((tag) => (
              <Badge
                key={tag.id}
                variant="outline"
                className="border-white text-white bg-opacity-20 text-xs"
              >
                {tag.name}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
