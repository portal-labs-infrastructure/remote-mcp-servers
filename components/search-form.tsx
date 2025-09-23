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
      className="w-full max-w-3xl mx-auto flex items-center gap-3 p-2 bg-background/50 backdrop-blur-sm border border-border rounded-xl shadow-lg hover:shadow-xl transition-all duration-200" // Enhanced container
    >
      <Input
        type="search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search by keyword, hostname, or description..."
        className="flex-grow text-base h-14 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-foreground placeholder:text-muted-foreground/70" // Enhanced input
      />
      <Button
        type="submit"
        size="lg"
        className="h-12 px-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105">
        <SearchIcon className="mr-2 h-5 w-5" />
        <span className="hidden md:inline">Search</span>
      </Button>
    </form>
  );
}
