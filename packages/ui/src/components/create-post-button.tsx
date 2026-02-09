'use client';

import { useState } from 'react';

import { Button } from '@repo/ui/components/ui/button';
import { Plus } from 'lucide-react';

import { UploadPost } from './upload-post';

export function CreatePostButton() {
  const [showUpload, setShowUpload] = useState(false);

  const handleSubmit = (content: string, image: File | null) => {
    // TODO: Implement post creation logic
    // console.log('Creating new post:', { content, image });
  };

  return (
    <>
      <Button
        className="fixed bottom-8 right-8 h-16 w-16 rounded-full shadow-lg transition-shadow duration-300 hover:shadow-xl"
        onClick={() => setShowUpload(true)}
      >
        <Plus className="h-6 w-6" />
      </Button>
      {showUpload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <UploadPost onClose={() => setShowUpload(false)} onSubmit={handleSubmit} />
        </div>
      )}
    </>
  );
}
