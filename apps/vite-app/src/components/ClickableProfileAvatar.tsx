import { useState } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@repo/ui/components/ui/avatar';
import { cn } from '@repo/ui/lib/utils';

import FullScreenPictureDialog from '../features/user/components/FullScreenPictureDialog';

interface ClickableProfileAvatarProps {
  profilePicture?: string | null;
  username?: string | null | undefined;
  friendlyId?: string | undefined;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showClickHint?: boolean;
}

const sizeClasses = {
  sm: 'h-12 w-12',
  md: 'h-16 w-16',
  lg: 'h-24 w-24',
  xl: 'h-40 w-40',
};

const fallbackTextSizes = {
  sm: 'text-sm',
  md: 'text-lg',
  lg: 'text-2xl',
  xl: 'text-5xl',
};

/**
 * Reusable clickable profile avatar component that:
 * - Shows profile picture or user initials
 * - Opens full-screen view on click
 * - Handles missing profile pictures gracefully
 */
const ClickableProfileAvatar = ({
  profilePicture,
  username,
  friendlyId,
  size = 'md',
  className,
  showClickHint = false,
}: ClickableProfileAvatarProps) => {
  const [isProfilePicOpen, setIsProfilePicOpen] = useState(false);

  // Generate initials from username or friendlyId
  const getInitials = () => {
    const name = username || friendlyId || 'User';
    return name
      .split(/[\s-_.]/)
      .filter((part) => part.length > 0)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join('');
  };

  const handleClick = () => {
    setIsProfilePicOpen(true);
  };

  return (
    <>
      <Avatar
        className={cn(
          sizeClasses[size],
          'cursor-pointer transition-all duration-200 hover:ring-4 hover:ring-primary/20',
          showClickHint && 'ring-2 ring-primary/30 animate-pulse',
          className,
        )}
        onClick={handleClick}
      >
        <AvatarImage
          src={profilePicture || '/placeholder.png'}
          className="object-cover"
          alt={`${username || friendlyId}'s profile picture`}
        />
        <AvatarFallback
          className={cn(
            'bg-gradient-to-br from-primary to-secondary text-white font-bold',
            fallbackTextSizes[size],
          )}
        >
          {getInitials()}
        </AvatarFallback>
      </Avatar>

      {/* Full Screen Profile Picture Dialog */}
      <FullScreenPictureDialog
        pictureUrl={profilePicture || '/placeholder.png'}
        {...(username !== null && username !== undefined && { username })}
        {...(friendlyId !== undefined && { friendlyId })}
        isOpen={isProfilePicOpen}
        setIsOpen={setIsProfilePicOpen}
      />
    </>
  );
};

export default ClickableProfileAvatar;
