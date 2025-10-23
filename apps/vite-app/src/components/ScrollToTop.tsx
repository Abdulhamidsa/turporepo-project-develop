import { useEffect } from 'react';

import { useLocation } from 'react-router-dom';

/**
 * Component that scrolls to top on route change
 * This ensures every page starts at the top position
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll the main window to top
    window.scrollTo(0, 0);

    // Also scroll any scrollable containers to top (like our main content area)
    const scrollableElements = document.querySelectorAll(
      'main[class*="overflow-auto"], [class*="overflow-auto"], [class*="overflow-scroll"], .overflow-auto, .overflow-scroll',
    );

    scrollableElements.forEach((element) => {
      element.scrollTop = 0;
    });

    // Specifically target common layout containers
    const mainContent = document.querySelector('main');
    if (mainContent) {
      mainContent.scrollTop = 0;
    }
  }, [pathname]);

  return null; // This component doesn't render anything
};

export default ScrollToTop;
