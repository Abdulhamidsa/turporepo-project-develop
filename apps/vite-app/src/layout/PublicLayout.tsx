import React from 'react';

import { Outlet } from 'react-router-dom';

interface PublicLayoutProps {
  children?: React.ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow pt-16">{children || <Outlet />}</main>

      <footer className="bg-background border-t border-border py-6">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} ProFolio. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
