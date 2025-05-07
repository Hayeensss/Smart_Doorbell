"use client";

import { useState, useEffect, useCallback } from 'react';
import EventFilters from "@/components/history/event-filters";
import EventDisplayArea from "@/components/history/event-display-area";
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function HistoryView({ 
  initialEvents, 
  serverSideInitialFilters, 
  currentPage, 
  itemsPerPage, 
  totalCount, 
  availableEventTypes
}) {
  const [filters, setFilters] = useState(serverSideInitialFilters);
  const [events, setEvents] = useState(initialEvents || []);
  const [isLoading, setIsLoading] = useState(!initialEvents);

  const router = useRouter();
  const pathname = usePathname();
  const currentSearchParams = useSearchParams();

  useEffect(() => {
    setEvents(initialEvents || []);
    setIsLoading(false);
  }, [initialEvents]);

  useEffect(() => {
    setFilters(serverSideInitialFilters);
  }, [serverSideInitialFilters]);

  const handlePageChange = useCallback((newPage) => {
    const newParams = new URLSearchParams(currentSearchParams.toString());
    newParams.set('page', newPage.toString());
    router.push(`${pathname}?${newParams.toString()}`);
  }, [router, pathname, currentSearchParams]);

  const handleApplyFilters = useCallback((appliedFilters) => {
    const newParams = new URLSearchParams(currentSearchParams.toString());
    let dateParam = appliedFilters.date;
    if (dateParam instanceof Date) {
      dateParam = dateParam.toISOString().split('T')[0];
    }
    newParams.set('date', dateParam);
    newParams.set('timeRange', appliedFilters.timeRange);
    newParams.set('eventTypes', JSON.stringify(appliedFilters.eventTypes));
    newParams.set('page', '1');
    router.push(`${pathname}?${newParams.toString()}`);
  }, [router, pathname, currentSearchParams]);

  const handleFiltersChange = (newFilterValues) => {
    setFilters(prevFilters => ({ ...prevFilters, ...newFilterValues }));
  };

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div>
        <EventFilters 
          currentFilters={filters}
          onFiltersChange={handleFiltersChange}
          onApplyFilters={handleApplyFilters}
          availableEventTypes={availableEventTypes}
        />
      </div>
      <div className="lg:col-span-3 space-y-4">
        <EventDisplayArea 
          isLoading={isLoading} 
          events={events}
        />
        {totalCount > 0 && totalPages > 1 && (
          <div className="flex items-center justify-center space-x-2 py-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous page</span>
            </Button>
            <span className="text-sm font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next page</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
} 