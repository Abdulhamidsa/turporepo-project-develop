import { Avatar, AvatarFallback, AvatarImage } from '@repo/ui/components/ui/avatar';
import { cn } from '@repo/ui/lib/utils';
import { useNavigate } from 'react-router-dom';

import { routesConfig } from '../../routes/routesConfig';
import { useAuth } from '../features/user/hooks/use.auth';
import { useUserALL } from '../features/user/hooks/useUserAll';

interface SuggestedUsersProps {
  layout?: 'vertical' | 'horizontal' | 'grid';
}

export default function SuggestedUsers({ layout = 'vertical' }: SuggestedUsersProps) {
  const { users, isLoading, error } = useUserALL(1, 10);
  const { loggedUser } = useAuth();
  const navigate = useNavigate();

  const handleUserClick = (userFriendlyId: string) => {
    if (!loggedUser) {
      // Non-logged-in users go to public route with blurred content
      navigate(`/explore/professionals/${userFriendlyId}`);
    } else if (loggedUser.friendlyId === userFriendlyId) {
      // Navigate to manage mode for own profile
      navigate(routesConfig.userPortfolio(userFriendlyId));
    } else {
      // Logged-in users viewing others go to ProfileView route (full access)
      navigate(routesConfig.userPortfolioView(userFriendlyId));
    }
  };

  if (layout === 'grid') {
    return (
      <div className="w-full">
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          </div>
        )}

        {error && (
          <div className="text-center py-8 text-destructive">
            <p>Failed to load professionals</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {users.map((user) => (
            <div
              key={user.friendlyId}
              onClick={() => handleUserClick(user.friendlyId)}
              className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 cursor-pointer hover:bg-card/70 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <Avatar className="h-16 w-16 ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all duration-200">
                  <AvatarImage
                    src={user.profilePicture || '/default-avatar.png'}
                    alt={user.username || 'User'}
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-lg font-semibold text-primary">
                    {user.username ? user.username.slice(0, 2).toUpperCase() : '??'}
                  </AvatarFallback>
                </Avatar>

                <div className="space-y-2">
                  <h3 className="font-semibold text-foreground text-lg group-hover:text-primary transition-colors duration-200">
                    {user.username || 'Unknown User'}
                  </h3>
                  <p className="text-muted-foreground text-sm font-medium">
                    {user.profession || 'Professional'}
                  </p>
                </div>

                <button className="w-full px-4 py-2 bg-primary/10 text-primary rounded-xl hover:bg-primary/20 transition-colors duration-200 font-medium text-sm">
                  View Profile
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'bg-background text-foreground rounded-lg p-4 shadow-md',
        layout === 'horizontal' ? 'flex w-full space-x-4 overflow-x-auto py-2' : 'w-full max-w-sm',
        layout === 'vertical' && 'sticky top-24',
      )}
    >
      <h2 className="mb-4 text-lg font-semibold">People You May Know</h2>

      {isLoading && <p className="text-muted-foreground text-sm">Loading users...</p>}

      {error && <p className="text-sm text-red-500">Failed to load users</p>}

      <div className={cn(layout === 'horizontal' ? 'flex space-x-4' : 'space-y-4')}>
        {users.map((user) => (
          <div
            key={user.friendlyId}
            onClick={() => handleUserClick(user.friendlyId)}
            className={cn(
              'bg-muted/40 flex items-center space-x-4 rounded-xl p-4 cursor-pointer hover:bg-muted/60 transition-all duration-200 border border-border/30',
              layout === 'horizontal' ? 'inline-flex w-64' : 'flex',
            )}
          >
            <div>
              <Avatar className="h-12 w-12 ring-1 ring-primary/20">
                <AvatarImage
                  src={user.profilePicture || '/default-avatar.png'}
                  alt={user.username || 'User'}
                  className="object-cover"
                />
                <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-semibold">
                  {user.username ? user.username.slice(0, 2).toUpperCase() : '??'}
                </AvatarFallback>
              </Avatar>
            </div>

            <div className="flex-grow">
              <h3 className="font-semibold text-foreground">{user.username || 'Unknown User'}</h3>
              <p className="text-muted-foreground text-sm">{user.profession || 'Professional'}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
