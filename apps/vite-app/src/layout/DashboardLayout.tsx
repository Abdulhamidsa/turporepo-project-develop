import React, { useEffect, useState } from 'react';

import { Briefcase, Home, Settings, User } from 'lucide-react';
import { Outlet } from 'react-router-dom';

import { routesConfig } from '../../routes/routesConfig';
import BottomNavigation from '../components/BottomNavigation';
import Overlay from '../components/OverlayComponent';
import Sidebar from '../components/Sidebar';
import SidebarToggle from '../components/SidebarToggle';
import { useUserProfile } from '../features/user/hooks/use.user.profile';
import { NavbarApp } from './NavbarApp';

const DashboardLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { userProfile } = useUserProfile();

  const navigationItems = [
    { name: 'Home', icon: Home, link: routesConfig.home },
    {
      name: 'My Portfolio',
      icon: Briefcase,
      link: userProfile?.username
        ? routesConfig.userPortfolio(userProfile.username)
        : routesConfig.home,
    },
    {
      name: 'Projects',
      icon: Briefcase,
      link: routesConfig.projects,
    },
    {
      name: 'Profile',
      icon: User,
      link: routesConfig.profile,
      attention: userProfile && !userProfile.completedProfile,
    },
  ];

  const sidebarOnlyItems = [{ name: 'Settings', icon: Settings, link: routesConfig.settings }];

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className="bg-background text-foreground relative h-screen overflow-y-scroll">
      <NavbarApp />
      <SidebarToggle isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <Sidebar
        isOpen={isSidebarOpen}
        navigationItems={navigationItems}
        sidebarOnlyItems={sidebarOnlyItems}
        onClose={toggleSidebar}
      />
      <Overlay isOpen={isSidebarOpen} closeSidebar={() => setIsSidebarOpen(false)} />
      <main className="m-auto max-w-screen-lg flex-1 overflow-auto md:p-4">
        <Outlet />
      </main>
      <footer className="mb-16">
        <BottomNavigation navigationItems={navigationItems} sidebarOnlyItems={sidebarOnlyItems} />
      </footer>
    </div>
  );
};

export default DashboardLayout;
