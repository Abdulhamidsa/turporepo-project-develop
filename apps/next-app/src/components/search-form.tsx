"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import debounce from "lodash.debounce";

interface SearchFormProps {
  initialSearch?: string;
  searchType: "projects" | "users"; // 🔥 Dynamic search type
  debounceDelay?: number; // 🔥 Custom debounce timing
}

export function SearchForm({ initialSearch = "", searchType, debounceDelay = 500 }: SearchFormProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState(initialSearch);

  // ✅ Debounced search function (dynamic route)
  const debouncedSearch = debounce((searchTerm: string) => {
    const baseRoute = searchType === "users" ? "/users" : "/projects";
    router.push(`${baseRoute}?search=${encodeURIComponent(searchTerm)}&page=1`);
  }, debounceDelay);

  // ✅ Trigger search when query changes
  useEffect(() => {
    if (query.trim() !== "") {
      debouncedSearch(query);
    } else {
      const baseRoute = searchType === "users" ? "/users" : "/projects";
      router.push(`${baseRoute}?page=1`);
    }

    return () => debouncedSearch.cancel(); // Cleanup
  }, [query]);

  return <input type="text" placeholder={`Search ${searchType}...`} value={query} onChange={(e) => setQuery(e.target.value)} className="px-4 py-2 border rounded-lg w-full" />;
}
