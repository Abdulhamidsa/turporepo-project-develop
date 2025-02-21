import { Button } from '@repo/ui/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

import { FeaturedUsers } from '../components/FeaturedProfessionals';
import { FeaturedProjects } from '../components/featuredProjects';
import { getProjects, getUsers } from '../lib/api';

export default async function Home() {
  const { users } = await getUsers(1, 6);
  const { projects } = await getProjects();

  console.log(users);

  return (
    <main className="space-y-20">
      {/* Hero Section */}
      <section className="relative flex h-[500px] items-center justify-center bg-cover bg-center text-center text-white sm:h-[600px] md:h-[400px] lg:h-[400px] xl:h-[400px]">
        <Image
          src="/hero-bg.png"
          alt="Hero Background"
          layout="fill"
          objectFit="cover"
          className="absolute inset-0 z-0"
        />
        <div className="absolute inset-0 bg-black/75" />
        <div className="relative z-10 max-w-3xl px-6">
          <h1 className="mb-6 w-full text-2xl font-extrabold sm:text-4xl md:text-5xl lg:text-4xl xl:text-6xl">
            Discover Top Talent & Projects
          </h1>
          <p className="sm:text-md mx-auto mb-8 max-w-xl text-base md:text-lg lg:text-xl xl:text-2xl">
            Join a thriving network of professionals and showcase your work to the world.
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
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

      {/* How It Works Section */}

      {/* Featured Professionals Section */}
      <section className="container mx-auto px-6">
        <FeaturedUsers users={users} />
      </section>
      <section className="container mx-auto px-6">
        <FeaturedProjects projects={projects} />
      </section>

      {/* Trending Projects Section */}
      <section className="container mx-auto px-6 py-16">
        <h2 className="mb-8 text-center text-3xl font-bold">Trending Projects</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {[1, 2, 3].map((project) => (
            <div key={project} className="group relative overflow-hidden rounded-lg shadow-lg">
              <Image
                src={`/images/project-${project}.jpg`}
                width={400}
                height={250}
                className="h-full w-full object-cover transition-transform group-hover:scale-105"
                alt="Project"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-4 text-white">
                <h3 className="text-lg font-semibold">Project {project}</h3>
                <p className="text-sm">A creative and innovative solution.</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
