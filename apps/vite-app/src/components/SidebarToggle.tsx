import React from 'react';

import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SidebarToggleProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const SidebarToggle: React.FC<SidebarToggleProps> = ({ isOpen, toggleSidebar }) => {
  return (
    <button
      onClick={toggleSidebar}
      className={`fixed bottom-4 ${isOpen ? 'left-64' : 'left-4'} bg-primary text-primary-foreground z-50 hidden rounded-full p-2 shadow-lg transition-all duration-300 md:block`}
    >
      {isOpen ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
    </button>
  );
};

export default SidebarToggle;
