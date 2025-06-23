'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';
import { ServerFilterParams } from './types';

interface ServerFiltersProps {
  filters: ServerFilterParams;
  onFilterChange: (newFilters: Partial<ServerFilterParams>) => void;
  availableCategories: string[]; // e.g., ['Payments', 'Storage', 'AI']
  availableAuthTypes: string[]; // e.g., ['OAuth2', 'API Key']
  onClearFilters: () => void;
}

export default function ServerFilters({
  filters,
  onFilterChange,
  availableCategories,
  availableAuthTypes,
  onClearFilters,
}: ServerFiltersProps) {
  const handleCategoryChange = (category: string, checked: boolean) => {
    const currentCategories = filters.categories || [];
    const newCategories = checked
      ? [...currentCategories, category]
      : currentCategories.filter((c) => c !== category);

    // If newCategories is empty, pass undefined to signify the filter is cleared
    // This aligns with how authTypes and boolean filters are handled (undefined means "not active")
    onFilterChange({
      categories: newCategories.length > 0 ? newCategories : undefined,
      page: 1,
    });
  };

  // handleAuthTypeChange remains the same - it's already correct
  const handleAuthTypeChange = (authType: string, checked: boolean) => {
    const currentAuthTypes = filters.authTypes || [];
    const newAuthTypes = checked
      ? [...currentAuthTypes, authType]
      : currentAuthTypes.filter((at) => at !== authType);
    onFilterChange({
      authTypes: newAuthTypes.length > 0 ? newAuthTypes : undefined,
      page: 1,
    });
  };

  const handleBooleanFilterChange = (
    key: 'dynamicClientRegistration' | 'isOfficial',
    checked: boolean,
  ) => {
    onFilterChange({ [key]: checked ? true : undefined, page: 1 });
  };

  const hasActiveFilters = Object.values(filters).some(
    (val) =>
      val !== undefined &&
      (Array.isArray(val) ? val.length > 0 : true) &&
      val !== filters.q && // Exclude search query from "active filters" for "Clear All" button logic
      val !== filters.page, // Exclude page from "active filters"
  );

  return (
    <aside className="w-full md:w-60 space-y-6 ">
      {' '}
      {/* Consider md:w-64 or md:w-72 if content feels cramped */}
      <div className="flex justify-between items-center min-h-8">
        <h3 className="text-lg font-semibold">Filters</h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-sm">
            <X className="h-4 w-4 mr-1" /> Clear All
          </Button>
        )}
      </div>
      {/* Category Filter */}
      <div>
        <h4 className="font-medium mb-3">Category</h4>
        <div className="space-y-4">
          {availableCategories.map((category) => {
            const isChecked = filters.categories?.includes(category) || false;
            return (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox
                  // Add a key that changes with the checked state to force re-mount
                  key={`${category}-${isChecked}`}
                  id={`cat-${category}`}
                  checked={isChecked}
                  onCheckedChange={(checkedState) => {
                    // LOGGING:
                    // console.log(`onCheckedChange for ${category} - new state from checkbox: ${checkedState}`);
                    handleCategoryChange(category, !!checkedState);
                  }}
                />
                <Label htmlFor={`cat-${category}`} className="font-normal">
                  {category}
                </Label>
              </div>
            );
          })}
        </div>
      </div>
      {/* Authentication Type Filter */}
      <div>
        <h4 className="font-medium mb-3">Auth Type</h4>
        <div className="space-y-4">
          {availableAuthTypes.map((authType) => (
            <div key={authType} className="flex items-center space-x-2">
              <Checkbox
                id={`auth-${authType}`}
                checked={filters.authTypes?.includes(authType) || false}
                onCheckedChange={(checkedState) =>
                  handleAuthTypeChange(authType, !!checkedState)
                }
              />
              <Label htmlFor={`auth-${authType}`} className="font-normal">
                {authType}
              </Label>
            </div>
          ))}
        </div>
      </div>
      {/* Boolean Filters */}
      <div>
        <h4 className="font-medium mb-3">Features</h4>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="dynamicClientReg"
            checked={!!filters.dynamicClientRegistration} // This is fine, !!undefined is false
            onCheckedChange={(checkedState) =>
              handleBooleanFilterChange(
                'dynamicClientRegistration',
                !!checkedState,
              )
            }
          />
          <Label htmlFor="dynamicClientReg" className="font-normal">
            Dynamic Client Registration
          </Label>
        </div>
        <div className="flex items-center space-x-2 mt-4">
          <Checkbox
            id="isOfficial"
            checked={!!filters.isOfficial}
            onCheckedChange={(checkedState) =>
              handleBooleanFilterChange('isOfficial', !!checkedState)
            }
          />
          <Label htmlFor="isOfficial" className="font-normal">
            Official
          </Label>
        </div>
      </div>
    </aside>
  );
}
