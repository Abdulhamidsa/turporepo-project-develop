import { Briefcase, CakeIcon, LucideHome } from 'lucide-react';
import { useParams } from 'react-router-dom';

import { getCountryFlagIcon } from '../../utils/generateCountryFlag';
import { useUserProfileView } from '../features/user/hooks/useUserProfileView';

function ProfileCardView() {
  const { userProfile } = useUserProfileView();
  const params = useParams();

  // Debug info to help identify issues
  console.log('ProfileCardView params:', params, 'userProfile:', userProfile);

  return (
    <>
      {/* Profile Card Section */}
      <div className="bg-popover relative mx-auto -mt-24 w-full max-w-5xl p-6 shadow-lg">
        <div className="flex flex-col items-center sm:flex-row sm:items-start">
          <div className="relative h-40 w-40 rounded-full border-4 border-white shadow-lg">
            <img
              src={userProfile.profilePicture || '/default-avatar.png'}
              alt="Profile"
              className="h-full w-full rounded-full object-cover"
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
                  <span
                    className={`flag-icon flag-icon-${getCountryFlagIcon(userProfile.countryOrigin)}`}
                    style={{ fontSize: '20px' }}
                  ></span>
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
