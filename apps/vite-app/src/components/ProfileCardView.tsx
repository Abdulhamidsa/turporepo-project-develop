import { Briefcase, CakeIcon, LucideHome } from 'lucide-react';

import { getCountryFlagIcon } from '../../utils/generateCountryFlag';
import { useUserProfileView } from '../features/user/hooks/useUserProfileView';
import ClickableProfileAvatar from './ClickableProfileAvatar';

function ProfileCardView() {
  const { userProfile } = useUserProfileView();

  return (
    <>
      {/* Profile Card Section */}
      <div className="bg-popover relative -mt-24 w-full max-w-5xl p-6 shadow-lg mx-auto">
        <div className="flex flex-col items-center sm:flex-row sm:items-start">
          <div className="relative">
            <ClickableProfileAvatar
              profilePicture={userProfile.profilePicture || null}
              username={userProfile.username || null}
              friendlyId={userProfile.friendlyId}
              size="xl"
              className="border-4 border-white shadow-lg"
            />
          </div>

          <div className="mt-6 flex-1 text-center sm:ml-10 sm:mt-0 sm:text-left">
            <h2 className="text-foreground text-3xl font-bold">{userProfile.username}</h2>
            <p className="text-lg">@{userProfile.friendlyId}</p>
            <p className="text-muted-foreground mt-1">{userProfile.bio || 'No bio available'}</p>
            <div className="text-muted-foreground mt-4 space-y-2">
              <p className="flex items-center justify-center sm:justify-start">
                <Briefcase className="mr-2 h-5 w-5" />
                {userProfile.profession || 'No profession listed'}
              </p>
              <p className="flex items-center justify-center sm:justify-start">
                <LucideHome className="mr-2 h-5 w-5" />
                {userProfile.countryOrigin ? (
                  <img
                    src={`https://flagcdn.com/48x36/${getCountryFlagIcon(userProfile.countryOrigin)}.png`}
                    alt={`${userProfile.countryOrigin} flag`}
                    className="h-5 w-7 rounded-sm border border-gray-300 object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <span>No country listed</span>
                )}
              </p>
              <p className="flex items-center justify-center sm:justify-start">
                <CakeIcon className="mr-2 h-5 w-5" />
                {userProfile.age ? `${userProfile.age} years old` : 'Age not provided'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProfileCardView;
