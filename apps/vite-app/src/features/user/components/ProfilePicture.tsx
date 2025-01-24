import { useRef, useState, useMemo } from "react";
import { Camera, Loader } from "lucide-react";
import { showToast } from "@repo/ui/components/ui/toaster";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@repo/ui/components/ui/dropdown-menu";
import { useUserProfile } from "../hooks/use.user.profile";
import { uploadToCloudinary } from "../../../../utils/CloudinaryConfige";
import { useUpdateUserProfile } from "../hooks/useUpdateUserProfile";

interface ProfilePictureEditProps {
  label: string;
  field: "profilePicture";
}

export default function ProfilePictureEdit({ label, field }: ProfilePictureEditProps) {
  const { userProfile, mutate } = useUserProfile();
  const { updateProfile } = useUpdateUserProfile();
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const imageSrc = useMemo(() => userProfile[field] || "/placeholder.png", [userProfile, field]);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const [uploadedUrl] = await uploadToCloudinary([file]);
      await updateProfile({ [field]: uploadedUrl });
      await mutate();

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      showToast(`${label} updated successfully!`);
    } catch (error) {
      console.error("Failed to upload image:", error);
      showToast("Error uploading image.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = async () => {
    if (!userProfile[field]) return;

    setIsUploading(true);
    try {
      await updateProfile({ [field]: "" });
      await mutate();
      showToast(`${label} removed successfully!`);
    } catch (error) {
      console.error("Failed to remove image:", error);
      showToast("Error removing image.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center">
      <img src={imageSrc} alt={label} className="w-32 h-32 md:w-52 md:h-52 object-cover rounded-full border border-border shadow-md" />
      {isUploading && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted bg-opacity-75 rounded-full">
          <Loader className="h-10 w-10 text-primary animate-spin" />
        </div>
      )}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="absolute bottom-4 right-4 flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground hover:bg-primary-hover shadow-lg" disabled={isUploading}>
            <Camera className="h-6 w-6" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-36 bg-card text-card-foreground rounded-lg shadow-lg">
          {/* Upload Option */}
          <DropdownMenuItem onClick={() => fileInputRef.current?.click()} className="hover:bg-accent hover:text-accent-foreground rounded-md p-2">
            Upload
          </DropdownMenuItem>
          {/* Capture Option */}
          <DropdownMenuItem
            onClick={() => {
              if (fileInputRef.current) {
                fileInputRef.current.setAttribute("capture", "environment"); // Rear camera
                fileInputRef.current.click();
              }
            }}
            className="hover:bg-accent hover:text-accent-foreground rounded-md p-2"
          >
            Take Picture
          </DropdownMenuItem>
          {/* Remove Image Option */}
          <DropdownMenuItem onClick={handleRemoveImage} className="hover:bg-destructive hover:text-destructive-foreground rounded-md p-2">
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" disabled={isUploading} />
    </div>
  );
}
