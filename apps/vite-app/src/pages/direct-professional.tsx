import React from 'react';

import { getEndpoints } from '@repo/api/endpoints';
import { defaultUserProfile, userProfileSchema } from '@repo/zod/validation/user';
import { AlertCircle, Briefcase, Eye, Lock } from 'lucide-react';
import { useParams } from 'react-router-dom';
import useSWR from 'swr';

import { swrFetcher } from '../../api/swrFetcher';

const ENDPOINTS = getEndpoints(import.meta.env.VITE_BASE_URL);

// Custom hook for professional profile page
const useProfessionalProfile = () => {
  const { friendlyId } = useParams<{ friendlyId: string }>();
  console.log('Professional profile params:', { friendlyId });

  const { data, error, isLoading } = useSWR(
    friendlyId ? ENDPOINTS.users.fetchUserPublicProfile(friendlyId) : null,
    async (endpoint) => {
      try {
        const result = await swrFetcher(endpoint, userProfileSchema, defaultUserProfile);
        console.log('Fetched profile data:', result);
        if (!result?.username) {
          console.warn(`Profile not found for ID: ${friendlyId}`);
          localStorage.setItem('lastAttemptedProfile', friendlyId || 'unknown');
        }
        return result;
      } catch (err) {
        console.error(`Error fetching profile: ${err}`);
        localStorage.setItem('lastAttemptedProfile', friendlyId || 'unknown');
        throw err;
      }
    },
  );

  return {
    userProfile: data || defaultUserProfile,
    isLoading,
    error,
    friendlyId,
  };
};

