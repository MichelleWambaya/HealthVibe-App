'use client';

import { useState } from 'react';
import { searchConditions } from '@/lib/data';

interface SearchBarProps {
  onSearch: (results: any[]) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState('');

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    if (searchQuery.trim()) {
      const results = searchConditions(searchQuery);
      onSearch(results);
    } else {
      onSearch([]);
    }
  };

  return (
    <div className="relative max-w-lg mx-auto mb-4">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <div className="w-4 h-4 bg-pink-500 flex items-center justify-center">
            <svg className="h-2.5 w-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-10 py-2.5 border border-gray-300 leading-5 bg-white placeholder-gray-400 focus:outline-none focus:placeholder-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-200 text-sm"
          placeholder="Search conditions, symptoms, or remedies..."
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
        />
        {query && (
          <button
            onClick={() => handleSearch('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <div className="w-4 h-4 bg-gray-300 flex items-center justify-center hover:bg-gray-400 transition-colors">
              <svg className="h-2.5 w-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </button>
        )}
      </div>
    </div>
  );
}
