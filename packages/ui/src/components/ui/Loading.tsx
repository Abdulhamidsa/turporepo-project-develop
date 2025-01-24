import React from "react";

const Loading: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background text-foreground">
      <div className="flex flex-col items-center gap-4">
        {/* Spinner */}
        <div className="relative w-16 h-16 animate-spin">
          <div
            className="absolute inset-0 w-full h-full rounded-full border-[3px] border-t-primary border-r-secondary border-b-accent border-l-muted"
            style={{
              borderRadius: "var(--radius)",
            }}
          ></div>
        </div>
        {/* Loading Text */}
        <p className="text-lg font-medium">Loading, please wait...</p>
      </div>
    </div>
  );
};

export default Loading;
