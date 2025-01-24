import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import ToolbarPlugin from "./toolbar-plugin";

interface RichTextEditorProps {
  initialContent?: string;
  readOnly?: boolean;
  onChange?: (editorState: string) => void;
}

export function RichTextEditor({ initialContent = "", readOnly = false, onChange }: RichTextEditorProps) {
  const initialConfig = {
    namespace: "MyEditor",
    onError: (error: Error) => console.error(error),
    editable: !readOnly,
    editorState: initialContent,
    theme: {
      ltr: "ltr",
      rtl: "rtl",
      placeholder: "placeholder",
      paragraph: "mb-1",
    },
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="border rounded-md">
        {!readOnly && <ToolbarPlugin />}
        <RichTextPlugin contentEditable={<ContentEditable className="min-h-[100px] outline-none px-2.5 py-2" />} placeholder={<div className="text-gray-400 px-2.5 py-2 absolute top-0 left-0 pointer-events-none">Enter some text...</div>} ErrorBoundary={LexicalErrorBoundary} />
        <HistoryPlugin />
        {!readOnly && <AutoFocusPlugin />}
      </div>
    </LexicalComposer>
  );
}
