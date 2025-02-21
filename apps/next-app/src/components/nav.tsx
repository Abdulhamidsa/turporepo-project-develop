'use client';

import { useState } from 'react';

import { Button } from '@repo/ui/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@repo/ui/components/ui/sheet';
import { Menu } from 'lucide-react';
import Link from 'next/link';

export function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-background sticky top-0 z-10 border-b shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold">
            <span className="text-primary">Profolio</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden items-center space-x-4 md:flex">
            <NavLinks />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64 p-4">
                <div className="flex flex-col space-y-3">
                  <NavLinks onClick={() => setOpen(false)} />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}

function NavLinks({ onClick }: { onClick?: () => void }) {
  return (
    <>
      {[
        { href: '/', label: 'Home' },
        { href: '/users', label: 'Professionals' },
        { href: '/projects', label: 'Projects' },
        { href: '/about', label: 'About' },
      ].map(({ href, label }) => (
        <Link key={href} href={href} className="text-sm" onClick={onClick}>
          <Button variant="ghost" className="w-full md:w-auto">
            {label}
          </Button>
        </Link>
      ))}
      <Link href="/for-professionals" onClick={onClick}>
        <Button variant="outline" className="w-full md:w-auto">
          Join as Professional
        </Button>
      </Link>
    </>
  );
}
