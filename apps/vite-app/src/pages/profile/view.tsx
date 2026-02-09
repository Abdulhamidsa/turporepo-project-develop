import { Badge } from '@repo/ui/components/ui/badge';
import { Button } from '@repo/ui/components/ui/button';
import {
  Briefcase,
  Calendar,
  Clock,
  Code,
  ExternalLink,
  Globe,
  Layout,
  Link2,
  MapPin,
  PenTool,
  Server,
  User,
} from 'lucide-react';
import { useParams } from 'react-router-dom';

import { Skeleton } from '../../components/ui/skeleton';
import { useGetRequest } from '../../hooks/useRequest';

const ProfessionIcons = {
  'Software Engineer': { icon: Code, color: 'text-blue-500' },
  'UI/UX Designer': { icon: Layout, color: 'text-pink-500' },
  'Web Developer': { icon: Globe, color: 'text-green-500' },
  'Product Designer': { icon: PenTool, color: 'text-purple-500' },
  'DevOps Engineer': { icon: Server, color: 'text-orange-500' },
};

// Define interfaces for our data
interface UserProfile {
  id?: string;
  username?: string;
  profilePicture?: string;
  coverImage?: string;
  bio?: string;
  profession?: string;
  countryOrigin?: string;
  age?: number;
  createdAt?: string;
  skills?: { id: string; name: string }[];
  website?: string;
  friendlyId?: string;
}

interface ProjectType {
  id: string;
  title: string;
  description?: string;
  thumbnail?: string;
  tags?: { id: string; name: string }[];
}

