import { Button } from "@repo/ui/components/ui/button";
import { Loader } from "lucide-react";

interface SaveButtonProps {
  onClick: () => void;
  loading: boolean;
  label?: string;
}

const SaveButton: React.FC<SaveButtonProps> = ({ onClick, loading, label = "Save" }) => {
  return (
    <Button onClick={onClick} className={`w-full bg-primary text-primary-foreground hover:bg-white hover:text-black ${loading ? "opacity-70 cursor-not-allowed" : ""}`} disabled={loading}>
      {loading ? (
        <span className="flex items-center gap-2">
          <Loader size={16} className="animate-spin" /> {label}...
        </span>
      ) : (
        `${label}`
      )}
    </Button>
  );
};

export default SaveButton;
