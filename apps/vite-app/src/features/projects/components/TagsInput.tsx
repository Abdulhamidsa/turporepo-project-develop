import React from "react";
import { Input } from "@repo/ui/components/ui/input";
import { Badge } from "@repo/ui/components/ui/badge";
import { X } from "lucide-react";

interface TagInputProps {
  tags: string[];
  setTags: (tags: string[]) => void;
  error?: string;
}

const TagInput: React.FC<TagInputProps> = ({ tags, setTags, error }) => {
  const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const tag = e.currentTarget.value.trim();
    if (e.key === "Enter" && tag) {
      e.preventDefault();
      if (!tags.includes(tag)) {
        setTags([...tags, tag]);
      }
      e.currentTarget.value = "";
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div>
      <label htmlFor="tags" className="text-foreground">
        Tags (Press Enter to add)
      </label>
      <Input id="tags" onKeyDown={handleTagInput} className={`bg-input text-foreground border-border ${error ? "border-red-500" : "border-gray-300"}`} placeholder="Enter a tag and press Enter" />
      {error && <p className="text-sm text-destructive mt-1">{error}</p>}
      <div className="flex flex-wrap gap-2 mt-2">
        {tags.map((tag) => (
          <Badge key={tag} variant="secondary" className="bg-secondary text-secondary-foreground flex items-center gap-1">
            {tag}
            <button onClick={() => removeTag(tag)} className="text-secondary-foreground hover:text-destructive">
              <X size={14} />
            </button>
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default TagInput;
