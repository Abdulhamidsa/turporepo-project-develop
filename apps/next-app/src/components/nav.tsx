import { Button } from '@repo/ui/components/ui/button';
import Link from 'next/link';

export function Nav() {
  return (
    <nav className="bg-background sticky top-0 z-10 border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="text-xl font-bold">
            <span className="text-primary">Portfolio</span>Showcase
          </Link>
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-sm">
              <Button variant="ghost">Home</Button>
            </Link>
            <Link href="/users" className="text-sm">
              <Button variant="ghost">Professionals</Button>
            </Link>
            <Link href="/projects" className="text-sm">
              <Button variant="ghost">Projects</Button>
            </Link>
            <Link href="/about" className="text-sm">
              <Button variant="ghost">About</Button>
            </Link>
            <Link href="/for-professionals" className="text-sm">
              <Button variant="outline">Join as Professional</Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
