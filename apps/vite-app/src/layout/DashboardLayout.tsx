import React, { useEffect, useState } from 'react';

import { BriefcaseBusiness, Home, KanbanSquare, LogIn, UserCircle, Users } from 'lucide-react';
import { Outlet } from 'react-router-dom';

import { routesConfig } from '../../routes/routesConfig';
import BottomNavigation from '../components/BottomNavigation';
import Overlay from '../components/OverlayComponent';
import Sidebar from '../components/Sidebar';
import SidebarToggle from '../components/SidebarToggle';
import { useAuth } from '../features/user/hooks/use.auth';
import { useUserProfile } from '../features/user/hooks/use.user.profile';
import { NavbarApp } from './NavbarApp';

const DashboardLayout: React.FC = () => {
  // For mobile, use original behavior. For desktop, sidebar is always open by default
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const { userProfile } = useUserProfile();
  const { isAuthenticated, loggedUser } = useAuth();

  // Navigation items for authenticated users
  const authenticatedNavigationItems = [
    { name: 'Home', icon: Home, link: '/feed' },
    {
      name: 'My Portfolio',
      icon: BriefcaseBusiness,
      link: loggedUser ? routesConfig.userPortfolio(loggedUser.friendlyId) : '#',
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

  // Navigation items for public visitors
  const publicNavigationItems = [
    { name: 'Feed', icon: Home, link: '/feed' },
    { name: 'Login', icon: LogIn, link: '/' },
  ];

  const navigationItems = isAuthenticated ? authenticatedNavigationItems : publicNavigationItems;

  // const sidebarOnlyItems = [{ name: 'Settings', icon: Settings, link: routesConfig.settings }];

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
    <div className="bg-background text-foreground relative min-h-screen">
      <NavbarApp />

      {/* Show toggle and sidebar only for authenticated users */}
      {isAuthenticated && (
        <>
          <SidebarToggle isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

          <div className={`${isDesktop ? 'flex' : 'block'}`}>
            {/* Sidebar - different rendering for desktop vs mobile */}
            <Sidebar
              isOpen={isSidebarOpen}
              isDesktopMode={isDesktop}
              navigationItems={navigationItems}
              onClose={() => !isDesktop && setIsSidebarOpen(false)}
            />

            {/* Mobile overlay - only on mobile */}
            {!isDesktop && (
              <Overlay isOpen={isSidebarOpen} closeSidebar={() => setIsSidebarOpen(false)} />
            )}

            {/* Main Content */}
            <main className="flex-1">
              <div className="m-auto max-w-screen-lg p-4">
                <Outlet />
              </div>
            </main>
          </div>

          {/* Bottom Navigation - only on mobile for authenticated users */}
          <footer className="md:hidden mb-16">
            <BottomNavigation navigationItems={navigationItems} />
          </footer>
        </>
      )}

      {/* Public user layout - no sidebar */}
      {!isAuthenticated && (
        <main className="flex-1">
          <div className="m-auto max-w-screen-lg p-4">
            <Outlet />
          </div>
        </main>
      )}
    </div>
  );
};

export default DashboardLayout;
