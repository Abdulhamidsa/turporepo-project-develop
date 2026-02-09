import { useState } from 'react';

import { Button } from '@repo/ui/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@repo/ui/components/ui/dialog';
import {
  Briefcase,
  Calendar,
  ExternalLink,
  Globe,
  Lock,
  LogIn,
  Mail,
  MapPin,
  User,
} from 'lucide-react';
import { Link } from 'react-router-dom';

import { routesConfig } from '../../routes/routesConfig';
import { getCountryFlagIcon } from '../../utils/generateCountryFlag';
import { useAuth } from '../features/user/hooks/use.auth';

// Import User type from UsersGallery component - extended to match UserProfile
interface User {
  id: string;
  username: string;
  friendlyId: string;
  completedProfile: boolean;
  profession: string | null;
  profilePicture: string | null;
  countryOrigin?: string | null;
  createdAt: string;
  updatedAt: string;
  // Optional properties that might exist in some contexts
  bio?: string;
  age?: number;
  email?: string;
  website?: string;
  skills?: Skill[];
  projectsCount?: number;
  coverImage?: string;
}

interface Skill {
  id: string | number;
  name: string;
}

interface UserProfile {
  id: string | number;
  friendlyId?: string;
  username?: string;
  profilePicture?: string;
  coverImage?: string;
  profession?: string;
  bio?: string;
  countryOrigin?: string;
  age?: number;
  email?: string;
  website?: string;
  skills?: Skill[];
  projectsCount?: number;
  createdAt?: string | Date;
}

interface UserProfileModalProps {
  user: UserProfile | User | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function UserProfileModal({ user, isOpen, onOpenChange }: UserProfileModalProps) {
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const { isAuthenticated } = useAuth();

  if (!user) return null;

  const handleVisitProfile = () => {
    // Navigate to the user's public profile page using their friendlyId
    const friendlyId = user.friendlyId || user.id;
    // window.location.href = `/explore/professionals/${friendlyId}`;
    window.location.href = `/user/${friendlyId}`;
  };

  const handleContactClick = () => {
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
    } else {
      // Handle contact action when authenticated
      // This could be opening a message dialog, etc.
    }
  };

