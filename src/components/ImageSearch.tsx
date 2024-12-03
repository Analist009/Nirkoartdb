import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { cn } from '../lib/utils';

interface ImageSearchProps {
  onSearch: (query: string) => void;
}

export function ImageSearch({ onSearch }: ImageSearchProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto mb-6">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="חפש תמונות לפי תיאור או תגיות..."
          className={cn(
            "w-full px-4 py-3 text-right rounded-lg",
            "border-2 border-indigo-200 focus:border-indigo-500",
            "focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
          )}
          dir="rtl"
        />
        <button
          type="submit"
          className="absolute left-2 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-indigo-600"
        >
          <Search className="h-5 w-5" />
        </button>
      </div>
    </form>
  );
}