import React, { useEffect, useState } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@repo/ui/components/ui/avatar';
import { Button } from '@repo/ui/components/ui/button';
import { Card } from '@repo/ui/components/ui/card';
import { Input } from '@repo/ui/components/ui/input';
import { ArrowLeft, ArrowRight, Briefcase, MapPin, Search } from 'lucide-react';

import { Skeleton } from '../components/ui/skeleton';
import { getCountryFlagIcon } from '../utils/generateCountryFlag';
// import { useAuth } from '../features/user/hooks/use.auth';
import UserProfileModal from './UserProfileModal';

// Using the existing User type from useUserALL hook
interface User {
  id: string;
  username: string;
  friendlyId: string;
  completedProfile: boolean;
  profession: string | null;
  profilePicture: string | null;
  countryOrigin?: string | null;
  createdAt: string;
  updatedAt: string;
}

interface UsersGalleryProps {
  initialPage?: number;
  pageSize?: number;
}

export default function UsersGallery({ initialPage = 1, pageSize = 18 }: UsersGalleryProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // const { isAuthenticated } = useAuth(); // Removed for now

  const fetchUsers = async () => {
    setLoading(true);

    const baseUrl = import.meta.env.VITE_BASE_URL;
    const url = `${baseUrl}/users?page=${page}&limit=${pageSize}&search=${encodeURIComponent(searchQuery)}`;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const response_data = await response.json();
      console.log('API Response:', response_data); // Debug log

      // Handle the API response format: { success: true, data: { users: [...] } }
      let usersList: User[] = [];

      if (response_data.success && response_data.data && Array.isArray(response_data.data.users)) {
        usersList = response_data.data.users;
      } else if (Array.isArray(response_data)) {
        usersList = response_data;
      } else if (response_data && Array.isArray(response_data.users)) {
        usersList = response_data.users;
      } else if (response_data && Array.isArray(response_data.data)) {
        usersList = response_data.data;
      } else {
        console.warn('Unexpected API response format:', response_data);
        usersList = [];
      }

      // Filter users to show those with either completed profiles or at least basic info
      const filteredUsers = usersList.filter(
        (user: User) => user.completedProfile || user.profession || user.profilePicture,
      );

      setUsers(filteredUsers);

      // Handle pagination from the API response
      const paginationData = response_data.success
        ? response_data.data.pagination
        : response_data.pagination;
      const totalPages =
        paginationData?.totalPages ||
        response_data.meta?.totalPages ||
        response_data.totalPages ||
        Math.ceil((paginationData?.total || filteredUsers.length) / pageSize) ||
        1;

      setTotalPages(totalPages);
    } catch (err) {
      setError('Failed to load users. Please try again later.');
      console.error('Error fetching users:', err);
      console.error('Error details:', {
        message: err instanceof Error ? err.message : 'Unknown error',
        url: url,
        baseUrl: baseUrl,
      });
      // Set empty users array on error
      setUsers([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1); // Reset to first page on new search
    fetchUsers();
  };

  const handleUserClick = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const goToPreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const goToNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => (window.location.href = '/')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Home
              </Button>
              <h1 className="text-xl font-semibold">Discover Professionals</h1>
            </div>
            <Button variant="default" onClick={() => (window.location.href = '/auth')}>
              Sign In
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-8 max-w-md mx-auto">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by name or profession..."
              className="pl-9 pr-4"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </form>

        {/* Error State */}
        {error && (
          <div className="text-center my-8 text-red-500">
            <p>{error}</p>
            <Button variant="outline" onClick={fetchUsers} className="mt-4">
              Retry
            </Button>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {Array.from({ length: pageSize }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <div className="p-4 flex flex-col items-center">
                  <Skeleton className="h-20 w-20 rounded-full" />
                  <Skeleton className="h-5 w-24 mt-3" />
                  <Skeleton className="h-4 w-16 mt-2" />
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <>
            {/* Empty State */}
            {users.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">
                  No users found matching your search criteria.
                </p>
                <Button variant="outline" onClick={() => setSearchQuery('')}>
                  Clear Search
                </Button>
              </div>
            ) : (
              <>
                {/* Users Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {users.map((user) => {
                    return (
                      <div
                        key={user.id}
                        className="group relative cursor-pointer"
                        onClick={() => handleUserClick(user)}
                      >
                        {/* Clean Card */}
                        <div className="relative overflow-hidden rounded-xl bg-card border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-md">
                          {/* Subtle hover effect */}
                          <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                          {/* Content */}
                          <div className="relative p-6 flex flex-col items-center text-center">
                            {/* Profile Picture */}
                            <div className="relative mb-4">
                              <Avatar className="h-16 w-16 border-2 border-border group-hover:border-primary/30 transition-colors duration-300">
                                <AvatarImage
                                  src={user.profilePicture || ''}
                                  alt={user.username || 'User'}
                                  className="object-cover"
                                />
                                <AvatarFallback className="bg-muted text-muted-foreground font-bold text-lg">
                                  {user.username ? user.username.slice(0, 2).toUpperCase() : '✨'}
                                </AvatarFallback>
                              </Avatar>
                              {/* Status indicator */}
                              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-primary border-2 border-background rounded-full" />
                            </div>

                            {/* Name */}
                            <h3 className="font-semibold text-lg text-card-foreground mb-2 line-clamp-1 group-hover:text-primary transition-colors duration-300">
                              {user.username}
                            </h3>

                            {/* Profession */}
                            {user.profession && (
                              <div className="flex items-center gap-1.5 mb-3 text-sm text-muted-foreground">
                                <Briefcase className="w-4 h-4" />
                                <span>{user.profession}</span>
                              </div>
                            )}

                            {/* Location */}
                            {user.countryOrigin && (
                              <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground mb-2">
                                <MapPin className="w-3.5 h-3.5" />
                                <img
                                  src={`https://flagcdn.com/w20/${getCountryFlagIcon(user.countryOrigin)}.png`}
                                  alt={user.countryOrigin}
                                  className="h-3 w-4 rounded-sm object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = 'none';
                                  }}
                                />
                                <span>{user.countryOrigin}</span>
                              </div>
                            )}

                            {/* Stats */}
                            <div className="text-xs text-muted-foreground text-center pt-2 border-t border-border">
                              Member since{' '}
                              {new Date(user.createdAt).toLocaleDateString(undefined, {
                                month: 'short',
                                year: 'numeric',
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Pagination */}
                <div className="flex justify-center mt-8 gap-2">
                  <Button
                    variant="outline"
                    onClick={goToPreviousPage}
                    disabled={page <= 1}
                    size="sm"
                  >
                    <ArrowLeft className="h-4 w-4 mr-1" /> Previous
                  </Button>
                  <div className="text-sm text-muted-foreground flex items-center px-3">
                    Page {page} of {totalPages}
                  </div>
                  <Button
                    variant="outline"
                    onClick={goToNextPage}
                    disabled={page >= totalPages}
                    size="sm"
                  >
                    Next <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </>
            )}
          </>
        )}

        {/* User Profile Modal */}
        <UserProfileModal user={selectedUser} isOpen={isModalOpen} onOpenChange={setIsModalOpen} />
      </div>
    </div>
  );
}
