import React, { FormEvent, useState } from 'react';

import { CommentType } from '@repo/data/types/types';
import { Send } from 'lucide-react';
import { Loader2 } from 'lucide-react';

import { useAddComment } from '../../../hooks/useComments';

type CommentBoxProps = {
  postId: string;
  onCommentAdded?: (newComments: CommentType[]) => void;
};

export const CommentBox: React.FC<CommentBoxProps> = ({ postId, onCommentAdded }) => {
  const [text, setText] = useState('');
  const { submitComment, isLoading, error } = useAddComment(postId);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!text.trim()) return;

    const updatedComments = (await submitComment(text)) as CommentType[];
    if (updatedComments && onCommentAdded) {
      onCommentAdded(updatedComments);
    }

    setText('');
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full p-2">
      <input
        type="text"
        placeholder="Add a comment..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={isLoading}
        className="bg-background text-foreground focus:ring-primary w-full rounded-md border py-2 pl-4 pr-10 transition focus:outline-none focus:ring-2"
      />
      <button
        type="submit"
        disabled={isLoading || !text.trim()}
        className="text-primary hover:text-accent disabled:text-muted-foreground absolute right-6 top-1/2 -translate-y-1/2 transform"
      >
        {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
      </button>
      {error && <p className="text-destructive mt-2 text-sm">{error}</p>}
    </form>
  );
};
