"use client";

import { useState, useEffect, useCallback } from 'react';
import EventFilters from "@/components/history/event-filters";
import EventList from "@/components/history/event-list";

const initialFiltersState = {
  date: new Date(),
  timeRange: "24h",
  eventTypes: {
    motion: true,
    ring: true,
    person: true,
  },
};

export default function HistoryView({ initialEvents, initialError }) {
  const [filters, setFilters] = useState(initialFiltersState);
  const [events, setEvents] = useState(initialEvents || []);
  const [isLoading, setIsLoading] = useState(!initialEvents && !initialError);
  const [error, setError] = useState(initialError || null);

  const fetchEvents = useCallback(async (currentFilters) => {
    setIsLoading(true);
    setError(null); // Clear previous client-side errors before a new fetch

    const queryParams = new URLSearchParams({
      limit: 10,
      date: currentFilters.date instanceof Date ? currentFilters.date.toISOString() : new Date(currentFilters.date).toISOString(),
      timeRange: currentFilters.timeRange,
      eventTypes: JSON.stringify(currentFilters.eventTypes),
    });

    try {
      const response = await fetch(`/api/events?${queryParams.toString()}`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({})); // Attempt to get error details
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      const fetchedEvents = await response.json();
      setEvents(fetchedEvents);
    } catch (err) {
      console.error("Error fetching events in HistoryView:", err);
      setError(err.message || "An unknown error occurred while fetching events.");
      setEvents([]); // Clear events on error
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Only fetch if there were no initial events and no initial error,
    // implying data wasn't successfully loaded server-side.
    // Or, if filters change client-side after initial load.
    const hasInitialData = initialEvents && initialEvents.length > 0;
    const hasInitialError = !!initialError;

    if ((!hasInitialData && !hasInitialError) || (hasInitialData && JSON.stringify(filters) !== JSON.stringify(initialFiltersState))) {
      // If initial data was present but filters changed, fetch new data.
      // If no initial data and no error, it means we need to fetch for the first time on client.
      fetchEvents(filters);
    }
  }, [filters, fetchEvents, initialEvents, initialError]); // Added initialEvents and initialError to deps

  const handleFiltersChange = (newFilterValues) => {
    setFilters(prevFilters => ({ ...prevFilters, ...newFilterValues }));
  };

  const handleApplyFilters = (appliedFilters) => {
    setFilters(appliedFilters);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div>
        <EventFilters 
          currentFilters={filters} 
          onFiltersChange={handleFiltersChange} 
          onApplyFilters={handleApplyFilters} 
        />
      </div>
      <div className="lg:col-span-3">
        {isLoading && <p>Loading events...</p>}
        {/* Display initialError passed from server if no client-side error has occurred yet */}
        {/* And ensure we are not loading client-side */}
        {!isLoading && error && <EventList events={[]} error={error} />}
        {!isLoading && !error && <EventList events={events} error={null} />}
      </div>
    </div>
  );
} 