export default function DirectProfessionalProfile() {
  // Log when this component is mounted to confirm it's being used
  React.useEffect(() => {
    console.log('DirectProfessionalProfile component mounted - PUBLIC VERSION');
  }, []);

  const { userProfile, isLoading, error, friendlyId } = useProfessionalProfile();
  const [redirecting, setRedirecting] = React.useState(false);

  // Handle user not found - redirect to main page
  React.useEffect(() => {
    console.log('DirectProfessionalProfile rendered at path:', window.location.pathname);
    console.log('Profile check:', {
      isLoading,
      error,
      hasUsername: !!userProfile?.username,
      friendlyId,
    });

    // Only redirect if we've finished loading and there's no username in the profile
    if (!isLoading && !error && !userProfile?.username) {
      console.log('Setting redirect for missing profile');
      setRedirecting(true);
    }
  }, [isLoading, userProfile, error, friendlyId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background py-8 px-4">
        <div className="mx-auto max-w-4xl">
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="p-8">
              <div className="text-center text-muted-foreground">Loading profile...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (redirecting || error || !userProfile?.username) {
    return (
      <div className="min-h-screen bg-background py-8 px-4">
        <div className="mx-auto max-w-4xl">
          <div className="mb-6">
            <button
              onClick={() => (window.location.href = '/discover/professionals')}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
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
              Back to Professionals
            </button>
          </div>
          <div className="bg-card border border-border rounded-xl p-8 text-center">
            <div className="inline-block p-4 bg-destructive/10 rounded-full mb-4">
              <AlertCircle className="w-10 h-10 text-destructive" />
            </div>
            <h1 className="text-2xl font-bold text-card-foreground mb-4">Profile Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The profile you're looking for doesn't exist or may have been removed.
            </p>
            <button
              onClick={() => (window.location.href = '/discover/professionals')}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 rounded-lg transition-colors"
            >
              Back to Professionals
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="mx-auto max-w-4xl">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => (window.location.href = '/discover/professionals')}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
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
            Back to Professionals
          </button>
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
                        <AlertCircle className="w-12 h-12" />
                      </div>
                    )}
                  </div>
                  {/* Status Badge */}
                  <div className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground p-1.5 rounded-full border-2 border-background">
                    <AlertCircle className="w-3 h-3" />
                  </div>
                </div>

                {/* User Info */}
                <div>
                  <h1 className="text-2xl font-bold text-card-foreground mb-1">
                    {userProfile.username || 'Anonymous User'}
                  </h1>
                  <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    <AlertCircle className="w-4 h-4" />
                    <span>{userProfile.profession || 'Professional'}</span>
                  </div>
                  {userProfile.countryOrigin && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <AlertCircle className="w-4 h-4" />
                      <span>{userProfile.countryOrigin}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => (window.location.href = '/auth')}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 rounded-lg transition-colors flex items-center gap-2"
              >
                <Lock className="h-4 w-4" />
                Sign In to View More
              </button>
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
                  <AlertCircle className="h-5 w-5 text-primary mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Age</p>
                  <p className="font-medium text-card-foreground">{userProfile.age} years</p>
                </div>
              )}

              {userProfile.countryOrigin && (
                <div className="bg-muted/30 rounded-lg p-4 text-center">
                  <AlertCircle className="h-5 w-5 text-primary mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-medium text-card-foreground">{userProfile.countryOrigin}</p>
                </div>
              )}

              <div className="bg-muted/30 rounded-lg p-4 text-center">
                <AlertCircle className="h-5 w-5 text-primary mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Member since</p>
                <p className="font-medium text-card-foreground">{new Date().getFullYear()}</p>
              </div>
            </div>

            {/* Projects Section (Blurred) */}
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-card-foreground flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-primary" />
                  Projects
                </h2>
                <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">
                  <Lock className="h-3 w-3" />
                  Sign in to view
                </div>
              </div>

              {/* Blurred Projects Content */}
              <div className="relative">
                <div className="blur-sm pointer-events-none select-none">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Mock Project 1 */}
                    <div className="bg-muted/30 rounded-lg p-4 border border-border">
                      <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg mb-3 flex items-center justify-center">
                        <Eye className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <h3 className="font-semibold text-card-foreground mb-2">Featured Project</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        A comprehensive description of this amazing project that showcases skills
                        and expertise...
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                          React
                        </span>
                        <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                          TypeScript
                        </span>
                        <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                          Design
                        </span>
                      </div>
                    </div>

                    {/* Mock Project 2 */}
                    <div className="bg-muted/30 rounded-lg p-4 border border-border">
                      <div className="aspect-video bg-gradient-to-br from-secondary/20 to-primary/20 rounded-lg mb-3 flex items-center justify-center">
                        <Eye className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <h3 className="font-semibold text-card-foreground mb-2">
                        Another Great Work
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Another impressive project demonstrating professional capabilities and
                        creative solutions...
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                          Node.js
                        </span>
                        <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                          MongoDB
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent pointer-events-none" />

                {/* Unlock Message */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-card/95 backdrop-blur-sm border border-border rounded-lg p-6 text-center shadow-lg">
                    <Lock className="h-8 w-8 text-primary mx-auto mb-3" />
                    <h3 className="font-semibold text-card-foreground mb-2">Projects Locked</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Sign in to view detailed project information
                    </p>
                    <button
                      onClick={() => (window.location.href = '/auth')}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 text-sm rounded-lg transition-colors"
                    >
                      Sign In to View
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Section (Blurred) */}
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-card-foreground flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-primary" />
                  Professional Status
                </h2>
                <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">
                  <Lock className="h-3 w-3" />
                  Sign in to view
                </div>
              </div>

              {/* Blurred Status Content */}
              <div className="relative">
                <div className="blur-sm pointer-events-none select-none">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Availability Status */}
                    <div className="bg-muted/30 rounded-lg p-4 border border-border">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full" />
                        <h3 className="font-semibold text-card-foreground">Available</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Open to new opportunities and collaborations
                      </p>
                    </div>

                    {/* Current Focus */}
                    <div className="bg-muted/30 rounded-lg p-4 border border-border">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full" />
                        <h3 className="font-semibold text-card-foreground">Current Focus</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Working on innovative web solutions
                      </p>
                    </div>

                    {/* Experience Level */}
                    <div className="bg-muted/30 rounded-lg p-4 border border-border">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-3 h-3 bg-primary rounded-full" />
                        <h3 className="font-semibold text-card-foreground">Experience</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        5+ years in professional development
                      </p>
                    </div>

                    {/* Skills */}
                    <div className="bg-muted/30 rounded-lg p-4 border border-border">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-3 h-3 bg-purple-500 rounded-full" />
                        <h3 className="font-semibold text-card-foreground">Specialties</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        React, TypeScript, UI/UX Design
                      </p>
                    </div>
                  </div>
                </div>

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent pointer-events-none" />

                {/* Unlock Message */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-card/95 backdrop-blur-sm border border-border rounded-lg p-6 text-center shadow-lg">
                    <Lock className="h-8 w-8 text-primary mx-auto mb-3" />
                    <h3 className="font-semibold text-card-foreground mb-2">
                      Status Information Locked
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Sign in to view professional status and availability
                    </p>
                    <button
                      onClick={() => (window.location.href = '/auth')}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 text-sm rounded-lg transition-colors"
                    >
                      Sign In to View
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Clean Call-to-Action */}
            <div className="bg-primary/5 rounded-lg p-6 text-center border border-primary/20">
              <h3 className="text-lg font-semibold text-card-foreground mb-2">View Full Profile</h3>
              <p className="text-muted-foreground mb-4 text-sm">
                Sign in to view projects, professional status, and detailed information
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-3">
                <button
                  onClick={() => (window.location.href = '/auth')}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 rounded-lg transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => (window.location.href = '/auth?signup=true')}
                  className="border border-border hover:bg-muted/50 text-card-foreground px-6 py-2 rounded-lg transition-colors"
                >
                  Create Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
