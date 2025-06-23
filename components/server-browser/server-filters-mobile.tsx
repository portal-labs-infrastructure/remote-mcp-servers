import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';
import { Funnel } from 'lucide-react'; // or your preferred icon
import ServerFilters from './server-filters';
import { ServerFilterParams } from './types';

interface ServerFiltersProps {
  filters: ServerFilterParams;
  onFilterChange: (newFilters: Partial<ServerFilterParams>) => void;
  availableCategories: string[]; // e.g., ['Payments', 'Storage', 'AI']
  availableAuthTypes: string[]; // e.g., ['OAuth2', 'API Key']
  onClearFilters: () => void;
  activeFilterCount: number;
}

export default function ServerFiltersMobile({
  filters,
  onFilterChange,
  availableCategories,
  availableAuthTypes,
  onClearFilters,
  activeFilterCount,
}: ServerFiltersProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden mb-4">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            className="w-full flex items-center justify-center">
            <Funnel className="h-4 w-4 mr-2" />
            Filters
            {activeFilterCount > 0 && (
              <span className="ml-2 bg-secondary text-white rounded-full px-2 py-0.5 text-xs">
                {activeFilterCount}
              </span>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="w-full max-w-xs sm:max-w-sm overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Filter MCP Server Results</SheetTitle>
          </SheetHeader>
          <div className="px-4">
            <ServerFilters
              filters={filters}
              onFilterChange={onFilterChange}
              availableCategories={availableCategories}
              availableAuthTypes={availableAuthTypes}
              onClearFilters={onClearFilters}
            />
          </div>
          <div className="flex justify-end gap-2 mt-6 p-4">
            <Button variant="outline" onClick={onClearFilters}>
              Clear All
            </Button>
            <SheetClose asChild>
              <Button onClick={() => setOpen(false)}>Apply</Button>
            </SheetClose>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
