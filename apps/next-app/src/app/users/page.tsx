import React from 'react';

import { Button } from '@repo/ui/components/ui/button';
import { Card, CardContent } from '@repo/ui/components/ui/card';
import { Code, Globe, Layout, PenTool, Server } from 'lucide-react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { SearchForm } from '../../components/SearchForm';
import { getUsers } from '../../lib/api';

export const metadata: Metadata = {
  title: 'Discover Professionals - ProFolio',
  description:
    'Find top professionals across various fields, including software engineering, design, DevOps, and more.',
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

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  // ✅ await the async dynamic API
  const resolvedSearchParams = await searchParams;

  const page = Number.parseInt((resolvedSearchParams?.page as string) || '1', 10);

  if (!resolvedSearchParams?.page) {
    redirect(`/users?page=1`);
  }

  const search = (resolvedSearchParams.search as string) || '';

  const { users, total } = await getUsers(page, 20, search);
  const totalPages = Math.ceil(total / 20);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-center text-2xl font-bold md:text-3xl">Discover Professionals</h1>

      <SearchForm initialSearch={search} searchType="users" />

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {users.map((user: any) => {
          const mapping = ProfessionMapping.find((m) => m.profession === user.profession);
          return (
            <Link href={`/user/${user.friendlyId}`} key={user.id} className="group">
              <Card className="transform overflow-hidden transition-all duration-300 hover:shadow-xl">
                <CardContent className="relative p-0">
                  <div className="relative h-64 w-full">
                    <Image
                      src={user.profilePicture || '/placeholder.svg'}
                      alt={user.username || 'User'}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h2 className="pb-1 text-lg font-semibold">{user.username}</h2>
                    <div className="flex items-center gap-1">
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
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      <div className="mt-12 flex justify-center space-x-4">
        {page > 1 && (
          <Link href={`/users?page=${page - 1}&search=${search}`}>
            <Button variant="outline">Previous</Button>
          </Link>
        )}
        {page < totalPages && (
          <Link href={`/users?page=${page + 1}&search=${search}`}>
            <Button variant="outline">Next</Button>
          </Link>
        )}
      </div>

      <p className="text-muted-foreground mt-4 text-center">
        Page {page} of {totalPages}
      </p>
    </div>
  );
}
