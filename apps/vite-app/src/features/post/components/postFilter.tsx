import { useState } from 'react';

import { Button } from '@repo/ui/components/ui/button';
import { Input } from '@repo/ui/components/ui/input';
import { Select, SelectItem } from '@repo/ui/components/ui/select';

const professionOptions = [
  { value: 'all', label: 'All Professions' },
  { value: 'Software Engineer', label: 'Software Engineer' },
  { value: 'UI/UX Designer', label: 'UI/UX Designer' },
  { value: 'Web Developer', label: 'Web Developer' },
  { value: 'Product Designer', label: 'Product Designer' },
  { value: 'DevOps Engineer', label: 'DevOps Engineer' },
];

const sortOptions = [
  { value: 'all', label: 'All' },
  { value: 'mostLiked', label: 'Most Liked' },
  { value: 'newest', label: 'Newest' },
];

type FilterProps = {
  onFilterChange: (filters: { search: string; profession: string; sortBy: string }) => void;
};

export const PostFilter = ({ onFilterChange }: FilterProps) => {
  const [search, setSearch] = useState('');
  const [profession, setProfession] = useState('all');
  const [sortBy, setSortBy] = useState('all');

  const applyFilters = () => {
    onFilterChange({ search, profession, sortBy });
  };

  return (
    <div className="bg-card mb-6 flex flex-col items-center gap-4 rounded-lg p-4 shadow-md md:flex-row">
      <Input
        placeholder="Search posts..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full md:w-1/3"
      />

      <Select value={profession} onValueChange={setProfession}>
        {professionOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </Select>

      <Select value={sortBy} onValueChange={setSortBy}>
        {sortOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </Select>

      <Button onClick={applyFilters} className="w-full md:w-auto">
        Apply Filters
      </Button>
    </div>
  );
};
