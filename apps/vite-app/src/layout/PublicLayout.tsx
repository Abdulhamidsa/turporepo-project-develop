import React from 'react';

import { Outlet } from 'react-router-dom';

import PublicNavbar from '../components/PublicNavbar';

interface PublicLayoutProps {
  children?: React.ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  // State for sign-in/sign-up modals
  const [, setIsSignInOpen] = React.useState(false);
  const [, setIsSignUpOpen] = React.useState(false);

  const handleOpenSignIn = () => {
    setIsSignInOpen(true);
    setIsSignUpOpen(false);
  };

  const handleOpenSignUp = () => {
    setIsSignUpOpen(true);
    setIsSignInOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <PublicNavbar onOpenSignIn={handleOpenSignIn} onOpenSignUp={handleOpenSignUp} />

      <main className="flex-grow pt-16">{children || <Outlet />}</main>

      <footer className="bg-background border-t border-border py-6">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} ProFolio. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
