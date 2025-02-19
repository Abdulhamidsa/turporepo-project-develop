import { Avatar, AvatarFallback, AvatarImage } from '@repo/ui/components/ui/avatar';
import { Badge } from '@repo/ui/components/ui/badge';
import { Button } from '@repo/ui/components/ui/button';
import { Card, CardContent, CardFooter } from '@repo/ui/components/ui/card';
import { AddProjectInput } from '@repo/zod/validation';

import { ProfessionBadge } from '../../../../../../packages/ui/src/components/ProfessionBadge';
import { useUserProfile } from '../../user/hooks/use.user.profile';

interface ProjectPreviewProps {
  project: AddProjectInput;
  pendingThumbnail: File | null;
}

const ProjectPreview: React.FC<ProjectPreviewProps> = ({ project, pendingThumbnail }) => {
  const { userProfile } = useUserProfile();

  const thumbnailUrl = pendingThumbnail
    ? URL.createObjectURL(pendingThumbnail)
    : project.thumbnail || '/placeholder.png';

  return (
    <Card className="bg-card text-card-foreground relative w-full max-w-full overflow-hidden rounded-lg shadow-md md:max-w-lg lg:max-w-2xl">
      {/* Thumbnail */}
      <div className="relative h-44 w-full sm:h-56">
        <img
          src={thumbnailUrl}
          alt={project.title || 'Project'}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
      </div>

      <CardContent className="p-4">
        <h2 className="text-foreground truncate text-lg font-semibold sm:text-xl">
          {project.title || 'Untitled Project'}
        </h2>
        <p className="text-muted-foreground mt-1 line-clamp-2 text-sm sm:text-base">
          {project.description || 'No description available.'}
        </p>

        <div className="mt-4 flex items-center">
          <Avatar className="border-border h-8 w-8 border sm:h-10 sm:w-10">
            <AvatarImage src={userProfile?.profilePicture || '/placeholder.png'} />
            <AvatarFallback>{userProfile?.username?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
          </Avatar>
          <div className="ml-3">
            <h4 className="text-foreground text-sm font-medium">
              {userProfile?.username || 'User'}
            </h4>
            <ProfessionBadge profession={userProfile?.profession || 'Unknown'} />
          </div>
        </div>

        {project.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {project.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} className="bg-primary rounded-md px-3 py-1 text-xs text-white">
                #{tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter className="border-border text-muted-foreground flex items-center justify-between border-t p-4 text-sm">
        {project.url?.trim() && (
          <Button variant="outline" onClick={() => window.open(project.url, '_blank')}>
            View Preview
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ProjectPreview;
