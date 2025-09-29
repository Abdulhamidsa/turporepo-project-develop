import { useState } from 'react';

import { Button } from '@repo/ui/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@repo/ui/components/ui/dialog';
import { ArrowRight, ExternalLink, Globe, Rocket, User } from 'lucide-react';

import { getCountryFlagIcon } from '../../utils/generateCountryFlag';
import SignupForm from '../features/auth/components/SignUpForm';
import SigninForm from '../features/auth/components/SigninForm';
import { useFeaturedUsers } from '../hooks/useFeaturedUsers';

export default function Auth() {
  const [isSignIn, setIsSignIn] = useState<{
    mode: 'signin' | 'signup' | null;
    prefillValues?: { email?: string } | undefined;
  }>({
    mode: null,
  });

  // Fetch real data from your API (show fewer items initially)
  const { users, isLoading: usersLoading } = useFeaturedUsers(3);

  const openSignUp = () => setIsSignIn({ mode: 'signup' });
  const openSignIn = () => setIsSignIn({ mode: 'signin' });
  const closeModal = () => setIsSignIn({ mode: null });

  return (
    <div className="min-h-screen w-full bg-background">
      {/* Main content */}
      <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12">
        <div className="max-w-4xl w-full text-center space-y-12 sm:space-y-16">
          {/* Hero content */}
          <div className="space-y-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-foreground leading-tight">
              Share. <span className="text-primary">Connect.</span> Grow.
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              A platform for professionals to share their work, connect with peers, and grow their
              network.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
            <Button
              onClick={openSignUp}
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold w-full sm:w-auto"
            >
              Create Account
              <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
            </Button>

            <Button
              onClick={openSignIn}
              variant="outline"
              size="lg"
              className="border-border text-foreground hover:bg-card px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold w-full sm:w-auto"
            >
              Sign In
            </Button>
          </div>

          {/* Subtle feature highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 mt-12 sm:mt-16">
            <div className="space-y-3">
              <div className="w-12 h-12 bg-card border border-border rounded-full flex items-center justify-center mx-auto">
                <Rocket className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">Quick Start</h3>
              <p className="text-sm text-muted-foreground">Join in minutes</p>
            </div>

            <div className="space-y-3">
              <div className="w-12 h-12 bg-card border border-border rounded-full flex items-center justify-center mx-auto">
                <User className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">Share Your Work</h3>
              <p className="text-sm text-muted-foreground">Showcase your expertise</p>
            </div>

            <div className="space-y-3">
              <div className="w-12 h-12 bg-card border border-border rounded-full flex items-center justify-center mx-auto">
                <Globe className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">Professional Network</h3>
              <p className="text-sm text-muted-foreground">Connect with peers</p>
            </div>
          </div>
        </div>
      </div>

      {/* Public Showcase Section */}
      <div className="bg-card border-t border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
              Discover Professionals
            </h2>
            <p className="text-muted-foreground">
              Connect with talented professionals sharing their work and expertise
            </p>
          </div>

          {/* Featured Professionals */}
          <div className="relative mb-16">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
              {usersLoading ? (
                // Loading skeleton
                [...Array(3)].map((_, index) => (
                  <div
                    key={index}
                    className="bg-card border border-border rounded-lg p-4 animate-pulse"
                  >
                    <div className="flex items-center mb-3">
                      <div className="w-12 h-12 bg-muted rounded-full mr-3"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-muted rounded w-24 mb-2"></div>
                        <div className="h-3 bg-muted rounded w-32"></div>
                      </div>
                      <div className="w-6 h-4 bg-muted rounded"></div>
                    </div>
                    <div className="h-12 bg-muted rounded mb-3"></div>
                    <div className="h-8 bg-muted rounded"></div>
                  </div>
                ))
              ) : users.length > 0 ? (
                users.map((user) => (
                  <div
                    key={user.id}
                    className="bg-card border border-border rounded-lg p-4 hover:border-primary/50 hover:shadow-sm transition-all duration-200"
                  >
                    <div className="flex items-center mb-3">
                      {/* Profile Picture */}
                      <div className="w-12 h-12 rounded-full overflow-hidden mr-3 flex-shrink-0">
                        {user.profilePicture ? (
                          <img
                            src={user.profilePicture}
                            alt={user.username}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                            <User className="w-6 h-6 text-primary" />
                          </div>
                        )}
                      </div>

                      {/* User Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground truncate">{user.username}</h3>
                        <p className="text-sm text-muted-foreground truncate">{user.profession}</p>
                      </div>

                      {/* Country Flag */}
                      <div className="flex items-center ml-2">
                        {user.countryOrigin && (
                          <img
                            src={`https://flagcdn.com/w20/${getCountryFlagIcon(user.countryOrigin)}.png`}
                            alt={user.countryOrigin}
                            className="h-3 w-4 rounded-sm object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        )}
                      </div>
                    </div>

                    {/* Bio */}
                    {user.bio && (
                      <div className="mb-3">
                        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                          {user.bio}
                        </p>
                      </div>
                    )}

                    {/* Action Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        if (user.friendlyId) {
                          window.open(`/explore/professionals/${user.friendlyId}`, '_blank');
                        }
                      }}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View Profile
                    </Button>
                  </div>
                ))
              ) : (
                // Empty state
                <div className="col-span-full text-center py-12">
                  <User className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No users found</h3>
                  <p className="text-muted-foreground">Be the first to join our community!</p>
                </div>
              )}
            </div>

            {/* See All Button */}
            {users.length > 0 && (
              <div className="text-center">
                <Button
                  variant="outline"
                  onClick={() => window.open('/discover/professionals', '_blank')}
                  className="bg-card hover:bg-primary hover:text-primary-foreground border-border hover:border-primary px-6 py-2 transition-all duration-200"
                >
                  View All Professionals
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <p className="text-muted-foreground mb-6">Ready to share your work and connect?</p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Button
                onClick={openSignUp}
                className="bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto"
              >
                Create Account
              </Button>
              <Button
                variant="outline"
                onClick={openSignIn}
                className="border-border text-foreground hover:bg-card w-full sm:w-auto"
              >
                Browse Professionals
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <Dialog open={!!isSignIn.mode} onOpenChange={closeModal}>
        <DialogContent className="bg-card border border-border p-0 max-w-md w-[95%]">
          <div className="p-8">
            {/* Hidden DialogTitle for accessibility */}
            <DialogTitle className="sr-only">
              {isSignIn.mode === 'signin' ? 'Sign In' : 'Create Account'}
            </DialogTitle>

            {isSignIn.mode === 'signin' ? (
              <SigninForm
                setIsSignIn={(val) => setIsSignIn({ mode: val ? 'signin' : 'signup' })}
                prefillValues={isSignIn.prefillValues}
              />
            ) : (
              <SignupForm
                setIsSignIn={(val, prefill) =>
                  setIsSignIn({ mode: val ? 'signin' : 'signup', prefillValues: prefill })
                }
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
