import React, { useEffect, useState } from 'react';

import { BriefcaseBusiness, Home, KanbanSquare, Settings, UserCircle, Users } from 'lucide-react';
import { Outlet } from 'react-router-dom';

import { routesConfig } from '../../routes/routesConfig';
import BottomNavigation from '../components/BottomNavigation';
import Overlay from '../components/OverlayComponent';
import Sidebar from '../components/Sidebar';
import SidebarToggle from '../components/SidebarToggle';
import { useUserProfile } from '../features/user/hooks/use.user.profile';
import { NavbarApp } from './NavbarApp';

const DashboardLayout: React.FC = () => {
  // For mobile, use original behavior. For desktop, sidebar is always open by default
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const { userProfile } = useUserProfile();

  const navigationItems = [
    { name: 'Home', icon: Home, link: routesConfig.home },
    {
      name: 'My Portfolio',
      icon: BriefcaseBusiness,
      link: userProfile?.friendlyId
        ? routesConfig.userPortfolio(userProfile.friendlyId)
        : routesConfig.home,
    },
    {
      name: 'Projects',
      icon: KanbanSquare,
      link: routesConfig.projects,
    },
    {
      name: 'Users',
      icon: Users,
      link: routesConfig.professionals,
    },
    {
      name: 'Profile',
      icon: UserCircle,
      link: routesConfig.profile,
      attention: userProfile && !userProfile.completedProfile,
    },
  ];

  const sidebarOnlyItems = [{ name: 'Settings', icon: Settings, link: routesConfig.settings }];

  useEffect(() => {
    const handleResize = () => {
      const desktop = window.innerWidth >= 768;
      setIsDesktop(desktop);

      if (desktop) {
        setIsSidebarOpen(true); // Always open on desktop
      } else {
        setIsSidebarOpen(false); // Keep mobile behavior
      }
    };

    // Set initial state
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className="bg-background text-foreground relative h-screen overflow-hidden">
      <NavbarApp />

      {/* Show toggle on both mobile and desktop, but different behavior */}
      <SidebarToggle isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <div className={`${isDesktop ? 'flex' : 'block'} h-full`}>
        {/* Sidebar - different rendering for desktop vs mobile */}
        <Sidebar
          isOpen={isSidebarOpen}
          isDesktopMode={isDesktop}
          navigationItems={navigationItems}
          sidebarOnlyItems={sidebarOnlyItems}
          onClose={() => !isDesktop && setIsSidebarOpen(false)}
        />

        {/* Mobile overlay - only on mobile */}
        {!isDesktop && (
          <Overlay isOpen={isSidebarOpen} closeSidebar={() => setIsSidebarOpen(false)} />
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="m-auto max-w-screen-lg p-4">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Bottom Navigation - only on mobile */}
      <footer className="md:hidden mb-16">
        <BottomNavigation navigationItems={navigationItems} sidebarOnlyItems={sidebarOnlyItems} />
      </footer>
    </div>
  );
};

export default DashboardLayout;
