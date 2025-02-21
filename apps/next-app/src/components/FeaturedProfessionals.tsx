'use client';

import type React from 'react';
import { useRef } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@repo/ui/components/ui/avatar';
import { Badge } from '@repo/ui/components/ui/badge';
import { Button } from '@repo/ui/components/ui/button';
import { Card, CardContent } from '@repo/ui/components/ui/card';
import { ChevronLeft, ChevronRight } from 'lucide-react';
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
        <h2 className="text-foreground mb-12 text-center text-4xl font-bold">Featured Creators</h2>
        <div className="relative">
          <div
            ref={carouselRef}
            className="scrollbar-hide flex snap-x snap-mandatory overflow-x-auto"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {users.map((user) => (
              <div
                key={user.friendlyId}
                className="w-full flex-shrink-0 snap-start px-2 sm:w-1/2 lg:w-1/3 xl:w-1/4"
              >
                <Link href={`/user/${user.friendlyId}`}>
                  <Card className="group h-full overflow-hidden transition-all duration-300 hover:shadow-xl">
                    <CardContent className="relative p-0">
                      <div className="relative h-[300px] w-full overflow-hidden">
                        <Image
                          src={user.profilePicture || '/placeholder.svg'}
                          alt={`Profile of ${user.username}`}
                          layout="fill"
                          objectFit="cover"
                          className="transition-transform duration-300 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10 border-2 border-white">
                            <AvatarImage
                              src={
                                user.profilePicture ||
                                `/placeholder.svg?height=40&width=40&text=${user.username[0]}`
                              }
                              alt={user.username}
                            />
                            <AvatarFallback>
                              {user.username
                                .split(' ')
                                .map((n) => n[0])
                                .join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                            <h3 className="text-lg font-semibold text-white">{user.username}</h3>
                            <Badge variant="secondary" className="mt-1">
                              {user.profession || 'Creator'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            ))}
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
