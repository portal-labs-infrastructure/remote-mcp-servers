'use client';

import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  totalItems: number;
}

export default function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  totalItems,
}: PaginationControlsProps) {
  if (totalPages <= 1) return null;

  const handlePageChange = (newPage: number) => {
    // 1. Call the parent component's state update function
    onPageChange(newPage);

    // 2. Scroll the window to the top with a smooth animation
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex items-center justify-between mt-12 py-6 border-t border-border/30 flex-wrap gap-4">
      <div>
        <p className="text-sm text-muted-foreground font-medium">
          Showing{' '}
          <span className="text-foreground font-semibold">{startItem}</span> to{' '}
          <span className="text-foreground font-semibold">{endItem}</span> of{' '}
          <span className="text-foreground font-semibold">{totalItems}</span>{' '}
          results
        </p>
      </div>
      <div className="flex items-center space-x-3">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className="transition-all duration-200 hover:scale-105 disabled:hover:scale-100">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </Button>
        <div className="flex items-center space-x-2">
          <span className="text-sm px-3 py-1 bg-muted/50 rounded-lg font-medium">
            Page {currentPage} of {totalPages}
          </span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="transition-all duration-200 hover:scale-105 disabled:hover:scale-100">
          Next
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
