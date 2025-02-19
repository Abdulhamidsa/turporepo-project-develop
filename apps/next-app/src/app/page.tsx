import { Button } from '@repo/ui/components/ui/button';
import { Card, CardContent } from '@repo/ui/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';

import { FeaturedUsers } from '../components/FeaturedProfessionals';
import { getUsers } from '../lib/api';

export default async function Home() {
  const { users } = await getUsers(1, 6, '');
  console.log(users);

  return (
    <main className="space-y-16">
      <section className="from-primary to-secondary text-primary-foreground bg-gradient-to-r py-24 text-center">
        <div className="container mx-auto px-6">
          <h1 className="mb-4 text-4xl font-bold">Discover Amazing Talent</h1>
          <p className="mx-auto mb-6 max-w-2xl text-lg">
            Connect with skilled professionals and explore their innovative projects.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/users">
              <Button size="lg" variant="secondary">
                Explore Professionals
              </Button>
            </Link>
            <Link href="/projects">
              <Button size="lg" variant="outline">
                View Projects
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Professionals Section (Client Component) */}
      <FeaturedUsers users={users} />
    </main>
  );
}
