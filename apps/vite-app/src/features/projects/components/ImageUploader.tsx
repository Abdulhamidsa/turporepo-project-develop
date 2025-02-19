import React, { useState } from 'react';

import { ImageUploaderProps } from '@repo/data/types/types';
import CustomModal from '@repo/ui/components/CustomModal';
import { Input } from '@repo/ui/components/ui/input';
import { Search, X } from 'lucide-react';

const ImageUploader: React.FC<ImageUploaderProps> = ({
  images,
  setImages,
  isThumbnail = false,
  error,
}) => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleFileSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      if (isThumbnail) {
        setImages([e.target.files[0]]);
      } else {
        setImages([...images, ...Array.from(e.target.files)]);
      }
    }
  };

  const removeFile = (fileToRemove: File | string) => {
    setImages(images.filter((img) => img !== fileToRemove));
  };

  const openPreview = (image: File | string) => {
    setPreviewImage(image instanceof File ? URL.createObjectURL(image) : image);
  };

  return (
    <div>
      <label className="text-foreground">
        {isThumbnail ? 'Project Thumbnail' : 'Project Images'}
      </label>
      <Input
        type="file"
        onChange={handleFileSelection}
        accept="image/*"
        multiple={!isThumbnail}
        className="hidden"
        id={isThumbnail ? 'thumbnail-upload' : 'media-upload'}
      />
      <label htmlFor={isThumbnail ? 'thumbnail-upload' : 'media-upload'} className="cursor-pointer">
        <div className="mt-2 rounded-lg border-2 border-dashed border-gray-300 p-4 text-center">
          Click to {isThumbnail ? 'upload thumbnail' : 'add images'}
        </div>
      </label>

      <div className="mt-2">
        {/* Thumbnail Preview */}
        {isThumbnail && images.length > 0 && (
          <div className="group relative h-24 w-24">
            <img
              src={images[0] instanceof File ? URL.createObjectURL(images[0]) : images[0]}
              alt="Thumbnail"
              className="h-full w-full rounded-lg object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
            />
            {/* Hover Overlay with Magnifying Icon (Clickable Now) */}
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <Search
                className="h-6 w-6 cursor-pointer text-white"
                onClick={() => openPreview(images[0])}
              />
            </div>
            {/* Remove Image Button */}
            <button
              onClick={() => removeFile(images[0])}
              className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-white shadow-md hover:bg-red-700"
            >
              <X size={14} />
            </button>
          </div>
        )}

        {/* Multiple Image Previews */}
        {!isThumbnail && images.length > 0 && (
          <div className="mt-2 grid grid-cols-2 gap-2">
            {images.map((image, index) => (
              <div key={index} className="group relative h-24 w-24">
                <img
                  src={image instanceof File ? URL.createObjectURL(image) : image}
                  alt={`Project image ${index + 1}`}
                  className="h-full w-full rounded-lg object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                />
                {/* Hover Overlay with Magnifying Icon (Clickable Now) */}
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <Search
                    className="h-6 w-6 cursor-pointer text-white"
                    onClick={() => openPreview(image)}
                  />
                </div>
                {/* Remove Image Button */}
                <button
                  onClick={() => removeFile(image)}
                  className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-white shadow-md hover:bg-red-700"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}

      {/* Fullscreen Image Preview Modal */}
      <CustomModal isOpen={!!previewImage} onClose={() => setPreviewImage(null)} size="lg">
        {/* Enlarged Image - No Extra "X" Button */}
        <img
          src={previewImage || ''}
          alt="Preview"
          className="m-auto max-h-[60vh] w-full rounded-lg object-contain"
        />
      </CustomModal>
    </div>
  );
};

export default ImageUploader;
