import { UserProfile } from '@repo/data/types/types';
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

  return (
    <header className="bg-muted border-border sticky top-0 z-50 border-b shadow-sm">
      <div className="mx-auto flex h-full items-center justify-between p-4 md:ml-16 md:mr-8">
        <Link to="/" className="text-primary hover:text-primary-foreground text-xl font-bold">
          ProFolio
        </Link>
        <div className="flex items-center space-x-4">
          {/* Profile Status Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={`flex items-center space-x-2 rounded-lg px-3 py-1 text-sm font-medium ${
                  profileComplete ? 'text-green-500' : 'text-red-500'
                } hover:bg-accent hover:text-accent-foreground focus:outline-none`}
              >
                {profileComplete ? (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    <span>Active</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-4 w-4" />
                    <span>Not Active</span>
                  </>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-card text-card-foreground w-64 rounded-lg shadow-lg">
              <DropdownMenuLabel className="text-muted-foreground">
                Profile Status
              </DropdownMenuLabel>
              {profileComplete ? (
                <DropdownMenuItem className="p-3 text-sm">
                  Your profile is **active**, and your portfolio is now visible on the public
                  domain.
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  className="hover:bg-accent hover:text-accent-foreground cursor-pointer p-3 text-sm"
                  onClick={() => navigate('/manage')}
                >
                  Your profile is **not active**. Complete your profile to make your portfolio
                  public!
                  <br />
                  <br />
                  **Click here to update your profile.**
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

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
