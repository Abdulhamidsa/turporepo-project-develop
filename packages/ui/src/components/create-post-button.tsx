"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@repo/ui/components/ui/button";
import { UploadPost } from "./upload-post";

export function CreatePostButton() {
  const [showUpload, setShowUpload] = useState(false);

  const handleSubmit = (content: string, image: File | null) => {
    // TODO: Implement post creation logic
    console.log("Creating new post:", { content, image });
  };

  return (
    <>
      <Button className="fixed bottom-8 right-8 rounded-full w-16 h-16 shadow-lg hover:shadow-xl transition-shadow duration-300" onClick={() => setShowUpload(true)}>
        <Plus className="h-6 w-6" />
      </Button>
      {showUpload && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <UploadPost onClose={() => setShowUpload(false)} onSubmit={handleSubmit} />
        </div>
      )}
    </>
  );
}
