import React, { useEffect, useState } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@repo/ui/components/ui/avatar';
import { Button } from '@repo/ui/components/ui/button';
import { Card } from '@repo/ui/components/ui/card';
import { Input } from '@repo/ui/components/ui/input';
import { ArrowLeft, ArrowRight, Menu, Search, X } from 'lucide-react';
import { Link } from 'react-router-dom';

import { getCountryFlagIcon } from '../../utils/generateCountryFlag';
import { Skeleton } from '../components/ui/skeleton';
import { DarkModeToggle } from '../layout/DarkModeToggle';

// import { useAuth } from '../features/user/hooks/use.auth';

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

// Public Navbar Component
function PublicNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-background/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-primary">
              ProFolio
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
              Home
            </Link>
            <DarkModeToggle />
            <Link to="/auth">
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                Sign In
              </Button>
            </Link>
            <Link to="/auth">
              <Button size="sm" className="bg-primary hover:bg-primary/90">
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <DarkModeToggle />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="ml-2"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-background">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to="/"
                className="block px-3 py-2 text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-muted-foreground hover:text-foreground"
                >
                  Sign In
                </Button>
              </Link>
              <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full bg-primary hover:bg-primary/90 mt-2">Get Started</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default function UsersGallery({ initialPage = 1, pageSize = 18 }: UsersGalleryProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

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
      // console.log('API Response:', response_data); // Debug log

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

      // Handle pagination from the API response
      const paginationData = response_data.success
        ? response_data.data?.pagination
        : response_data.pagination;

      let calculatedTotalPages = 1;

      if (paginationData?.totalPages) {
        calculatedTotalPages = paginationData.totalPages;
      } else if (response_data.meta?.totalPages) {
        calculatedTotalPages = response_data.meta.totalPages;
      } else if (response_data.totalPages) {
        calculatedTotalPages = response_data.totalPages;
      } else if (paginationData?.total) {
        calculatedTotalPages = Math.ceil(paginationData.total / pageSize);
      } else {
        // Fallback: calculate based on current results
        calculatedTotalPages = filteredUsers.length === pageSize ? page + 1 : page;
      }

      // If we get no users and we're on a page > 1, go back to page 1
      if (filteredUsers.length === 0 && page > 1) {
        setPage(1);
        return; // Exit early, useEffect will trigger again with page 1
      }

      setUsers(filteredUsers);
      setTotalPages(Math.max(calculatedTotalPages, 1));
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
    setError(null); // Clear any previous errors
  };

  const handleUserClick = (user: User) => {
    // window.location.href = `/explore/professionals/${user.friendlyId}`;
    window.location.href = `/user/${user.friendlyId}`;
  };

  const goToPreviousPage = () => {
    if (page > 1 && !loading) {
      setPage(page - 1);
    }
  };

  const goToNextPage = () => {
    if (page < totalPages && !loading && users.length > 0) {
      setPage(page + 1);
    }
  };

  // Calculate if pagination should be shown
  const shouldShowPagination = totalPages > 1 && users.length > 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Public Navigation */}
      <PublicNavbar />

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Discover Professionals</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Connect with talented professionals from around the world sharing their work and
            expertise
          </p>
        </div>
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
                {/* Users Grid - Consistent Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {users.map((user) => {
                    return (
                      <div
                        key={user.id}
                        className="group cursor-pointer"
                        onClick={() => handleUserClick(user)}
                      >
                        {/* Consistent Card Size */}
                        <div className="bg-card border border-border rounded-lg p-4 hover:border-primary/40 hover:shadow-md transition-all duration-200 h-full flex flex-col">
                          {/* Profile Picture - Fixed Size */}
                          <div className="flex justify-center mb-3">
                            <Avatar className="h-16 w-16 border border-border">
                              <AvatarImage
                                src={user.profilePicture || ''}
                                alt={user.username || 'User'}
                                className="object-cover"
                              />
                              <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg">
                                {user.username ? user.username.charAt(0).toUpperCase() : '?'}
                              </AvatarFallback>
                            </Avatar>
                          </div>

                          {/* User Info - Fixed Height */}
                          <div className="text-center flex-1 flex flex-col">
                            {/* Name - Truncated */}
                            <h3 className="font-semibold text-card-foreground mb-1 text-sm line-clamp-1 group-hover:text-primary transition-colors">
                              {user.username || 'Anonymous'}
                            </h3>

                            {/* Profession - Truncated */}
                            <p className="text-xs text-muted-foreground mb-2 line-clamp-1 flex-1">
                              {user.profession || 'Professional'}
                            </p>

                            {/* Location - Only Flag */}
                            <div className="flex items-center justify-center">
                              {user.countryOrigin && (
                                <img
                                  src={`https://flagcdn.com/w20/${getCountryFlagIcon(user.countryOrigin)}.png`}
                                  alt={user.countryOrigin}
                                  className="h-3 w-4 rounded-sm object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = 'none';
                                  }}
                                />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Pagination - Only show if there are multiple pages and users */}
                {shouldShowPagination && (
                  <div className="flex justify-center mt-8 gap-2">
                    <Button
                      variant="outline"
                      onClick={goToPreviousPage}
                      disabled={page <= 1 || loading}
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
                      disabled={page >= totalPages || loading || users.length < pageSize}
                      size="sm"
                    >
                      Next <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
