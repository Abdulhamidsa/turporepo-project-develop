import { Avatar, AvatarFallback, AvatarImage } from '@repo/ui/components/ui/avatar';
import { cn } from '@repo/ui/lib/utils';
import { Link } from 'react-router-dom';

import { routesConfig } from '../../routes/routesConfig';
import { useUserALL } from '../features/user/hooks/useUserAll';

interface SuggestedUsersProps {
  layout?: 'vertical' | 'horizontal';
}

export default function SuggestedUsers({ layout = 'vertical' }: SuggestedUsersProps) {
  const { users, isLoading, error } = useUserALL(1, 10);

  return (
    <div
      className={cn(
        'bg-background text-foreground rounded-lg p-4 shadow-md',
        layout === 'horizontal' ? 'flex w-full space-x-4 overflow-x-auto py-2' : 'w-full max-w-sm',
      )}
    >
      <h2 className="mb-4 text-lg font-semibold">People You May Know</h2>

      {/* Loading State */}
      {isLoading && <p className="text-muted-foreground text-sm">Loading users...</p>}

      {/* Error State */}
      {error && <p className="text-sm text-red-500">Failed to load users</p>}

      {/* Empty State */}

      <div className={cn(layout === 'horizontal' ? 'flex space-x-4' : 'space-y-4')}>
        {users.map((user) => (
          <div
            key={user.friendlyId}
            className={cn(
              'bg-muted flex items-center space-x-4 rounded-lg p-3',
              layout === 'horizontal' ? 'inline-flex w-64' : 'flex',
            )}
          >
            {/* User Avatar */}

            <Link to={routesConfig.userPortfolioView(user.friendlyId)}>
              <Avatar className="h-12 w-12">
                <AvatarImage
                  src={user.profilePicture || '/default-avatar.png'}
                  alt={user.username || 'User'}
                />
                <AvatarFallback>
                  {user.username ? user.username.slice(0, 2).toUpperCase() : '??'}
                </AvatarFallback>
              </Avatar>
            </Link>

            {/* User Info */}
            <div className="flex-grow">
              <h3 className="font-semibold">{user.username || 'Unknown User'}</h3>
              <p className="text-muted-foreground text-sm">{user.profession || 'No profession'}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
