import React from 'react';

import { Button } from '@repo/ui/components/ui/button';
import { Link } from 'react-router-dom';

import { NavigationItemProps } from './Sidebar';

interface NavigationItemComponentProps {
  item: NavigationItemProps;
  isActive: boolean;
  showText: boolean;
  onClick?: () => void;
}

const NavigationItem: React.FC<NavigationItemComponentProps> = ({
  item,
  isActive,
  showText,
  onClick,
}) => {
  const baseClasses =
    'flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors';
  const activeClasses = isActive
    ? 'bg-primary/10 text-primary'
    : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground';

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
        <item.icon className={`h-5 w-5 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
        {showText && <span className="ml-4">{item.name}</span>}
      </Link>
    );
  }

  return (
    <Button
      onClick={handleClick}
      variant="ghost"
      className={`${baseClasses} ${activeClasses} justify-start`}
    >
      <item.icon className="h-5 w-5" />
      {showText && <span className="ml-4">{item.name}</span>}
    </Button>
  );
};

export default NavigationItem;
