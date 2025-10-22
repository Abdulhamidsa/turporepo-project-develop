import { Button } from '@repo/ui/components/ui/button';
import { ArrowRight, User } from 'lucide-react';

import { getCountryFlagIcon } from '../../utils/generateCountryFlag';
import { useFeaturedUsers } from '../hooks/useFeaturedUsers';

function FeauturedProfessionals() {
  const { users, isLoading: usersLoading } = useFeaturedUsers(3);

  return (
    <div>
      {' '}
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
                className="bg-card w-full flex-shrink-0 snap-start px-2 sm:w-1/2 lg:w-1/3 xl:w-1/4 h-40 rounded-full border border-border p-4 hover:border-primary/50 hover:shadow-sm transition-all duration-200"
              >
                <div className="flex items-center mb-3">
                  {/* Profile Picture */}
                  <div className="w-12 h-12 rounded-full overflow-hidden mr-3 flex-shrink-0">
                    {user.profilePicture ? (
                      <img
                        src={user.profilePicture}
                        alt={user.username}
                        className="w-full h-full object-cover flex-1"
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
    </div>
  );
}

export default FeauturedProfessionals;
