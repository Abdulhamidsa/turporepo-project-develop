import React from "react";
import { useLocation } from "react-router-dom";
import { Popover, PopoverContent, PopoverTrigger } from "@repo/ui/components/ui/popover";
import { Button } from "@repo/ui/components/ui/button";
import { MoreVertical } from "lucide-react";
import { NavigationItemProps } from "./Sidebar";
import NavigationItem from "./NavigationItem";

interface BottomNavigationProps {
  navigationItems: NavigationItemProps[];
  sidebarOnlyItems: NavigationItemProps[];
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ navigationItems, sidebarOnlyItems }) => {
  const location = useLocation();

  // Check if an item is active
  const isActive = (link?: string) => location.pathname === link;

  return (
    <nav className="fixed bottom-0 w-full bg-card border-t border-border flex justify-between items-center md:hidden">
      <div className="flex justify-center gap-10 flex-grow">
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
        <PopoverTrigger asChild>
          <Button variant="ghost" className="ml-auto flex flex-col items-center">
            <MoreVertical className="h-6 w-6" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-48 p-2 bg-card border border-border rounded-lg shadow-md">
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
