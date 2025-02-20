'use client';

import { useEffect, useState } from 'react';

import debounce from 'lodash.debounce';
import { useRouter } from 'next/navigation';

interface SearchFormProps {
  initialSearch?: string;
  searchType: 'projects' | 'users'; // 🔥 Dynamic search type
  debounceDelay?: number; // 🔥 Custom debounce timing
}

export function SearchForm({
  initialSearch = '',
  searchType,
  debounceDelay = 500,
}: SearchFormProps) {
  const router = useRouter();
  // const pathname = usePathname();
  const [query, setQuery] = useState(initialSearch);

  // ✅ Debounced search function (dynamic route)
  const debouncedSearch = debounce((searchTerm: string) => {
    const baseRoute = searchType === 'users' ? '/users' : '/projects';
    router.push(`${baseRoute}?search=${encodeURIComponent(searchTerm)}&page=1`);
  }, debounceDelay);

  // ✅ Trigger search when query changes
  useEffect(() => {
    if (query.trim() !== '') {
      debouncedSearch(query);
    } else {
      const baseRoute = searchType === 'users' ? '/users' : '/projects';
      router.push(`${baseRoute}?page=1`);
    }

    return () => debouncedSearch.cancel(); // Cleanup
  }, [debouncedSearch, query, router, searchType]);

  return (
    <input
      type="text"
      placeholder={`Search ${searchType}...`}
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      className="w-full rounded-lg border px-4 py-2"
    />
  );
}
