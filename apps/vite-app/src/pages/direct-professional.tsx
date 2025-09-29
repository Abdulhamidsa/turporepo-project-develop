import React from 'react';

import { getEndpoints } from '@repo/api/endpoints';
import { defaultUserProfile, userProfileSchema } from '@repo/zod/validation/user';
import { AlertCircle, Briefcase, Lock } from 'lucide-react';
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

        {/* Clean Minimal Profile Card */}
        <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
          {/* Simple Header */}
          <div className="p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              {/* Profile Picture */}
              <div className="w-20 h-20 rounded-full border border-border overflow-hidden bg-muted flex-shrink-0">
                {userProfile.profilePicture ? (
                  <img
                    src={userProfile.profilePicture}
                    alt={userProfile.username || 'User'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
                    <span className="text-2xl font-bold">
                      {userProfile.username?.charAt(0).toUpperCase() || '?'}
                    </span>
                  </div>
                )}
              </div>

              {/* User Info */}
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-card-foreground mb-2">
                  {userProfile.username || 'Anonymous User'}
                </h1>
                <div className="flex items-center gap-2 text-lg text-muted-foreground mb-3">
                  <Briefcase className="w-5 h-5" />
                  <span>{userProfile.profession || 'Professional'}</span>
                </div>
                {userProfile.countryOrigin && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>{userProfile.countryOrigin}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Bio Section */}
            {userProfile.bio && (
              <div className="mt-6 pt-6 border-t border-border">
                <p className="text-muted-foreground leading-relaxed text-lg">{userProfile.bio}</p>
              </div>
            )}
          </div>

          {/* Simple Stats */}
          <div className="px-8 pb-4">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Member since {new Date().getFullYear()}</span>
              {userProfile.age && <span>{userProfile.age} years old</span>}
            </div>
          </div>

          {/* Projects Section - Clean and Blurred */}
          <div className="border-t border-border">
            <div className="p-8">
              <h2 className="text-xl font-semibold text-card-foreground mb-6 flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-primary" />
                Projects
              </h2>

              {/* Blurred Projects Grid */}
              <div className="relative">
                <div className="blur-md pointer-events-none select-none">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Mock Project Cards */}
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="bg-muted/40 rounded-lg overflow-hidden border border-border"
                      >
                        <div className="aspect-video bg-gradient-to-br from-primary/30 to-secondary/20" />
                        <div className="p-4">
                          <div className="h-4 bg-muted rounded mb-2" />
                          <div className="h-3 bg-muted rounded mb-3 w-3/4" />
                          <div className="flex gap-2">
                            <div className="h-5 w-12 bg-primary/20 rounded-full" />
                            <div className="h-5 w-16 bg-primary/20 rounded-full" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Subtle Overlay Message */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-background/90 backdrop-blur-sm rounded-lg p-6 text-center border border-border shadow-lg">
                    <Lock className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground mb-4">Sign in to view projects</p>
                    <button
                      onClick={() => (window.location.href = '/auth')}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 rounded-lg transition-colors"
                    >
                      Sign In
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Simple Footer */}
          <div className="border-t border-border bg-muted/30 p-6">
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <button
                onClick={() => (window.location.href = '/auth')}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-lg transition-colors font-medium"
              >
                Sign In
              </button>
              <button
                onClick={() => (window.location.href = '/auth')}
                className="border border-border hover:bg-muted text-card-foreground px-8 py-3 rounded-lg transition-colors font-medium"
              >
                Create Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
