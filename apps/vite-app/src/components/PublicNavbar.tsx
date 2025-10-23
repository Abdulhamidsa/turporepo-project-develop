import { useEffect, useState } from 'react';

import { Button } from '@repo/ui/components/ui/button';
import { Code, Layout, Menu, Users } from 'lucide-react';

import { routesConfig } from '../../routes/routesConfig';

type NavProps = {
  onOpenSignIn: () => void;
  onOpenSignUp: () => void;
};

export default function PublicNavbar({ onOpenSignIn, onOpenSignUp }: NavProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Determine if we're running in the landing page or main app
  const isMainApp = window.location.pathname !== '/auth';

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setScrolled(offset > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-30 transition-all duration-300 ${
        scrolled ? 'bg-background/80 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <div className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            ProFolio
          </div>
        </div>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center space-x-8">
          <nav className="flex space-x-6">
            <a
              href={isMainApp ? routesConfig.users : '#explore'}
              className="text-foreground hover:text-primary transition-colors flex items-center gap-2"
            >
              <Users size={16} />
              <span>Explore Users</span>
            </a>
            <a
              href={isMainApp ? '/projects' : '#projects'}
              className="text-foreground hover:text-primary transition-colors flex items-center gap-2"
            >
              <Code size={16} />
              <span>Projects</span>
            </a>
            <a
              href={isMainApp ? '/about' : '#features'}
              className="text-foreground hover:text-primary transition-colors flex items-center gap-2"
            >
              <Layout size={16} />
              <span>Features</span>
            </a>
          </nav>

          <div className="flex space-x-3">
            <Button
              type="button"
              variant="ghost"
              onClick={onOpenSignIn}
              className="hover:text-primary"
            >
              Sign In
            </Button>
            <Button
              type="button"
              onClick={onOpenSignUp}
              className="bg-primary hover:bg-accent text-white"
            >
              Create Account
            </Button>
          </div>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-foreground"
            aria-label="Toggle menu"
          >
            <Menu />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden bg-background shadow-md transition-all duration-300 ease-in-out overflow-hidden ${
          mobileMenuOpen
            ? 'max-h-96 opacity-100 transform translate-y-0'
            : 'max-h-0 opacity-0 transform -translate-y-2'
        }`}
      >
        <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
          <nav className="flex flex-col space-y-4">
            <a
              href={isMainApp ? routesConfig.users : '#explore'}
              className="text-foreground hover:text-primary transition-colors flex items-center gap-2 p-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Users size={16} />
              <span>Explore Users</span>
            </a>
            <a
              href={isMainApp ? '/projects' : '#projects'}
              className="text-foreground hover:text-primary transition-colors flex items-center gap-2 p-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Code size={16} />
              <span>Projects</span>
            </a>
            <a
              href={isMainApp ? '/about' : '#features'}
              className="text-foreground hover:text-primary transition-colors flex items-center gap-2 p-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Layout size={16} />
              <span>Features</span>
            </a>
          </nav>

          <div className="flex flex-col space-y-2 pt-2 border-t border-border">
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                onOpenSignIn();
                setMobileMenuOpen(false);
              }}
              className="justify-center"
            >
              Sign In
            </Button>
            <Button
              type="button"
              onClick={() => {
                onOpenSignUp();
                setMobileMenuOpen(false);
              }}
              className="bg-primary hover:bg-accent text-white justify-center"
            >
              Create Accountddf
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
