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
    <div className="w-full">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative overflow-hidden rounded-2xl bg-muted/40 border border-border/30 transition-all duration-300 focus-within:border-primary/50 focus-within:bg-muted/60 focus-within:shadow-lg focus-within:shadow-primary/10">
          <input
            type="text"
            placeholder="Share your thoughts..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={isLoading}
            className="w-full bg-transparent text-foreground placeholder-muted-foreground py-3.5 pl-5 pr-14 text-sm font-medium transition-all duration-200 focus:outline-none disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading || !text.trim()}
            className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl transition-all duration-200 ${
              text.trim() && !isLoading
                ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-md'
                : 'text-muted-foreground cursor-not-allowed'
            }`}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className={`h-4 w-4 ${text.trim() ? 'animate-pulse' : ''}`} />
            )}
          </button>
        </div>
      </form>
      {error && (
        <div className="mt-2 p-2 rounded-lg bg-destructive/10 border border-destructive/20">
          <p className="text-destructive text-xs font-medium">{error}</p>
        </div>
      )}
    </div>
  );
};
