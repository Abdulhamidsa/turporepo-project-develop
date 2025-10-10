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
      className={`fixed bottom-4 ${isOpen ? 'left-64' : 'left-4'} bg-card text-foreground z-50 hidden rounded-lg p-2.5 shadow-md hover:shadow-lg transition-all duration-300 md:block hover:bg-accent`}
    >
      {isOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
    </button>
  );
};

export default SidebarToggle;