  // Country flag display
  const countryFlag = user.countryOrigin ? (
    <div className="flex items-center gap-1.5">
      <img
        src={`https://flagcdn.com/w20/${getCountryFlagIcon(user.countryOrigin)}.png`}
        alt={user.countryOrigin}
        className="h-3.5 w-5 rounded-sm object-cover"
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = 'none';
        }}
      />
      <span>{user.countryOrigin}</span>
    </div>
  ) : null;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          setShowLoginPrompt(false);
        }
        onOpenChange(open);
      }}
    >
      <DialogContent className="sm:max-w-lg p-0 overflow-hidden">
        {showLoginPrompt ? (
          // Login Prompt View
          <div className="p-6">
            <DialogHeader>
              <DialogTitle>Sign in required</DialogTitle>
              <DialogDescription>
                You need to be signed in to contact users or view their full profile information.
              </DialogDescription>
            </DialogHeader>

            <p className="text-sm text-muted-foreground mt-4">
              Create an account or sign in to connect with professionals, view detailed profiles,
              and access all features.
            </p>

            <DialogFooter className="mt-6">
              <Button variant="outline" onClick={() => setShowLoginPrompt(false)}>
                Back
              </Button>
              <Link to={routesConfig.login}>
                <Button className="bg-primary hover:bg-primary/90">
                  <LogIn className="w-4 h-4 mr-1" />
                  Sign In
                </Button>
              </Link>
            </DialogFooter>
          </div>
        ) : (
          // Profile View
          <div className="relative bg-card border border-border rounded-xl overflow-hidden">
            {/* Subtle Header Section */}
            <div className="relative h-32 bg-gradient-to-r from-primary/10 to-secondary/10 overflow-hidden">
              <div className="absolute top-4 right-4">
                <div className="bg-primary text-primary-foreground rounded-full px-3 py-1 text-xs font-medium">
                  ✨ Pro Member
                </div>
              </div>
            </div>

            <DialogHeader className="relative px-6 pt-2 pb-3">
              {/* Profile Picture */}
              <div className="absolute -top-10 left-6">
                <div className="w-20 h-20 rounded-full border-4 border-background overflow-hidden bg-muted shadow-lg">
                  {user.profilePicture ? (
                    <img
                      src={user.profilePicture}
                      alt={user.username || 'User'}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary/10">
                      <User className="w-8 h-8 text-primary" />
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-8">
                <DialogTitle className="text-xl font-semibold text-card-foreground">
                  {user.username || 'Anonymous User'}
                </DialogTitle>
                <div className="flex items-center mt-1 text-muted-foreground">
                  <Briefcase className="w-4 h-4 mr-1" />
                  <DialogDescription className="text-muted-foreground">
                    {user.profession || 'Professional'}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="px-6 pb-6 space-y-4">
              {/* Bio Section - Limited preview if not authenticated */}
              {user.bio && (
                <div className="bg-muted/50 rounded-lg p-4 border border-border">
                  <p className="text-sm text-card-foreground leading-relaxed">
                    {isAuthenticated
                      ? user.bio
                      : user.bio.length > 100
                        ? `${user.bio.substring(0, 100)}...`
                        : user.bio}
                  </p>
                  {!isAuthenticated && user.bio.length > 100 && (
                    <p className="text-xs text-primary mt-2 flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      Login to see full bio
                    </p>
                  )}
                </div>
              )}

              {/* Quick Info Grid */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                {user.countryOrigin && (
                  <div className="flex items-center gap-2 text-card-foreground bg-muted/50 rounded-lg p-3 border border-border">
                    <MapPin className="w-4 h-4 text-primary" />
                    {countryFlag || <span>{user.countryOrigin}</span>}
                  </div>
                )}

                {user.age && (
                  <div className="flex items-center gap-2 text-card-foreground bg-muted/50 rounded-lg p-3 border border-border">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span>{user.age} years</span>
                  </div>
                )}

                {/* Only show email and website if authenticated */}
                {isAuthenticated && user.email && (
                  <div className="flex items-center gap-2 text-card-foreground bg-muted/50 rounded-lg p-3 border border-border col-span-2">
                    <Mail className="w-4 h-4 text-primary" />
                    <span className="truncate">{user.email}</span>
                  </div>
                )}

                {isAuthenticated && user.website && (
                  <div className="flex items-center gap-2 text-card-foreground bg-muted/50 rounded-lg p-3 border border-border col-span-2">
                    <Globe className="w-4 h-4 text-primary" />
                    <span className="truncate">
                      {user.website.replace(/^https?:\/\/(www\.)?/, '')}
                    </span>
                  </div>
                )}

                {/* User status - blurred for privacy */}
                <div className="flex items-center gap-2 text-muted-foreground bg-muted/30 rounded-lg p-3 border border-border col-span-2 blur-sm">
                  <div className="w-2 h-2 rounded-full bg-muted-foreground"></div>
                  <span>Status hidden</span>
                </div>
              </div>

              {/* Country Flag Section */}
              {user.countryOrigin && (
                <div className="bg-muted/50 rounded-lg p-4 border border-border">
                  <h4 className="text-xs uppercase font-medium text-muted-foreground mb-3">
                    Location
                  </h4>
                  <div className="flex items-center gap-2">
                    <img
                      src={`https://flagcdn.com/w40/${getCountryFlagIcon(user.countryOrigin)}.png`}
                      alt={user.countryOrigin}
                      className="h-6 w-8 rounded object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                    <span className="text-card-foreground font-medium">{user.countryOrigin}</span>
                  </div>
                </div>
              )}

              {/* Projects Count - blurred */}
              <div className="bg-muted/30 rounded-lg p-4 border border-border blur-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                      <span className="text-muted-foreground text-sm font-bold">•</span>
                    </div>
                    <span className="text-muted-foreground font-medium">Projects hidden</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    Member since{' '}
                    {new Date(user.createdAt || Date.now()).toLocaleDateString(undefined, {
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-4 border-t border-border">
                <Button
                  onClick={handleVisitProfile}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 font-medium rounded-lg"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Visit Public Profile
                </Button>

                <Button
                  onClick={handleContactClick}
                  variant="outline"
                  className="w-full h-10 font-medium rounded-lg"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Contact
                </Button>

                {!isAuthenticated && (
                  <div className="text-xs text-muted-foreground text-center bg-muted/50 rounded-lg p-3 border border-border">
                    🔒 Sign in for full profile access and contact options
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
