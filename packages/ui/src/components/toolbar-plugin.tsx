'use client';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { Button } from '@repo/ui/components/ui/button';
import { FORMAT_TEXT_COMMAND } from 'lexical';
import { Bold, Italic, Underline } from 'lucide-react';

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();

  const formatText = (format: 'bold' | 'italic' | 'underline') => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
  };

  return (
    <div className="flex space-x-1 border-b p-1">
      <Button variant="ghost" size="sm" onClick={() => formatText('bold')}>
        <Bold className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm" onClick={() => formatText('italic')}>
        <Italic className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm" onClick={() => formatText('underline')}>
        <Underline className="h-4 w-4" />
      </Button>
    </div>
  );
}
