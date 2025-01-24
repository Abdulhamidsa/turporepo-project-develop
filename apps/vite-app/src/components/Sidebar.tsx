import React from "react";
import { useLocation } from "react-router-dom";
import NavigationItem from "./NavigationItem";

interface SidebarProps {
  isOpen: boolean;
  navigationItems: NavigationItemProps[];
  sidebarOnlyItems: NavigationItemProps[];
  onClose: () => void; // Add onClose prop
}

export interface NavigationItemProps {
  name: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  link?: string;
  action?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, navigationItems, sidebarOnlyItems, onClose }) => {
  const location = useLocation();

  const renderNavItem = (item: NavigationItemProps, showText = true) => {
    const isActive = item.link ? location.pathname === item.link : false;

    return <NavigationItem key={item.name} item={item} isActive={isActive} showText={showText} onClick={onClose} />;
  };

  return (
    <aside className={`fixed h-dvh top-0 left-0 z-50 bg-card border-r border-border transition-transform duration-300 ${isOpen ? "translate-x-0 w-64" : "-translate-x-full"}`}>
      <div className="flex flex-col h-full">
        {/* Navigation Items */}
        <div className={`flex-1 overflow-y-auto transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
          <nav className="px-4 mt-4 space-y-2">{navigationItems.map((item) => renderNavItem(item))}</nav>
        </div>

        {/* Sidebar Only Items */}
        <div className={`space-y-2 px-4 mb-4 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}>{sidebarOnlyItems.map((item) => renderNavItem(item))}</div>
      </div>
    </aside>
  );
};

export default Sidebar;
