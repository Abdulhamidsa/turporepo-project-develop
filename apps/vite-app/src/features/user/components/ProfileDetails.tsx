import { UserProfile } from '@repo/data/types/types';
import { motion } from 'framer-motion';
import { Briefcase, CakeIcon, LucideHome } from 'lucide-react';

import { getCountryFlagIcon } from '../../../../utils/generateCountryFlag';
import ProfilePictureEdit from './ProfilePicture';

interface ProfileDetailsProps {
  userProfile: UserProfile;
}

const ProfileDetails = ({ userProfile }: ProfileDetailsProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-card text-card-foreground relative mb-8 rounded-lg p-3 md:p-6 shadow-xl sm:p-8"
    >
      <div className="flex flex-col items-center sm:flex-row sm:items-start sm:space-x-8">
        {/* Avatar */}
        <div className="cursor-pointer">
          <ProfilePictureEdit label="Profile Picture" field="profilePicture" />
        </div>

        <div className="flex-1 text-center sm:text-left">
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
