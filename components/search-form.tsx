// src/components/SearchForm.tsx (or your preferred components path)
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search as SearchIcon } from 'lucide-react'; // Renamed to avoid conflict if Search is used as a noun

export default function SearchForm() {
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/servers?q=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      // Optional: redirect to the browse page even if search is empty
      router.push('/servers');
    }
  };

  return (
    <form
      onSubmit={handleSearch}
      className="w-full max-w-2xl mx-auto flex items-center gap-2" // Increased max-width for better presence
    >
      <Input
        type="search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search by keyword, hostname, or description..."
        className="flex-grow text-base h-12" // Made input slightly larger
      />
      <Button type="submit" size="lg" className="h-12">
        {' '}
        {/* Matched button height */}
        <SearchIcon className="mr-2 h-5 w-5" />{' '}
        {/* Icon always visible, text hidden on small screens */}
        <span className="hidden md:inline">Search</span>
      </Button>
    </form>
  );
}
