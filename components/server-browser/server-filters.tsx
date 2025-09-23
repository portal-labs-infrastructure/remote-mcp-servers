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
    <aside className="w-full lg:w-72 space-y-8">
      <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-6 shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-foreground">Filters</h3>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="text-sm hover:bg-destructive/10 hover:text-destructive transition-colors">
              <X className="h-4 w-4 mr-1" />
              Clear All
            </Button>
          )}
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <h4 className="font-semibold mb-4 text-foreground text-base">
            Category
          </h4>
          <div className="space-y-3">
            {availableCategories.map((category) => {
              const isChecked = filters.categories?.includes(category) || false;
              return (
                <div
                  key={category}
                  className="flex items-center space-x-3 group">
                  <Checkbox
                    key={`${category}-${isChecked}`}
                    id={`cat-${category}`}
                    checked={isChecked}
                    onCheckedChange={(checkedState) => {
                      handleCategoryChange(category, !!checkedState);
                    }}
                    className="border-2 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <Label
                    htmlFor={`cat-${category}`}
                    className="font-medium text-foreground group-hover:text-primary transition-colors cursor-pointer">
                    {category}
                  </Label>
                </div>
              );
            })}
          </div>
        </div>

        {/* Authentication Type Filter */}
        <div className="mb-8">
          <h4 className="font-semibold mb-4 text-foreground text-base">
            Auth Type
          </h4>
          <div className="space-y-3">
            {availableAuthTypes.map((authType) => (
              <div key={authType} className="flex items-center space-x-3 group">
                <Checkbox
                  id={`auth-${authType}`}
                  checked={filters.authTypes?.includes(authType) || false}
                  onCheckedChange={(checkedState) =>
                    handleAuthTypeChange(authType, !!checkedState)
                  }
                  className="border-2 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <Label
                  htmlFor={`auth-${authType}`}
                  className="font-medium text-foreground group-hover:text-primary transition-colors cursor-pointer">
                  {authType}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Boolean Filters */}
        <div>
          <h4 className="font-semibold mb-4 text-foreground text-base">
            Features
          </h4>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 group">
              <Checkbox
                id="dynamicClientReg"
                checked={!!filters.dynamicClientRegistration}
                onCheckedChange={(checkedState) =>
                  handleBooleanFilterChange(
                    'dynamicClientRegistration',
                    !!checkedState,
                  )
                }
                className="border-2 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <Label
                htmlFor="dynamicClientReg"
                className="font-medium text-foreground group-hover:text-primary transition-colors cursor-pointer">
                Dynamic Client Registration
              </Label>
            </div>
            <div className="flex items-center space-x-3 group">
              <Checkbox
                id="isOfficial"
                checked={!!filters.isOfficial}
                onCheckedChange={(checkedState) =>
                  handleBooleanFilterChange('isOfficial', !!checkedState)
                }
                className="border-2 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <Label
                htmlFor="isOfficial"
                className="font-medium text-foreground group-hover:text-primary transition-colors cursor-pointer">
                Official Server
              </Label>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
