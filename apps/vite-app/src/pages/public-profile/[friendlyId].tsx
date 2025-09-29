import { useEffect, useState } from 'react';

import { ProfessionBadge } from '@repo/ui/components/ProfessionBadge';
import { Avatar, AvatarFallback, AvatarImage } from '@repo/ui/components/ui/avatar';
import { Button } from '@repo/ui/components/ui/button';
import { Card, CardContent } from '@repo/ui/components/ui/card';
import { showToast } from '@repo/ui/components/ui/toaster';
import { UserType as BaseUserType } from '@repo/zod/validation';
import { ArrowLeft, Briefcase, Globe, Loader, Mail } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import axiosClient from '../../../api/axiosClient';
import { routesConfig } from '../../../routes/routesConfig';

interface ProjectType {
  _id: string;
  image?: string;
  title: string;
  description: string;
}

type UserType = BaseUserType & {
  email?: string;
  location?: string;
  profession?: string;
  bio?: string;
  projects?: ProjectType[];
};

export default function SimplePublicProfile() {
  const { friendlyId } = useParams<{ friendlyId: string }>();
  const [profileData, setProfileData] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!friendlyId) return;

      try {
        setLoading(true);
        const response = await axiosClient.get(`/user/${friendlyId}`);
        setProfileData(response.data);
      } catch (err) {
        console.error('Error fetching profile data:', err);
        setError('Failed to load profile. User may not exist.');
        showToast('Failed to load profile data', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [friendlyId]);

  const handleBackClick = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (error || !profileData) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <h2 className="text-2xl font-bold">Profile Not Found</h2>
              <p className="text-muted-foreground">{error || 'This profile could not be loaded'}</p>
              <Button onClick={handleBackClick}>Go Back</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen pb-10">
      {/* Header with back button */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border mb-6">
        <div className="container mx-auto max-w-5xl p-4">
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground transition-colors"
            onClick={handleBackClick}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>
      </div>

      <div className="container mx-auto max-w-5xl px-4">
        <Card className="border-muted mb-8 overflow-hidden shadow-lg">
          {/* Cover Photo - Enhanced gradient background */}
          <div className="h-48 bg-gradient-to-br from-primary/30 via-secondary/20 to-primary/10 relative">
            <div className="absolute inset-0 bg-black/5"></div>
          </div>

          {/* Profile Header */}
          <div className="relative px-6 pb-6">
            {/* Avatar */}
            <div className="absolute -top-20 left-6">
              <Avatar className="border-background h-40 w-40 border-4 shadow-xl">
                <AvatarImage
                  src={profileData.profilePicture || '/placeholder.png'}
                  className="object-cover"
                />
                <AvatarFallback className="text-5xl font-bold bg-gradient-to-br from-primary to-secondary text-white">
                  {profileData.username?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
            </div>

            <div className="mt-24 flex flex-col items-start justify-between space-y-4 md:flex-row md:items-end md:space-y-0">
              <div className="space-y-2">
                <div className="flex flex-col space-y-3 md:flex-row md:items-center md:space-y-0 md:space-x-4">
                  <h1 className="text-4xl font-bold text-foreground">{profileData.username}</h1>
                  <ProfessionBadge profession={profileData.profession || ''} />
                </div>
                <p className="text-muted-foreground text-lg font-medium">
                  @{profileData.friendlyId}
                </p>
              </div>

              <div className="flex space-x-3">
                <Link to={routesConfig.userPortfolioView(profileData.friendlyId)}>
                  <Button size="lg" className="shadow-md hover:shadow-lg transition-shadow">
                    View Full Profile
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          <CardContent className="space-y-4 px-6">
            {/* Bio */}
            {profileData.bio && (
              <div className="space-y-2">
                <h2 className="text-xl font-semibold">About</h2>
                <p className="text-muted-foreground">{profileData.bio}</p>
              </div>
            )}

            {/* Contact & Info */}
            <div className="grid grid-cols-1 gap-6 pt-4 sm:grid-cols-2 lg:grid-cols-3">
              {profileData.email && (
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                  <Mail className="h-5 w-5 text-primary" />
                  <span className="font-medium">{profileData.email}</span>
                </div>
              )}
              {profileData.location && (
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                  <Globe className="h-5 w-5 text-primary" />
                  <span className="font-medium">{profileData.location}</span>
                </div>
              )}
              {profileData.profession && (
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                  <Briefcase className="h-5 w-5 text-primary" />
                  <span className="font-medium">{profileData.profession}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Projects section */}
        {profileData.projects && profileData.projects.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold text-foreground">Featured Projects</h2>
              <span className="text-sm text-muted-foreground">
                {profileData.projects.length} project{profileData.projects.length !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {profileData.projects.slice(0, 3).map((project: ProjectType) => (
                <Card
                  key={project._id}
                  className="overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  {project.image && (
                    <div className="h-40 overflow-hidden">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                  )}
                  <CardContent className="p-4">
                    <h3 className="mb-2 text-lg font-semibold line-clamp-1">{project.title}</h3>
                    <p className="text-muted-foreground line-clamp-2 text-sm leading-relaxed">
                      {project.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="flex justify-center pt-6">
              <Link to={routesConfig.userPortfolioView(profileData.friendlyId)}>
                <Button
                  variant="outline"
                  size="lg"
                  className="shadow-md hover:shadow-lg transition-all duration-300"
                >
                  View All Projects ({profileData.projects.length})
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
