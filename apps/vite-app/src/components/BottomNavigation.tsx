import React from 'react';

import { Popover, PopoverContent } from '@repo/ui/components/ui/popover';
import { useLocation } from 'react-router-dom';

import NavigationItem from './NavigationItem';
import { NavigationItemProps } from './Sidebar';

interface BottomNavigationProps {
  navigationItems: NavigationItemProps[];
  sidebarOnlyItems: NavigationItemProps[];
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({
  navigationItems,
  sidebarOnlyItems,
}) => {
  const location = useLocation();

  // Check if an item is active
  const isActive = (link?: string) => location.pathname === link;

  return (
    <nav className="bg-card border-border fixed bottom-0 flex w-full items-center justify-between border-t md:hidden">
      <div className="flex flex-grow justify-center gap-10">
        {navigationItems.map((item) => (
          <NavigationItem
            key={item.name}
            item={item}
            isActive={isActive(item.link)} // Determine if the item is active
            showText={false}
          />
        ))}
      </div>
      <Popover>
        <PopoverContent className="bg-card border-border w-48 rounded-lg border p-2 shadow-md">
          {sidebarOnlyItems.map((item) => (
            <NavigationItem
              key={item.name}
              item={item}
              isActive={isActive(item.link)} // Determine if the item is active
              showText={true}
            />
          ))}
        </PopoverContent>
      </Popover>
    </nav>
  );
};

export default BottomNavigation;
