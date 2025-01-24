import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@repo/ui/components/ui/button";
import { NavigationItemProps } from "./Sidebar";

interface NavigationItemComponentProps {
  item: NavigationItemProps;
  isActive: boolean;
  showText: boolean;
  onClick?: () => void;
}

const NavigationItem: React.FC<NavigationItemComponentProps> = ({ item, isActive, showText, onClick }) => {
  const baseClasses = "flex items-center px-5 py-3 text-sm font-medium rounded-lg transition-colors";
  const activeClasses = isActive ? " text-accent bg-muted/50" : "text-muted-foreground hover:bg-muted/50";

  const handleClick = () => {
    if (item.action) {
      item.action();
    }
    if (onClick) {
      onClick();
    }
  };

  if (item.link) {
    return (
      <Link to={item.link} className={`${baseClasses} ${activeClasses}`} onClick={handleClick}>
        <item.icon className={`h-7 w-7 ${isActive ? "text-accent" : "text-muted-foreground"}`} />
        {showText && <span className="ml-4 text-primary-foreground ">{item.name}</span>}
      </Link>
    );
  }

  return (
    <Button onClick={handleClick} variant="ghost" className={`${baseClasses} hover:bg-muted/50`}>
      <item.icon className="h-6 w-6" />
      {showText && <span className="ml-4">{item.name}</span>}
    </Button>
  );
};

export default NavigationItem;
