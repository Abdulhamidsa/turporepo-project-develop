import React, { useState, FormEvent } from "react";
import { CommentType } from "@repo/data/types/types";
import { useAddComment } from "../../../hooks/useComments";
import { Send } from "lucide-react";
import { Loader2 } from "lucide-react";

type CommentBoxProps = {
  postId: string;
  onCommentAdded?: (newComments: CommentType[]) => void;
};

export const CommentBox: React.FC<CommentBoxProps> = ({ postId, onCommentAdded }) => {
  const [text, setText] = useState("");
  const { submitComment, isLoading, error } = useAddComment(postId);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!text.trim()) return;

    const updatedComments = (await submitComment(text)) as CommentType[];
    if (updatedComments && onCommentAdded) {
      onCommentAdded(updatedComments);
    }

    setText("");
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full p-2">
      <input type="text" placeholder="Add a comment..." value={text} onChange={(e) => setText(e.target.value)} disabled={isLoading} className="w-full border rounded-md py-2 pl-4 pr-10 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition" />
      <button type="submit" disabled={isLoading || !text.trim()} className="absolute right-6 top-1/2 transform -translate-y-1/2 text-primary hover:text-accent disabled:text-muted-foreground">
        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
      </button>
      {error && <p className="text-sm text-destructive mt-2">{error}</p>}
    </form>
  );
};
