import { useState } from 'react';

import { Button } from '@repo/ui/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@repo/ui/components/ui/dialog';
import { ArrowRight, ExternalLink, Globe, Menu, Rocket, User, X } from 'lucide-react';
import { Link } from 'react-router-dom';

import { getCountryFlagIcon } from '../../utils/generateCountryFlag';
import SignupForm from '../features/auth/components/SignUpForm';
import SigninForm from '../features/auth/components/SigninForm';
import { useFeaturedUsers } from '../hooks/useFeaturedUsers';
import { DarkModeToggle } from '../layout/DarkModeToggle';

// Public Navbar Component
function PublicNavbar({
  openSignIn,
  openSignUp,
}: {
  openSignIn: () => void;
  openSignUp: () => void;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-background/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-primary">
              ProFolio
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/discover/professionals"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Discover Professionals
            </Link>
            <DarkModeToggle />
            <Button
              variant="ghost"
              onClick={openSignIn}
              className="text-muted-foreground hover:text-foreground"
            >
              Sign In
            </Button>
            <Button onClick={openSignUp} size="sm" className="bg-primary hover:bg-primary/90">
              Get Started
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <DarkModeToggle />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="ml-2"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-background">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to="/discover/professionals"
                className="block px-3 py-2 text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Discover Professionals
              </Link>
              <Button
                variant="ghost"
                onClick={() => {
                  openSignIn();
                  setMobileMenuOpen(false);
                }}
                className="w-full justify-start text-muted-foreground hover:text-foreground"
              >
                Sign In
              </Button>
              <Button
                onClick={() => {
                  openSignUp();
                  setMobileMenuOpen(false);
                }}
                className="w-full bg-primary hover:bg-primary/90 mt-2"
              >
                Get Started
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

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
      {/* Public Navigation */}
      <PublicNavbar openSignIn={openSignIn} openSignUp={openSignUp} />
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-background via-background to-muted/20 py-20 sm:py-32">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8">
            {/* Hero content */}
            <div className="space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-foreground leading-tight">
                Share. <span className="text-primary">Connect.</span> Grow.
              </h1>

              <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                A platform for professionals to share their work, connect with peers, and grow their
                network.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Button
                onClick={openSignUp}
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto"
              >
                Create Account
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>

              <Button
                onClick={openSignIn}
                variant="outline"
                size="lg"
                className="border-2 border-border text-foreground hover:bg-muted px-8 py-4 text-lg font-semibold transition-all duration-300 w-full sm:w-auto"
              >
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Why Choose ProFolio?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join thousands of professionals sharing their expertise and growing their network
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-4 p-6 rounded-lg bg-background border border-border hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center mx-auto">
                <Rocket className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Quick Start</h3>
              <p className="text-muted-foreground leading-relaxed">
                Set up your professional portfolio in minutes with our intuitive interface
              </p>
            </div>

            <div className="text-center space-y-4 p-6 rounded-lg bg-background border border-border hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center mx-auto">
                <User className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Share Your Work</h3>
              <p className="text-muted-foreground leading-relaxed">
                Showcase your projects, skills, and expertise to stand out from the crowd
              </p>
            </div>

            <div className="text-center space-y-4 p-6 rounded-lg bg-background border border-border hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center mx-auto">
                <Globe className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Professional Network</h3>
              <p className="text-muted-foreground leading-relaxed">
                Connect with like-minded professionals and expand your network globally
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Public Showcase Section */}
      <section className="py-20 bg-background border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
              Discover Professionals
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Connect with talented professionals from around the world sharing their work and
              expertise
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
                    {/* <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        if (user.friendlyId) {
                          window.open(`/explore/professionals/${user.friendlyId}`);
                        }
                      }}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View Profile
                    </Button> */}
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
                  onClick={() => window.open('/discover/professionals')}
                  className="bg-card hover:bg-primary hover:text-primary-foreground border-border hover:border-primary px-6 py-2 transition-all duration-200"
                >
                  View All Professionals
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}
          </div>

          {/* Call to Action */}
          <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-2xl p-12 text-center border border-border">
            <h3 className="text-2xl font-bold text-foreground mb-4">Ready to Share Your Work?</h3>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
              Join our community of professionals and start showcasing your expertise today
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={openSignUp}
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto"
              >
                Create Account
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                onClick={() => window.open('/discover/professionals', '_blank')}
                size="lg"
                className="border-2 border-border text-foreground hover:bg-muted px-8 py-3 text-lg font-semibold transition-all duration-300 w-full sm:w-auto"
              >
                Browse Professionals
                <ExternalLink className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

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
