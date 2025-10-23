import React from 'react';

import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SidebarToggleProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const SidebarToggle: React.FC<SidebarToggleProps> = ({ isOpen, toggleSidebar }) => {
  return (
    <>
      {/* Mobile toggle - hamburger menu */}
      {/* <button
        onClick={toggleSidebar}
        className="md:hidden fixed top-4 left-4 z-50 bg-card text-foreground rounded-lg p-2.5 shadow-md hover:shadow-lg transition-all duration-300 hover:bg-accent border border-border"
      >
        <Menu className="h-5 w-5" />
      </button> */}

      {/* Desktop toggle - chevron button */}
      <button
        onClick={toggleSidebar}
        className={`hidden md:block fixed top-20 z-40 bg-card text-foreground rounded-r-lg p-2 shadow-md hover:shadow-lg transition-all duration-300 hover:bg-accent border border-border ${
          isOpen ? 'left-64' : 'left-0'
        }`}
      >
        {isOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </button>
    </>
  );
};

export default SidebarToggle;
