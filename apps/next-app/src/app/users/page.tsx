/* eslint-disable import/order */
import { Avatar, AvatarFallback, AvatarImage } from '@repo/ui/components/ui/avatar';
import { Button } from '@repo/ui/components/ui/button';
import { Card, CardContent } from '@repo/ui/components/ui/card';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { getUsers } from '../../lib/api';
import type { User } from '../../types';

export const dynamic = 'force-dynamic';

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const resolvedSearchParams = await searchParams;

  const page = Number.parseInt((resolvedSearchParams?.page as string) || '1', 10);
  if (!searchParams?.page) {
    redirect(`/users?page=1`);
  }
  const { users, total } = await getUsers(page, 20);
  const totalPages = Math.ceil(total / 20);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-center text-3xl font-bold">Discover Professionals</h1>
      <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {users.map((user: User) => (
          <Link href={`/user/${user.friendlyId}`} key={user.id} className="group">
            <Card className="transform overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <CardContent className="relative aspect-square p-0">
                <Avatar className="h-full w-full rounded-none">
                  <AvatarImage
                    src={user.profilePicture || '/default-avatar.png'}
                    alt={user.username || 'User'}
                    className="object-cover"
                  />
                  <AvatarFallback className="text-4xl">
                    {(user.username?.slice(0, 1) || 'U').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 flex flex-col justify-end bg-black bg-opacity-0 p-4 transition-all duration-300 group-hover:bg-opacity-60">
                  <h2 className="font-semibold text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    {user.username}
                  </h2>
                  <p className="text-sm text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    {user.profession}
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      <div className="mt-12 flex justify-center space-x-4">
        {page > 1 && (
          <Link href={`/users?page=${page - 1}`}>
            <Button variant="outline">Previous</Button>
          </Link>
        )}
        {page < totalPages && (
          <Link href={`/users?page=${page + 1}`}>
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
