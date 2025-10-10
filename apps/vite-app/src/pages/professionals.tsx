import { useState } from 'react';

import { Professions } from '@repo/data/constants/professions';
import { Button } from '@repo/ui/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/ui/components/ui/select';
import { Search, Users, X } from 'lucide-react';

import SuggestedUsers from '../components/SuggestedUsers';

export default function ProfessionalsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProfession, setSelectedProfession] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('name');

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedProfession('all');
    setSortBy('name');
  };

  const hasActiveFilters = searchQuery || selectedProfession !== 'all' || sortBy !== 'name';

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header Section */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground mb-1">Discover Professionals</h1>
          <p className="text-muted-foreground">
            Connect with talented professionals in your network
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-6 space-y-4">
          {/* Search Bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <input
              type="text"
              placeholder="Search by name or skill..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-200"
            />
          </div>

          {/* Filters Row */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Profession Filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-foreground">Profession:</span>
              <Select value={selectedProfession} onValueChange={setSelectedProfession}>
                <SelectTrigger className="w-[180px] h-9">
                  <SelectValue placeholder="All Professions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Professions</SelectItem>
                  {Professions.map((profession) => (
                    <SelectItem key={profession.value} value={profession.value}>
                      {profession.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sort By Filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-foreground">Sort by:</span>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[120px] h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="profession">Profession</SelectItem>
                  <SelectItem value="recent">Recent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="h-9 px-3 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4 mr-1" />
                Clear
              </Button>
            )}

            {/* Results Count */}
            <div className="ml-auto text-sm text-muted-foreground">
              <Users className="inline h-4 w-4 mr-1" />
              {searchQuery && `Results for "${searchQuery}"`}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full">
          {/* Use SuggestedUsers component with grid layout */}
          <SuggestedUsers layout="grid" />
        </div>
      </div>
    </div>
  );
}
