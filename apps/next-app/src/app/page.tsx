import Image from 'next/image';

import { FeaturedUsers } from '../components/FeaturedProfessionals';
import { FeaturedProjects } from '../components/FeaturedProjects';
import { getProjects, getUsers } from '../lib/api';

export default async function Home() {
  const { users } = await getUsers(1, 6);
  const { projects } = await getProjects();

  return (
    <main className="space-y-10">
      {/* Hero Section */}
      <section className="relative flex h-[500px] items-center justify-center bg-cover bg-center text-center text-white sm:h-[600px] md:h-[400px] lg:h-[400px] xl:h-[400px]">
        <Image src="/hero-bg.png" alt="Hero Background" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-black/75" />
        <div className="relative z-10 max-w-3xl px-6">
          <h1 className="mb-6 w-full text-2xl font-extrabold sm:text-4xl md:text-5xl lg:text-4xl xl:text-6xl">
            Discover Top Talent & Projects
          </h1>
          <p className="sm:text-md mx-auto mb-8 max-w-xl text-base md:text-lg lg:text-xl xl:text-2xl">
            Join a thriving network of professionals and showcase your work to the world.
          </p>
        </div>
      </section>
      {/* Featured Professionals Section */}
      <section className="container mx-auto md:px-6">
        <FeaturedUsers users={users} />
      </section>
      <section className="container mx-auto md:px-6">
        <FeaturedProjects projects={projects} />
      </section>
    </main>
  );
}
