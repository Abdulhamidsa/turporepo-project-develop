import React from "react";
import { X } from "lucide-react";
import { Input } from "@repo/ui/components/ui/input";
import { ImageUploaderProps } from "@repo/data/types/types";

const ImageUploader: React.FC<ImageUploaderProps> = ({ images, setImages, isThumbnail = false, error }) => {
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
    if (isThumbnail && fileToRemove instanceof File) {
      setImages([]);
    } else if (!isThumbnail && typeof fileToRemove === "string") {
      setImages(images.filter((img) => img !== fileToRemove));
    } else if (!isThumbnail && fileToRemove instanceof File) {
      setImages(images.filter((file) => file !== fileToRemove));
    }
  };

  return (
    <div>
      <label className="text-foreground">{isThumbnail ? "Project Thumbnail" : "Project Images"}</label>
      <Input type="file" onChange={handleFileSelection} accept="image/*" multiple={!isThumbnail} className=" hidden bg-input text-foreground border-border mt-2" hidden id={isThumbnail ? "thumbnail-upload" : "media-upload"} />
      <label htmlFor={isThumbnail ? "thumbnail-upload" : "media-upload"} className="cursor-pointer">
        <div className="mt-2 p-4 border-dashed border-2 border-gray-300 rounded-lg text-center">Click to {isThumbnail ? "upload thumbnail" : "add images"}</div>
      </label>
      <div className="mt-2">
        {isThumbnail && images.length > 0 && images[0] instanceof File && (
          <div className="relative">
            <img src={URL.createObjectURL(images[0] as File)} alt={`Thumbnail`} className="w-full h-24 object-cover rounded-lg" />
            <button onClick={() => removeFile(images[0])} className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1">
              <X size={14} />
            </button>
          </div>
        )}
        {isThumbnail && typeof images[0] === "string" && (
          <div className="relative">
            <img src={images[0]} alt={`Thumbnail`} className="w-full h-24 object-cover rounded-lg" />
            <button onClick={() => removeFile(images[0])} className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1">
              <X size={14} />
            </button>
          </div>
        )}
        {!isThumbnail && images.length > 0 && (
          <div className="grid grid-cols-2 gap-2 mt-2">
            {images.map((image, index) => (
              <div key={index} className="relative">
                {image instanceof File ? <img src={URL.createObjectURL(image)} alt={`Pending file ${index + 1}`} className="w-full h-24 object-cover rounded-lg" /> : <img src={image} alt={`Project image ${index + 1}`} className="w-full h-24 object-cover rounded-lg" />}
                <button onClick={() => removeFile(image)} className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1">
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      {error && <p className="text-sm text-destructive mt-1">{error}</p>}
    </div>
  );
};

export default ImageUploader;
