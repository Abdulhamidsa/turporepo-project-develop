import { Button } from '@repo/ui/components/ui/button';

interface SaveButtonProps {
  onClick: () => void;
  loading: boolean;
  progress: number;
  label?: string;
}

const SaveButton: React.FC<SaveButtonProps> = ({ onClick, loading, label = 'Save', progress }) => {
  return (
    <div className="w-full">
      <Button
        onClick={onClick}
        disabled={loading}
        className="bg-primary text-primary-foreground hover:bg-primary-hover relative flex items-center justify-center rounded-[var(--radius)] px-4 py-2 transition-all duration-300 disabled:opacity-50"
      >
        {loading ? 'Saving...' : label}
      </Button>

      {/* 🔥 Progress Bar Below */}
      {loading && (
        <div className="bg-muted mt-2 h-1 w-full overflow-hidden rounded-full">
          <div
            className="bg-primary h-1 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}
    </div>
  );
};

export default SaveButton;
