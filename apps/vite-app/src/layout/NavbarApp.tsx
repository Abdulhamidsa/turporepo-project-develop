import { useState } from 'react';

import { UserProfile } from '@repo/data/types/types';
import CustomModal from '@repo/ui/components/CustomModal';
import { Avatar, AvatarFallback, AvatarImage } from '@repo/ui/components/ui/avatar';
import { Button } from '@repo/ui/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@repo/ui/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@repo/ui/components/ui/dropdown-menu';
import { AlertCircle, CheckCircle, LogOut, Settings } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { routesConfig } from '../../routes/routesConfig';
import SignupForm from '../features/auth/components/SignUpForm';
import SigninForm from '../features/auth/components/SigninForm';
import { useAuth } from '../features/user/hooks/use.auth';
import { useUserProfile } from '../features/user/hooks/use.user.profile';
import { DarkModeToggle } from './DarkModeToggle';

const isProfileComplete = (userProfile: UserProfile) => {
  return (
    userProfile.username &&
    userProfile.profession &&
    userProfile.countryOrigin &&
    userProfile.age &&
    userProfile.bio &&
    userProfile.profilePicture
  );
};

export function NavbarApp() {
  const { signOut, loggedUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { userProfile } = useUserProfile();

  const profileComplete = userProfile ? isProfileComplete(userProfile) : false;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [authModal, setAuthModal] = useState<{
    mode: 'signin' | 'signup' | null;
    prefillValues?: { email?: string } | undefined;
  }>({ mode: null });

  const isAuthPage = location.pathname === '/';
  const isHomePage = location.pathname === '/';
  const isFeedPage = location.pathname === '/feed';

  const handleUpdateProfileClick = () => {
    setIsModalOpen(false);
    navigate(routesConfig.profile);
  };

  return (
    <header className="bg-muted border-border sticky top-0 z-50 border-b shadow-sm">
      <div
        className={`mx-auto flex h-full items-center justify-between p-4 ${
          !isAuthPage && isAuthenticated ? 'md:ml-16 md:mr-8' : 'container'
        }`}
      >
        <Link to="/" className="text-primary hover:text-primary-foreground text-xl font-bold">
          ProFolio
        </Link>

        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <button
                className={`hover:bg-accent hover:text-accent-foreground flex items-center space-x-2 rounded-lg px-3 py-1 text-sm font-medium focus:outline-none ${
                  profileComplete ? 'text-green-500' : 'text-red-500'
                }`}
                onClick={() => setIsModalOpen(true)}
              >
                {profileComplete ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                <span>{profileComplete ? 'Active' : 'Not Active'}</span>
              </button>

              <CustomModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} size="md">
                <h2 className="text-primary mb-2 text-lg font-bold">Profile Status</h2>

                {profileComplete ? (
                  <>
                    <p className="text-muted-foreground">
                      Your profile is <strong>active</strong> and your portfolio is now visible.
                    </p>

                    <Link
                      to={`https://profolio-hub.abdulhamidma.com${routesConfig.userPortfolioView(
                        loggedUser?.friendlyId || '',
                      )}`}
                      target="_blank"
                      className="text-primary hover:text-primary-foreground underline"
                    >
                      {`profolio-hub.abdulhamidma.com${routesConfig.userPortfolioView(
                        loggedUser?.friendlyId || '',
                      )}`}
                    </Link>
                  </>
                ) : (
                  <>
                    <p className="text-muted-foreground">
                      Your profile is <strong>not active</strong>. Complete your profile to make
                      your portfolio public.
                    </p>

                    <div className="mt-4">
                      <button
                        onClick={handleUpdateProfileClick}
                        className="text-primary hover:text-primary-foreground font-medium underline"
                      >
                        Click here to update your profile.
                      </button>
                    </div>
                  </>
                )}
              </CustomModal>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="hover:bg-muted border-border flex h-12 w-12 items-center space-x-2 rounded-full border p-2 transition focus-visible:ring"
                  >
                    <Avatar>
                      {loggedUser?.profilePicture ? (
                        <AvatarImage
                          src={loggedUser.profilePicture}
                          alt={loggedUser.username || 'User avatar'}
                        />
                      ) : (
                        <AvatarFallback>{loggedUser?.username?.charAt(0) || 'U'}</AvatarFallback>
                      )}
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="bg-card text-card-foreground w-48 rounded-lg shadow-lg">
                  <DropdownMenuLabel className="text-muted-foreground">Account</DropdownMenuLabel>

                  <DropdownMenuItem
                    onClick={() => navigate(routesConfig.settings)}
                    className="hover:bg-accent hover:text-accent-foreground flex items-center space-x-2 rounded-md p-2"
                  >
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={signOut}
                    className="hover:bg-accent hover:text-accent-foreground flex items-center space-x-2 rounded-md p-2"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>

                  <div className="flex justify-center py-2">
                    <DarkModeToggle />
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link
                to="/"
                className={`mr-4 hidden transition-colors md:flex ${
                  isHomePage ? 'text-primary font-semibold' : 'text-foreground hover:text-primary'
                }`}
              >
                Home
              </Link>

              <Link
                to="/feed"
                className={`mr-4 hidden transition-colors md:flex ${
                  isFeedPage ? 'text-primary font-semibold' : 'text-foreground hover:text-primary'
                }`}
              >
                Explore
              </Link>

              <Button
                onClick={() => setAuthModal({ mode: 'signup' })}
                className="bg-primary text-white hover:bg-accent"
              >
                Sign Up
              </Button>

              <Dialog open={!!authModal.mode} onOpenChange={() => setAuthModal({ mode: null })}>
                <DialogContent className="bg-card border-border w-[95%] max-w-md border p-0">
                  <div className="p-8">
                    <DialogTitle className="sr-only">
                      {authModal.mode === 'signin' ? 'Sign In' : 'Create Account'}
                    </DialogTitle>

                    {authModal.mode === 'signin' ? (
                      <SigninForm
                        setIsSignIn={(val) => setAuthModal({ mode: val ? 'signin' : 'signup' })}
                        prefillValues={authModal.prefillValues}
                      />
                    ) : (
                      <SignupForm
                        setIsSignIn={(val, prefill) =>
                          setAuthModal({
                            mode: val ? 'signin' : 'signup',
                            ...(prefill && { prefillValues: prefill }),
                          })
                        }
                      />
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
