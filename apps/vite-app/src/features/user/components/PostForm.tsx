import { useState } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@repo/ui/components/ui/avatar';
import { showToast } from '@repo/ui/components/ui/toaster';
import { ImagePlus } from 'lucide-react';

import { uploadToCloudinary } from '../../../../utils/CloudinaryConfige';
import { usePostSubmit } from '../../../hooks/useCreatePost';
import SaveButton from '../../projects/components/SaveButton';
import { useUserProfile } from '../hooks/use.user.profile';

export function PostForm({ onClose }: { onClose: () => void }) {
  const { userProfile } = useUserProfile();
  const friendlyId = userProfile?.friendlyId ?? '';
  const [content, setContent] = useState<string>('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

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

  const handleSubmit = async () => {
    if (!content && !image) {
      showToast('At least a text or an image is required.', 'error');
      return;
    }

    try {
      setIsLoading(true);
      setProgress(10);

      let imageUrl: string = '';
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
    <div className="bg-card text-card-foreground mx-auto w-full max-w-md rounded-[var(--radius)] shadow-lg">
      <h3 className="text-foreground text-lg font-semibold">Create Post</h3>
      <div className="p-4">
        <div className="mb-4 flex items-center space-x-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={userProfile.profilePicture ?? '/placeholder.png'} alt="Your Name" />
            <AvatarFallback>{userProfile.username?.charAt(0).toUpperCase() ?? 'U'}</AvatarFallback>
          </Avatar>
          <span className="text-foreground text-sm font-semibold">{userProfile.username}</span>
        </div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          className="border-border bg-muted text-muted-foreground focus:ring-ring h-20 w-full rounded-[var(--radius)] border p-2 text-sm focus:outline-none focus:ring-2"
        />
        <div className="relative mt-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            className="border-border bg-muted hover:border-muted-foreground flex h-24 w-full cursor-pointer items-center justify-center rounded-[var(--radius)] border-2 border-dashed transition-colors duration-300"
          >
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Preview"
                className="max-h-full rounded-[var(--radius)] object-contain"
              />
            ) : (
              <div className="flex flex-col items-center">
                <ImagePlus className="text-muted-foreground h-6 w-6" />
                <span className="text-muted-foreground mt-1 text-xs">Add an image</span>
              </div>
            )}
          </label>
        </div>
      </div>

      {/* 🔥 Updated Save Button with Better Progress Bar */}
      <div className="flex justify-end p-4">
        <SaveButton onClick={handleSubmit} loading={isLoading} label="Post" progress={progress} />
      </div>

      {error && <p className="text-destructive mt-2 text-center text-sm">{error.message}</p>}
    </div>
  );
}
