'use client';

import type React from 'react';
import { useEffect, useState } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@repo/ui/components/ui/avatar';
import { showToast } from '@repo/ui/components/ui/toaster';
import { ImagePlus, X } from 'lucide-react';

import { uploadToCloudinary } from '../../../../utils/cloudinary/CloudinaryConfige';
import { usePostSubmit } from '../../../hooks/useCreatePost';
import SaveButton from '../../projects/components/SaveButton';
import { useUserProfile } from '../hooks/use.user.profile';

export function PostForm({
  onClose,
  initialContent = '',
}: {
  onClose: () => void;
  initialContent?: string;
}) {
  const { userProfile } = useUserProfile();
  const friendlyId = userProfile?.friendlyId ?? '';
  const [content, setContent] = useState<string>(initialContent);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (initialContent) {
      setContent(initialContent);
    }
  }, [initialContent]);

  const { trigger, error } = usePostSubmit(friendlyId);
  const [progress, setProgress] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  const handleSubmit = async () => {
    if (!content && !image) {
      showToast('At least a text or an image is required.', 'error');
      return;
    }

    try {
      setIsLoading(true);
      setProgress(10);

      let imageUrl = '';
      if (image) {
        setProgress(30);
        const urls = await uploadToCloudinary([image]);
        setProgress(70);
        imageUrl = urls[0];
      }

      setProgress(85);
      const payload = { content, image: imageUrl };
      await trigger(payload);

      setProgress(100);
      await new Promise((resolve) => setTimeout(resolve, 500));

      setProgress(0);
      setIsLoading(false);
      showToast('Post uploaded successfully!', 'success');
      onClose();
    } catch (err) {
      console.error('Error uploading post:', err);
      showToast('Failed to upload post.', 'error');
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-card text-card-foreground mx-auto w-full max-w-lg rounded-lg p-4 shadow-lg sm:p-6">
      <h3 className="text-foreground pb-4 text-xl font-semibold">Add a Post</h3>

      <div className="mb-4 flex items-center space-x-3">
        <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
          <AvatarImage src={userProfile.profilePicture ?? '/placeholder.png'} alt="Your Name" />
          <AvatarFallback>{userProfile.username?.charAt(0).toUpperCase() ?? 'U'}</AvatarFallback>
        </Avatar>
        <span className="text-foreground text-sm font-semibold sm:text-base">
          {userProfile.username}
        </span>
      </div>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's on your mind?"
        className="border-border bg-muted text-muted-foreground focus:ring-primary h-24 w-full rounded-md border p-3 text-sm focus:outline-none focus:ring-2 sm:text-base"
      />

      {imagePreview && (
        <div className="relative mt-4 flex items-center justify-center">
          <img
            src={imagePreview}
            alt="Preview"
            className="h-auto max-h-[200px] w-auto max-w-full rounded-md object-contain"
          />
          <button
            className="absolute right-2 top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
            onClick={removeImage}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Smaller Upload Button */}
      {!imagePreview && (
        <div className="relative mt-4 flex flex-col items-center">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            className="border-border bg-muted hover:border-muted-foreground flex h-20 w-full cursor-pointer items-center justify-center rounded-md border border-dashed transition-all duration-300"
          >
            <div className="flex flex-col items-center">
              <ImagePlus className="text-muted-foreground h-6 w-6" />
              <span className="text-muted-foreground mt-1 text-xs">Click to add an image</span>
            </div>
          </label>
        </div>
      )}

      <div className="flex justify-end pt-4">
        <SaveButton onClick={handleSubmit} loading={isLoading} label="Post" progress={progress} />
      </div>

      {error && <p className="mt-2 text-center text-sm text-red-500">{error.message}</p>}
    </div>
  );
}
