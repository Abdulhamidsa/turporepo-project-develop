import React from 'react';

const Loading: React.FC = () => {
  return (
    <div className="bg-background text-foreground flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        {/* Spinner */}
        <div className="relative h-16 w-16 animate-spin">
          <div
            className="border-t-primary border-r-secondary border-b-accent border-l-muted absolute inset-0 h-full w-full rounded-full border-[3px]"
            style={{
              borderRadius: 'var(--radius)',
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
