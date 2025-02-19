import { motion } from 'framer-motion';
import {
  AlertCircle,
  Briefcase,
  CakeIcon,
  CheckCircle,
  LucideHome,
  TriangleAlert,
} from 'lucide-react';

import { getCountryFlagIcon } from '../../../../utils/generateCountryFlag';
import ProfilePictureEdit from './ProfilePicture';

interface ProfileDetailsProps {
  userProfile: any; // Replace 'any' with a proper user profile type if available.
  onIncompleteProfileClick: () => void;
}

const getProfileStatus = (userProfile: any) => {
  const missingFields = [
    !userProfile.username,
    !userProfile.profession,
    !userProfile.countryOrigin,
    !userProfile.age,
    !userProfile.bio,
    !userProfile.profilePicture,
  ].filter(Boolean).length;

  if (missingFields === 0) {
    return { status: 'Active', color: 'text-green-500', icon: <CheckCircle className="h-8 w-8" /> };
  }

  if (missingFields <= 2) {
    return {
      status: 'Inactive',
      color: 'text-yellow-500',
      icon: <TriangleAlert className="h-8 w-8" />,
    };
  }

  return { status: 'Incomplete', color: 'text-red-500', icon: <AlertCircle className="h-8 w-8" /> };
};

const ProfileDetails = ({ userProfile, onIncompleteProfileClick }: ProfileDetailsProps) => {
  const { status, color, icon } = getProfileStatus(userProfile);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-card text-card-foreground relative mb-8 rounded-lg p-6 shadow-xl sm:p-8"
    >
      <div className="flex flex-col items-center sm:flex-row sm:items-start sm:space-x-8">
        {/* Avatar */}
        <div className="cursor-pointer">
          <ProfilePictureEdit label="Profile Picture" field="profilePicture" />
        </div>

        {/* Main Content */}
        <div className="flex-1 text-center sm:text-left">
          <div className="absolute right-6 top-4 flex items-center space-x-2">
            <span className={`${color} font-bold`}>{status}</span>
            <div className={`${color} cursor-pointer`} onClick={onIncompleteProfileClick}>
              {icon}
            </div>
          </div>

          <h1 className="text-2xl font-bold sm:text-3xl md:text-4xl">{userProfile.username}</h1>
          <p className="text-muted-foreground text-lg sm:text-xl">@{userProfile.friendlyId}</p>

          <div className="mt-4 space-y-2">
            <p className="text-muted-foreground flex items-center justify-center sm:justify-start">
              <Briefcase className="mr-2 h-5 w-5" />
              {userProfile.profession || 'No profession listed'}
            </p>
            <p className="text-muted-foreground flex items-center justify-center sm:justify-start">
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
            <div className="text-muted-foreground flex items-center justify-center sm:justify-start">
              <CakeIcon className="mr-2 h-5 w-5" />
              {userProfile.age ? `${userProfile.age}` : 'Age not provided'}
            </div>
          </div>

          <p className="text-foreground mt-6">{userProfile.bio || 'No bio available'}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileDetails;
