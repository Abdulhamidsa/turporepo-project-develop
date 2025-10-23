import React from 'react';

import { AlertCircle } from 'lucide-react';
import { useLocation } from 'react-router-dom';

import { useUserProfile } from '../features/user/hooks/use.user.profile';
import NavigationItem from './NavigationItem';

interface SidebarProps {
  isOpen: boolean;
  navigationItems: NavigationItemProps[];
  sidebarOnlyItems: NavigationItemProps[];
  onClose: () => void;
  isDesktopMode?: boolean; // Optional prop to determine desktop behavior
}

export interface NavigationItemProps {
  name: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  link?: string;
  action?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  navigationItems,
  sidebarOnlyItems,
  onClose,
  isDesktopMode = false,
}) => {
  const location = useLocation();
  const { userProfile } = useUserProfile();

  const renderNavItem = (item: NavigationItemProps, showText = true) => {
    const isActive = item.link ? location.pathname === item.link : false;

    return (
      <div key={item.name} className="relative flex items-center">
        <NavigationItem
          item={item}
          isActive={isActive}
          showText={showText}
          {...(!isDesktopMode && { onClick: onClose })}
        />
        {item.name === 'Profile' && !userProfile.completedProfile && (
          <AlertCircle className="absolute right-3 h-4 w-4 text-destructive" />
        )}
      </div>
    );
  };

  if (isDesktopMode) {
    // Desktop: Static sidebar that pushes content
    return (
      <aside
        className={`bg-card border-border border-r transition-all duration-300 ${
          isOpen ? 'w-64' : 'w-0'
        } overflow-hidden`}
      >
        <div className="flex h-full flex-col w-64">
          <div className="flex-1 overflow-y-auto pt-4">
            <nav className="space-y-2 px-4">
              {navigationItems.map((item) => renderNavItem(item))}
            </nav>
          </div>
          <div className="mb-4 space-y-2 px-4">
            {sidebarOnlyItems.map((item) => renderNavItem(item))}
          </div>
        </div>
      </aside>
    );
  }

  // Mobile: Original overlay behavior
  return (
    <aside
      className={`bg-card border-border fixed left-0 top-0 z-50 h-full border-r transition-transform duration-300 ${
        isOpen ? 'w-64 translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="flex h-full flex-col">
        <div
          className={`flex-1 overflow-y-auto transition-opacity duration-300 ${
            isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
          }`}
        >
          <nav className="mt-4 space-y-2 px-4">
            {navigationItems.map((item) => renderNavItem(item))}
          </nav>
        </div>
        <div
          className={`mb-4 space-y-2 px-4 transition-opacity duration-300 ${
            isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
          }`}
        >
          {sidebarOnlyItems.map((item) => renderNavItem(item))}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
