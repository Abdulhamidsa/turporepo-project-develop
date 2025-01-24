import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui/components/ui/avatar";
import { ImagePlus } from "lucide-react";
import { useUserProfile } from "../hooks/use.user.profile";
import { uploadToCloudinary } from "../../../../utils/CloudinaryConfige";
import { usePostSubmit } from "../../../hooks/useCreatePost";
import { showToast } from "@repo/ui/components/ui/toaster";
import { useFetchPosts } from "../hooks/useFetchAllPosts";
import SaveButton from "../../projects/components/SaveButton";

export function PostForm({ onClose }: { onClose: () => void }) {
  const { userProfile } = useUserProfile();
  const [content, setContent] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { trigger, isMutating, error } = usePostSubmit();
  const { mutate: MutateFetchPosts } = useFetchPosts();

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
      showToast("At least a text or an image is required.", "error");
      return;
    }

    try {
      let imageUrl: string = "";
      if (image) {
        const urls = await uploadToCloudinary([image]);
        imageUrl = urls[0];
      }

      const payload = {
        content,
        image: imageUrl,
      };

      await trigger(payload);

      setContent("");
      setImage(null);
      setImagePreview(null);
      showToast("Post uploaded successfully!", "success");

      await MutateFetchPosts();
      onClose();
    } catch (err) {
      console.error("Error uploading post:", err);
      showToast("Failed to upload post.", "error");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-card text-card-foreground rounded-[var(--radius)]">
      <h3 className="text-lg font-semibold text-foreground">Create Post</h3>
      <div className="p-4">
        <div className="flex items-center space-x-2 mb-4">
          <Avatar className="w-8 h-8">
            <AvatarImage src={userProfile.profilePicture ?? "/placeholder.png"} alt="Your Name" />
            <AvatarFallback>{userProfile.username?.charAt(0).toUpperCase() ?? "U"}</AvatarFallback>
          </Avatar>
          <span className="font-semibold text-sm text-foreground">{userProfile.username}</span>
        </div>
        <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="What's on your mind?" className="w-full h-20 border border-border bg-muted text-muted-foreground rounded-[var(--radius)] p-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
        <div className="relative mt-4">
          <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" id="image-upload" />
          <label htmlFor="image-upload" className="flex items-center justify-center w-full h-24 border-2 border-dashed border-border rounded-[var(--radius)] cursor-pointer bg-muted hover:border-muted-foreground transition-colors duration-300">
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="rounded-[var(--radius)] max-h-full object-contain" />
            ) : (
              <div className="flex flex-col items-center">
                <ImagePlus className="h-6 w-6 text-muted-foreground" />
                <span className="mt-1 text-xs text-muted-foreground">Add an image</span>
              </div>
            )}
          </label>
        </div>
      </div>
      <div className="flex justify-end p-4">
        <SaveButton onClick={handleSubmit} loading={isMutating} label="Post" />
      </div>

      {error && <p className="text-center text-sm text-destructive mt-2">{error.message}</p>}
    </div>
  );
}
