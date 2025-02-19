import { useState } from 'react';

import FullScreenPictureDialog from './FullScreenPictureDialog';
import ProfilePictureEdit from './ProfilePicture';

interface UserProfile {
  profilePicture?: string;
  username: string;
  friendlyId: string;
  bio?: string;
}

export default function ProfileInfo({ userProfile }: { userProfile: UserProfile }) {
  const [isProfilePicOpen, setIsProfilePicOpen] = useState(false);

  return (
    <div className="flex flex-col items-center sm:flex-row sm:items-start sm:space-x-8">
      <div className="cursor-pointer" onClick={() => setIsProfilePicOpen(true)}>
        <ProfilePictureEdit label="Profile Picture" field="profilePicture" />
      </div>
      <FullScreenPictureDialog
        pictureUrl={userProfile.profilePicture ?? '/placeholder.jpg'}
        isOpen={isProfilePicOpen}
        setIsOpen={setIsProfilePicOpen}
      />
      <div className="flex-1 text-center sm:text-left">
        <h1 className="text-2xl font-bold sm:text-3xl">{userProfile.username}</h1>
        <p className="text-muted-foreground text-lg">@{userProfile.friendlyId}</p>
        <p className="text-foreground mt-6">{userProfile.bio || 'No bio available'}</p>
      </div>
    </div>
  );
}
