import { FC } from 'react';

const LoadingIndicator: FC = () => {
  return (
    <div className="mt-2 flex justify-center">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
    </div>
  );
};

export default LoadingIndicator;
