import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui/components/ui/avatar";
import { Button } from "@repo/ui/components/ui/button";
import { Input } from "@repo/ui/components/ui/input";
import { Edit, FolderPlus } from "lucide-react";
import CustomModal from "../../../../../../packages/ui/src/components/CustomModal";
import { PostForm } from "./PostForm";
import AddProjectModal from "../../projects/components/addProjectModal";
import { useAuth } from "../hooks/use.auth";

export function AddContentButton() {
  const [isPostDialogOpen, setIsPostDialogOpen] = useState(false);
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);
  const { loggedUser } = useAuth();

  return (
    <div className="bg-card p-4 rounded-md shadow-md space-y-4">
      {/* Input section like Facebook */}
      <div className="flex items-center space-x-4">
        <Avatar className="h-12 w-12">
          <AvatarImage src={loggedUser?.profilePicture || "/placeholder-avatar.png"} />
          <AvatarFallback>{loggedUser?.username.charAt(0).toUpperCase() || "U"}</AvatarFallback>
        </Avatar>
        <Input placeholder="What's on your mind?" className="flex-1 rounded-full bg-background border border-muted focus:ring-0 cursor-pointer" onClick={() => setIsPostDialogOpen(true)} readOnly />
      </div>
      <div className="flex justify-around">
        <Button variant="ghost" className="flex items-center space-x-2 hover:bg-white hover:text-black" onClick={() => setIsPostDialogOpen(true)}>
          <Edit className="w-5 h-5 text-primary hover:text-black" />
          <span>Add Post</span>
        </Button>
        <Button variant="ghost" className="flex items-center space-x-2 hover:bg-white hover:text-black" onClick={() => setIsProjectDialogOpen(true)}>
          <FolderPlus className="w-5 h-5 text-primary hover:text-black" />
          <span>Add Project</span>
        </Button>
      </div>
      <CustomModal isOpen={isPostDialogOpen} onClose={() => setIsPostDialogOpen(false)} size="lg">
        <PostForm onClose={() => setIsPostDialogOpen(false)} />
      </CustomModal>
      <AddProjectModal isOpen={isProjectDialogOpen} onClose={() => setIsProjectDialogOpen(false)} />
    </div>
  );
}
