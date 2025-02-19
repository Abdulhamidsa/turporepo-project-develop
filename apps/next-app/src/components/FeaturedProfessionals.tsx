'use client';

import React from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@repo/ui/components/ui/avatar';
import { Badge } from '@repo/ui/components/ui/badge';
import { Card, CardContent } from '@repo/ui/components/ui/card';

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
  return (
    <section className="bg-card w-full">
      <div className="container mx-auto px-4">
        <h2 className="text-accent-foreground p-16 text-center text-4xl font-bold">
          Featured Creators
        </h2>
        <div className="group relative overflow-hidden">
          <div className="animate-scroll flex space-x-6" style={{ width: '200%' }}>
            {[...users, ...users].map((user, index) => (
              <Card
                key={`${user.friendlyId}-${index}`}
                className="mb-12 w-[300px] flex-shrink-0 overflow-hidden transition-shadow duration-300 hover:shadow-xl"
              >
                <CardContent className="relative p-0">
                  <img
                    src={user.profilePicture || '/placeholder.svg'}
                    alt={`Profile of ${user.username}`}
                    className="h-[400px] w-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
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
                      <div>
                        <h3 className="text-lg font-semibold text-white">{user.username}</h3>
                        <Badge variant="secondary" className="mt-1">
                          {user.profession || 'Unknown Profession'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
