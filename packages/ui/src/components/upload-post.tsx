'use client';

import { useState } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@repo/ui/components/ui/avatar';
import { Button } from '@repo/ui/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@repo/ui/components/ui/card';
import { ImagePlus, X } from 'lucide-react';

import { RichTextEditor } from './rich-text-editor';

interface UploadPostProps {
  onClose: () => void;
  onSubmit: (content: string, image: File | null) => void;
}

export function UploadPost({ onClose, onSubmit }: UploadPostProps) {
  const [content, setContent] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

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

  const handleSubmit = () => {
    onSubmit(content, image);
    onClose();
  };

  return (
    <Card className="mx-auto w-full max-w-xl bg-white dark:bg-gray-800">
      <CardHeader className="flex items-center justify-between p-4">
        <h3 className="text-lg font-semibold">Create Post</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="p-4">
        <div className="mb-4 flex items-center space-x-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder-avatar.jpg" alt="Your Name" />
            <AvatarFallback>YN</AvatarFallback>
          </Avatar>
          <span className="text-sm font-semibold">Your Name</span>
        </div>
        <RichTextEditor onChange={(editorState) => setContent(editorState)} />
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
            className="flex h-24 w-full cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-gray-300 transition-colors duration-300 hover:border-gray-400"
          >
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="rounded-md" />
            ) : (
              <div className="flex flex-col items-center">
                <ImagePlus className="h-6 w-6 text-gray-400" />
                <span className="mt-1 text-xs text-gray-500">Add an image</span>
              </div>
            )}
          </label>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end p-4">
        <Button onClick={handleSubmit}>Post</Button>
      </CardFooter>
    </Card>
  );
}
