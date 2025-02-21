import { useEffect, useState } from 'react';

import { UserProfile } from '@repo/data/types/types';
import CustomModal from '@repo/ui/components/CustomModal';
import { Avatar, AvatarFallback, AvatarImage } from '@repo/ui/components/ui/avatar';
import { Button } from '@repo/ui/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@repo/ui/components/ui/dropdown-menu';
import { AlertCircle, CheckCircle, LogOut, Settings } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

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
  const { signOut, loggedUser } = useAuth();
  const navigate = useNavigate();
  const { userProfile } = useUserProfile();

  const profileComplete = isProfileComplete(userProfile);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Persistent countdown state for active profile (in seconds)
  const [countdown, setCountdown] = useState<number>(45);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    // Start countdown only if profile is complete and countdown is not finished
    if (profileComplete && countdown > 0) {
      // Only set up interval if one is not already running
      if (!interval) {
        interval = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              if (interval) clearInterval(interval);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [profileComplete, countdown]);

  const handleUpdateProfileClick = () => {
    setIsModalOpen(false);
    navigate('/profile/edit');
  };

  return (
    <header className="bg-muted border-border sticky top-0 z-50 border-b shadow-sm">
      <div className="mx-auto flex h-full items-center justify-between p-4 md:ml-16 md:mr-8">
        <Link to="/" className="text-primary hover:text-primary-foreground text-xl font-bold">
          ProFolio
        </Link>
        <div className="flex items-center space-x-4">
          {/* Profile Status Button (Opens Modal) */}
          <button
            className={`hover:bg-accent hover:text-accent-foreground flex items-center space-x-2 rounded-lg px-3 py-1 text-sm font-medium focus:outline-none ${
              profileComplete
                ? countdown > 0
                  ? 'text-orange-500'
                  : 'text-green-500'
                : 'text-red-500'
            }`}
            onClick={() => setIsModalOpen(true)}
          >
            {profileComplete ? (
              countdown > 0 ? (
                <AlertCircle className="h-4 w-4" />
              ) : (
                <CheckCircle className="h-4 w-4" />
              )
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <span>
              {profileComplete
                ? countdown > 0
                  ? `Pending (${countdown}s)`
                  : 'Active'
                : 'Not Active'}
            </span>
          </button>

          {/* Profile Status Modal */}
          <CustomModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} size="md">
            <h2 className="text-primary mb-2 text-lg font-bold">Profile Status</h2>
            {profileComplete ? (
              countdown > 0 ? (
                // While countdown is active, show pending status
                <p className="text-muted-foreground">
                  Your profile is <strong>pending</strong>—it is being updated. Please wait{' '}
                  {countdown} seconds.
                </p>
              ) : (
                // When countdown is done, show active status with link
                <>
                  <p className="text-muted-foreground">
                    Your profile is <strong>active</strong>, and your portfolio is now visible on
                    the public domain.
                  </p>
                  <Link
                    to={`https://profoliohub.vercel.app/user/${loggedUser?.friendlyId}`}
                    target="_blank"
                    className="text-primary hover:text-primary-foreground underline"
                  >
                    {`profoliohub.vercel.app/${loggedUser?.friendlyId}`}
                  </Link>
                </>
              )
            ) : (
              // If profile is incomplete, prompt to update profile
              <>
                <p className="text-muted-foreground">
                  Your profile is <strong>not active</strong>. Complete your profile to make your
                  portfolio public.
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

          {/* User Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="hover:bg-muted border-border flex h-12 w-12 items-center space-x-2 rounded-full border p-2 transition focus-visible:ring"
              >
                <Avatar>
                  {loggedUser && loggedUser.profilePicture ? (
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
                onClick={() => navigate('/settings')}
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
        </div>
      </div>
    </header>
  );
}
