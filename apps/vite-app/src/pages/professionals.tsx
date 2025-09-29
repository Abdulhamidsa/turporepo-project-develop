import { useState } from 'react';

import { Briefcase, Filter, MapPin, Search, Star, Users } from 'lucide-react';

import SuggestedUsers from '../components/SuggestedUsers';

export default function ProfessionalsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const filters = [
    { id: 'all', label: 'All Professionals', icon: Users },
    { id: 'developer', label: 'Developers', icon: Briefcase },
    { id: 'designer', label: 'Designers', icon: Star },
    { id: 'manager', label: 'Managers', icon: MapPin },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Discover Professionals</h1>
          <p className="text-muted-foreground text-lg">
            Connect with talented professionals in your network
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <input
              type="text"
              placeholder="Search professionals by name, skill, or profession..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-200"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => {
              const IconComponent = filter.icon;
              return (
                <button
                  key={filter.id}
                  onClick={() => setSelectedFilter(filter.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 ${
                    selectedFilter === filter.id
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : 'bg-muted/40 text-muted-foreground hover:bg-muted/60 hover:text-foreground'
                  }`}
                >
                  <IconComponent className="h-4 w-4" />
                  <span className="font-medium">{filter.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Professionals Grid */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-foreground mb-2">
                {selectedFilter === 'all'
                  ? 'All Professionals'
                  : filters.find((f) => f.id === selectedFilter)?.label}
              </h2>
              <p className="text-muted-foreground text-sm">
                {searchQuery
                  ? `Results for "${searchQuery}"`
                  : 'Browse and connect with professionals'}
              </p>
            </div>

            {/* Use SuggestedUsers component with grid layout */}
            <SuggestedUsers layout="grid" />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Network Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total Professionals</span>
                  <span className="font-semibold text-foreground">1,234</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Active This Week</span>
                  <span className="font-semibold text-foreground">892</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">New Members</span>
                  <span className="font-semibold text-foreground">45</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center gap-3 p-3 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-colors duration-200">
                  <Users className="h-5 w-5" />
                  <span className="font-medium">Invite Colleagues</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 rounded-xl bg-muted/40 text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-colors duration-200">
                  <Filter className="h-5 w-5" />
                  <span className="font-medium">Advanced Filters</span>
                </button>
              </div>
            </div>

            {/* Popular Professions */}
            <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Popular Professions</h3>
              <div className="space-y-2">
                {[
                  { name: 'Software Developer', count: 312 },
                  { name: 'UI/UX Designer', count: 189 },
                  { name: 'Product Manager', count: 156 },
                  { name: 'Data Scientist', count: 134 },
                  { name: 'DevOps Engineer', count: 98 },
                ].map((profession) => (
                  <div key={profession.name} className="flex justify-between items-center py-2">
                    <span className="text-foreground text-sm">{profession.name}</span>
                    <span className="text-muted-foreground text-xs bg-muted/30 px-2 py-1 rounded-full">
                      {profession.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
