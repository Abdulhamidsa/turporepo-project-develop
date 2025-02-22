'use client';

import React, { useRef } from 'react';

import { Button } from '@repo/ui/components/ui/button';
import { ChevronLeft, ChevronRight, Code, Globe, Layout, PenTool, Server } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface User {
  friendlyId: string;
  username: string;
  profilePicture?: string;
  profession?: string;
}

type FeaturedUsersProps = {
  users: User[];
};

const ProfessionMapping = [
  {
    profession: 'Software Engineer',
    label: 'Software Engineer',
    icon: Code,
    color: 'text-blue-500',
  },
  { profession: 'UI/UX Designer', label: 'UI/UX Designer', icon: Layout, color: 'text-pink-500' },
  { profession: 'Web Developer', label: 'Web Developer', icon: Globe, color: 'text-green-500' },
  {
    profession: 'Product Designer',
    label: 'Product Designer',
    icon: PenTool,
    color: 'text-purple-500',
  },
  {
    profession: 'DevOps Engineer',
    label: 'DevOps Engineer',
    icon: Server,
    color: 'text-orange-500',
  },
];

export const FeaturedUsers: React.FC<FeaturedUsersProps> = ({ users }) => {
  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollPrev = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -carouselRef.current.offsetWidth, behavior: 'smooth' });
    }
  };

  const scrollNext = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: carouselRef.current.offsetWidth, behavior: 'smooth' });
    }
  };

  return (
    <section className="bg-background w-full py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-foreground mb-12 text-center text-2xl font-bold md:text-2xl lg:text-4xl">
          Featured Creators
        </h2>
        <div className="relative">
          <div
            ref={carouselRef}
            className="scrollbar-hide flex snap-x snap-mandatory overflow-x-auto"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {users.map((user) => {
              const mapping = ProfessionMapping.find((m) => m.profession === user.profession);
              return (
                <div
                  key={user.friendlyId}
                  className="w-full flex-shrink-0 snap-start px-2 sm:w-1/2 lg:w-1/3 xl:w-1/4"
                >
                  <Link href={`/user/${user.friendlyId}`} className="group">
                    <div className="flex flex-col items-center transition-all duration-300 hover:shadow-xl">
                      {/* Circular Avatar */}
                      <div className="border-border relative h-60 w-60 overflow-hidden rounded-full border shadow-lg">
                        <Image
                          src={user.profilePicture || '/placeholder.svg'}
                          alt={`Profile of ${user.username}`}
                          fill
                          className="object-cover"
                          sizes="100%"
                        />
                      </div>
                      {/* User Details */}
                      <div className="mt-4 text-center">
                        <h3 className="text-foreground text-lg font-semibold">{user.username}</h3>
                        <div className="flex items-center justify-center gap-1">
                          {mapping ? (
                            <>
                              <mapping.icon className={`${mapping.color} h-5 w-5`} />
                              <p className="text-muted-foreground text-sm">{mapping.label}</p>
                            </>
                          ) : (
                            <p className="text-muted-foreground text-sm">{user.profession}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
          <Button
            variant="outline"
            size="icon"
            className="bg-background/80 absolute -left-4 top-1/2 z-10 -translate-y-1/2 transform rounded-full shadow-md"
            onClick={scrollPrev}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="bg-background/80 absolute -right-4 top-1/2 z-10 -translate-y-1/2 transform rounded-full shadow-md"
            onClick={scrollNext}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};
