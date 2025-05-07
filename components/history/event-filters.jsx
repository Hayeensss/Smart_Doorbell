"use client"

import { useState, useEffect, useCallback } from "react"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import DateFilter from "./filter-sections/date-filter";
import TimeRangeFilter from "./filter-sections/time-range-filter";
import EventTypesFilter from "./filter-sections/event-types-filter";

export default function EventFilters({ currentFilters, onApplyFilters, availableEventTypes = [] }) {
  const [localDate, setLocalDate] = useState(currentFilters.date ? new Date(currentFilters.date) : new Date());
  const [localTimeRange, setLocalTimeRange] = useState(currentFilters.timeRange);
  const [localEventTypes, setLocalEventTypes] = useState(() => {
    const initialTypes = {};
    availableEventTypes.forEach(type => {
      initialTypes[type] = currentFilters.eventTypes?.[type] === true;
    });
    return initialTypes;
  });

  useEffect(() => {
    setLocalDate(currentFilters.date ? new Date(currentFilters.date) : new Date());
    setLocalTimeRange(currentFilters.timeRange);
    const updatedTypes = {};
    availableEventTypes.forEach(type => {
      updatedTypes[type] = currentFilters.eventTypes?.[type] === true;
    });
    setLocalEventTypes(updatedTypes);
  }, [currentFilters, availableEventTypes]);

  const handleDateChange = useCallback((newDate) => {
    setLocalDate(newDate);
  }, []);

  const handleTimeRangeChange = useCallback((newTimeRange) => {
    setLocalTimeRange(newTimeRange);
  }, []);

  const handleEventTypeChange = useCallback((type) => {
    setLocalEventTypes(prev => ({
      ...prev,
      [type]: !prev[type],
    }));
  }, []);

  const handleApplyClick = useCallback(() => {
    onApplyFilters({
      date: localDate,
      timeRange: localTimeRange,
      eventTypes: localEventTypes,
    });
  }, [localDate, localTimeRange, localEventTypes, onApplyFilters]);

  return (
    <>
      <CardHeader>
        <CardTitle>Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <DateFilter localDate={localDate} onDateChange={handleDateChange} />
        <TimeRangeFilter localTimeRange={localTimeRange} onTimeRangeChange={handleTimeRangeChange} />
        <EventTypesFilter 
          localEventTypes={localEventTypes} 
          availableEventTypes={availableEventTypes} 
          onEventTypeChange={handleEventTypeChange} 
        />
        <Button className="w-full" onClick={handleApplyClick}>Apply Filters</Button>
      </CardContent>
    </>
  )
} 