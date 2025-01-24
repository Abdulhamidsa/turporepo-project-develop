import Link from "next/link";
import { Button } from "@repo/ui/components/ui/button";
import { SearchForm } from "../../components/search-form";
import { getUsers } from "../../lib/api";
import { Card, CardContent } from "@repo/ui/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui/components/ui/avatar";
import type { User } from "../../types";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function UsersPage({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  const page = Number.parseInt((searchParams?.page as string) || "1", 10);
  const search = (searchParams?.search as string) || "";
  if (!searchParams?.page) {
    redirect(`/users?page=1${search ? `&search=${search}` : ""}`);
  }
  const { users, total } = await getUsers(page, 20, search);
  const totalPages = Math.ceil(total / 20);

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Discover Professionals</h1>
      <SearchForm searchType="users" />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mt-8">
        {users.map((user: User) => (
          <Link href={`/user/${user.friendlyId}`} key={user.id} className="group">
            <Card className="overflow-hidden transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
              <CardContent className="p-0 relative aspect-square">
                <Avatar className="w-full h-full rounded-none">
                  <AvatarImage src={user.profilePicture || "/default-avatar.png"} alt={user.username || "User"} className="object-cover" />
                  <AvatarFallback className="text-4xl">{(user.username?.slice(0, 1) || "U").toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex flex-col justify-end p-4">
                  <h2 className="font-semibold text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">{user.username}</h2>
                  <p className="text-sm text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">{user.profession}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      <div className="flex justify-center mt-12 space-x-4">
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
      <p className="text-center mt-4 text-muted-foreground">
        Page {page} of {totalPages}
      </p>
    </div>
  );
}
