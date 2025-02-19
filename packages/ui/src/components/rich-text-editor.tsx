import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';

import ToolbarPlugin from './toolbar-plugin';

interface RichTextEditorProps {
  initialContent?: string;
  readOnly?: boolean;
  onChange?: (editorState: string) => void;
}

export function RichTextEditor({
  initialContent = '',
  readOnly = false,
  onChange,
}: RichTextEditorProps) {
  const initialConfig = {
    namespace: 'MyEditor',
    onError: (error: Error) => console.error(error),
    editable: !readOnly,
    editorState: initialContent,
    theme: {
      ltr: 'ltr',
      rtl: 'rtl',
      placeholder: 'placeholder',
      paragraph: 'mb-1',
    },
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="rounded-md border">
        {!readOnly && <ToolbarPlugin />}
        <RichTextPlugin
          contentEditable={<ContentEditable className="min-h-[100px] px-2.5 py-2 outline-none" />}
          placeholder={
            <div className="pointer-events-none absolute left-0 top-0 px-2.5 py-2 text-gray-400">
              Enter some text...
            </div>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
        <HistoryPlugin />
        {!readOnly && <AutoFocusPlugin />}
      </div>
    </LexicalComposer>
  );
}
