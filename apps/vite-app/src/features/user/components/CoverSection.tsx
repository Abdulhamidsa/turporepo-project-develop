// CoverSection.tsx
import { useEffect, useState } from 'react';

import CoverImageEdit from './CoverImage';
import FullScreenCoverDialog from './FullScreenCoverDialog';

interface CoverSectionProps {
  coverImage?: string | null;
}

const CoverSection = ({ coverImage }: CoverSectionProps) => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  // If the cover image is removed, make sure we exit fullscreen mode.
  useEffect(() => {
    if (!coverImage) {
      setIsFullScreen(false);
    }
  }, [coverImage]);

  return (
    <>
      <div className="relative h-64 overflow-hidden object-cover sm:h-80 md:h-96">
        {coverImage ? (
          <div className="h-full w-full cursor-pointer" onClick={() => setIsFullScreen(true)}>
            <CoverImageEdit label="Cover Image" field="coverImage" />
          </div>
        ) : (
          <CoverImageEdit label="Cover Image" field="coverImage" />
        )}
      </div>

      <FullScreenCoverDialog
        coverImage={coverImage ?? '/placeholder.jpg'}
        isFullScreen={isFullScreen}
        setIsFullScreen={setIsFullScreen}
      />
    </>
  );
};

export default CoverSection;
