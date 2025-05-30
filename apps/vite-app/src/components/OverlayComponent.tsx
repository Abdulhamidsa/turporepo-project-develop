import React from 'react';

interface OverlayProps {
  isOpen: boolean;
  closeSidebar: () => void;
}

const Overlay: React.FC<OverlayProps> = ({ isOpen, closeSidebar }) => {
  if (!isOpen) return null;

  return <div onClick={closeSidebar} className="absolute inset-0 z-20 bg-black/50 md:hidden"></div>;
};

export default Overlay;
