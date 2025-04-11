import { useMemo, useRef, useState } from 'react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@repo/ui/components/ui/dropdown-menu';
import { showToast } from '@repo/ui/components/ui/toaster';
import { Camera, Loader } from 'lucide-react';

import { uploadToCloudinary } from '../../../../utils/cloudinary/CloudinaryConfige';
import { useUserProfile } from '../hooks/use.user.profile';
import { useUpdateUserProfile } from '../hooks/useUpdateUserProfile';

interface ProfilePictureEditProps {
  label: string;
  field: 'profilePicture';
}

export default function ProfilePictureEdit({ label, field }: ProfilePictureEditProps) {
  const { userProfile, mutate } = useUserProfile();
  const { updateProfile } = useUpdateUserProfile();
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const imageSrc = useMemo(() => userProfile[field] || '/placeholder.png', [userProfile, field]);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const [uploadedUrl] = await uploadToCloudinary([file]);
      await updateProfile({ [field]: uploadedUrl });
      await mutate();

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      showToast(`${label} updated successfully!`);
    } catch (error) {
      console.error('Failed to upload image:', error);
      showToast('Error uploading image.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = async () => {
    if (!userProfile[field]) return;

    setIsUploading(true);
    try {
      await updateProfile({ [field]: '' });
      await mutate();
      showToast(`${label} removed successfully!`);
    } catch (error) {
      console.error('Failed to remove image:', error);
      showToast('Error removing image.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center">
      <img
        src={imageSrc}
        alt={label}
        className="border-border h-32 w-32 rounded-full border object-cover shadow-md md:h-52 md:w-52"
      />
      {isUploading && (
        <div className="bg-muted absolute inset-0 flex items-center justify-center rounded-full bg-opacity-75">
          <Loader className="text-primary h-10 w-10 animate-spin" />
        </div>
      )}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="bg-primary text-primary-foreground hover:bg-primary-hover absolute bottom-0 right-0 mb-2 mr-2 flex h-10 w-10 items-center justify-center rounded-full shadow-lg md:h-12 md:w-12"
            disabled={isUploading}
          >
            <Camera className="h-5 w-5 md:h-6 md:w-6" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-card text-card-foreground w-36 rounded-lg shadow-lg">
          {/* Upload Option */}
          <DropdownMenuItem
            onClick={() => fileInputRef.current?.click()}
            className="hover:bg-accent hover:text-accent-foreground rounded-md p-2"
          >
            Upload
          </DropdownMenuItem>
          {/* Capture Option */}
          <DropdownMenuItem
            onClick={() => {
              if (fileInputRef.current) {
                fileInputRef.current.setAttribute('capture', 'environment'); // Rear camera
                fileInputRef.current.click();
              }
            }}
            className="hover:bg-accent hover:text-accent-foreground rounded-md p-2"
          >
            Take Picture
          </DropdownMenuItem>
          {/* Remove Image Option */}
          <DropdownMenuItem
            onClick={handleRemoveImage}
            className="hover:bg-destructive hover:text-destructive-foreground rounded-md p-2"
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
        disabled={isUploading}
      />
    </div>
  );
}