export default function PublicProfilePage() {
  const { id } = useParams<{ id: string }>();

  const {
    data: userProfile,
    loading: userLoading,
    error: userError,
  } = useGetRequest<UserProfile>(`/user/${id}`, { shouldFetch: !!id });

  const { data: projectsData, loading: projectsLoading } = useGetRequest<
    { projects: ProjectType[] } | ProjectType[]
  >(`/projects/user/${id}`, {
    shouldFetch: !!id,
  });

  const projectsResponse = projectsData;
  const isProjectsLoading = projectsLoading;

  // Handle different response structures
  const projectsList = Array.isArray(projectsResponse)
    ? projectsResponse
    : projectsResponse?.projects || [];

  if (userLoading) {
    return <ProfileSkeleton />;
  }

  if (userError || !userProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-background flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold mb-4">User Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The profile you're looking for doesn't exist or may have been removed.
          </p>
          <Button variant="default" onClick={() => (window.location.href = '/')}>
            Return Home
          </Button>
        </div>
      </div>
    );
  }

  // Get the profession icon if available
  const professionData = userProfile.profession
    ? ProfessionIcons[userProfile.profession as keyof typeof ProfessionIcons]
    : null;
  const ProfIcon = professionData?.icon || Briefcase;

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="mx-auto max-w-4xl">
        {/* Return to Home Button */}
        <div className="mb-6">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            onClick={() => (window.location.href = '/')}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Button>
        </div>

        {/* Clean Profile Card */}
        <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
          {/* Clean Header */}
          <div className="bg-gradient-to-r from-primary/5 to-secondary/5 p-8 border-b border-border">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-6">
                {/* Profile Picture */}
                <div className="relative">
                  <div className="w-24 h-24 rounded-full border-2 border-border overflow-hidden bg-muted">
                    {userProfile.profilePicture ? (
                      <img
                        src={userProfile.profilePicture}
                        alt={userProfile.username || 'User'}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
                        <User className="w-12 h-12" />
                      </div>
                    )}
                  </div>
                  {/* Status Badge */}
                  <div className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground p-1.5 rounded-full border-2 border-background">
                    <ProfIcon className="w-3 h-3" />
                  </div>
                </div>

                {/* User Info */}
                <div>
                  <h1 className="text-2xl font-bold text-card-foreground mb-1">
                    {userProfile.username || 'Anonymous User'}
                  </h1>
                  <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    <Briefcase className="w-4 h-4" />
                    <span>{userProfile.profession || 'Professional'}</span>
                  </div>
                  {userProfile.countryOrigin && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{userProfile.countryOrigin}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <Button
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
                onClick={() => (window.location.href = '/')}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Sign In to Contact
              </Button>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-8 space-y-8">
            {/* Bio */}
            {userProfile.bio && (
              <div>
                <h2 className="text-lg font-semibold text-card-foreground mb-3">About</h2>
                <p className="text-muted-foreground leading-relaxed bg-muted/30 p-4 rounded-lg">
                  {userProfile.bio}
                </p>
              </div>
            )}

            {/* Quick Info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {userProfile.age && (
                <div className="bg-muted/30 rounded-lg p-4 text-center">
                  <Calendar className="h-5 w-5 text-primary mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Age</p>
                  <p className="font-medium text-card-foreground">{userProfile.age} years</p>
                </div>
              )}

              {userProfile.countryOrigin && (
                <div className="bg-muted/30 rounded-lg p-4 text-center">
                  <MapPin className="h-5 w-5 text-primary mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-medium text-card-foreground">{userProfile.countryOrigin}</p>
                </div>
              )}

              <div className="bg-muted/30 rounded-lg p-4 text-center">
                <Clock className="h-5 w-5 text-primary mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Member since</p>
                <p className="font-medium text-card-foreground">
                  {new Date(userProfile.createdAt || Date.now()).getFullYear()}
                </p>
              </div>
            </div>

            {/* External Links */}
            {userProfile.website && (
              <div>
                <h2 className="text-lg font-semibold text-card-foreground mb-3">Website</h2>
                <div className="bg-muted/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-primary">
                    <Link2 className="h-4 w-4" />
                    <a
                      href={userProfile.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline font-medium"
                    >
                      {userProfile.website.replace(/^https?:\/\/(www\.)?/, '')}
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Projects Section */}
          <div className="border-t border-border p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-card-foreground">Projects</h2>
              <span className="text-sm text-muted-foreground">
                {projectsList.length} {projectsList.length === 1 ? 'project' : 'projects'}
              </span>
            </div>

            {isProjectsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className="rounded-lg border border-border h-64 animate-pulse bg-muted/40"
                  ></div>
                ))}
              </div>
            ) : projectsList.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projectsList.slice(0, 4).map((project: ProjectType) => (
                  <div
                    key={project.id}
                    className="rounded-lg border border-border overflow-hidden group hover:border-primary/50 transition-all"
                  >
                    {/* Project Thumbnail */}
                    <div className="h-40 relative overflow-hidden">
                      {project.thumbnail ? (
                        <img
                          src={project.thumbnail}
                          alt={project.title}
                          className="w-full h-full object-cover transition-opacity duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-muted">
                          <Code className="h-12 w-12 text-muted-foreground" />
                        </div>
                      )}

                      {/* Blur overlay */}
                      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
                        <Button
                          size="sm"
                          className="bg-primary/80 text-white hover:bg-primary"
                          onClick={() => (window.location.href = '/')}
                        >
                          Sign in to view
                        </Button>
                      </div>
                    </div>

                    {/* Project Info */}
                    <div className="p-4">
                      <h3 className="font-medium mb-1">{project.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {project.description || 'No description available'}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5">
                        {project.tags?.slice(0, 3).map((tag: { id: string; name: string }) => (
                          <Badge key={tag.id} variant="secondary" className="text-xs">
                            {tag.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 border border-dashed border-border rounded-lg bg-card/50">
                <Code className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
                <h3 className="text-lg font-medium mb-1">No projects found</h3>
                <p className="text-muted-foreground text-sm">
                  This user hasn't shared any projects yet
                </p>
              </div>
            )}

            {/* Clean Call-to-Action */}
            <div className="mt-8 bg-primary/5 rounded-lg p-6 text-center border border-primary/20">
              <h3 className="text-lg font-semibold text-card-foreground mb-2">Want to connect?</h3>
              <p className="text-muted-foreground mb-4 text-sm">
                Sign in to view full details and connect with this professional
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-3">
                <Button
                  onClick={() => (window.location.href = '/')}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  Sign In
                </Button>
                <Button onClick={() => (window.location.href = '/')} variant="outline">
                  Create Account
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="mx-auto max-w-4xl">
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          {/* Header */}
          <div className="p-8 border-b border-border">
            <div className="flex items-center gap-6">
              <Skeleton className="w-24 h-24 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 space-y-6">
            <div>
              <Skeleton className="h-5 w-16 mb-3" />
              <Skeleton className="h-20 w-full" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
