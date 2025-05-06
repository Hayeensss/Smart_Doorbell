"use client"

import { useState, useEffect } from "react"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

export default function EventFilters({ currentFilters, onFiltersChange, onApplyFilters }) {
  // Local state to manage intermediate changes before applying
  const [localDate, setLocalDate] = useState(currentFilters.date);
  const [localTimeRange, setLocalTimeRange] = useState(currentFilters.timeRange);
  const [localEventTypes, setLocalEventTypes] = useState(currentFilters.eventTypes);

  // Effect to update local state if props change from parent (e.g., reset button or initial load)
  useEffect(() => {
    setLocalDate(currentFilters.date);
    setLocalTimeRange(currentFilters.timeRange);
    setLocalEventTypes(currentFilters.eventTypes);
  }, [currentFilters]);

  const handleDateChange = (newDate) => {
    setLocalDate(newDate);
    // Optionally call onFiltersChange immediately if you want live updates for date
    // onFiltersChange({ date: newDate }); 
  };

  const handleTimeRangeChange = (newTimeRange) => {
    setLocalTimeRange(newTimeRange);
  };

  const handleEventTypeChange = (type) => {
    setLocalEventTypes(prev => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  const handleApplyClick = () => {
    onApplyFilters({
      date: localDate,
      timeRange: localTimeRange,
      eventTypes: localEventTypes,
    });
  };

  return (
    <>
      <CardHeader>
        <CardTitle>Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn("w-full justify-start text-left font-normal", !localDate && "text-muted-foreground")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {localDate ? format(localDate, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={localDate} onSelect={handleDateChange} initialFocus />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label>Time Range</Label>
          <RadioGroup value={localTimeRange} onValueChange={handleTimeRangeChange}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="24h" id="filter-24h" />
              <Label htmlFor="filter-24h">Last 24 hours</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="7d" id="filter-7d" />
              <Label htmlFor="filter-7d">Last 7 days</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="30d" id="filter-30d" />
              <Label htmlFor="filter-30d">Last 30 days</Label>
            </div>
            {/* <div className="flex items-center space-x-2">
              <RadioGroupItem value="custom" id="filter-custom" />
              <Label htmlFor="filter-custom">Custom range</Label>
            </div> */}
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label>Event Types</Label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="filter-motion"
                checked={localEventTypes.motion}
                onCheckedChange={() => handleEventTypeChange("motion")}
              />
              <Label htmlFor="filter-motion">Motion</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="filter-ring" 
                checked={localEventTypes.ring} 
                onCheckedChange={() => handleEventTypeChange("ring")} 
              />
              <Label htmlFor="filter-ring">Ring</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="filter-person"
                checked={localEventTypes.person}
                onCheckedChange={() => handleEventTypeChange("person")}
              />
              <Label htmlFor="filter-person">Person</Label>
            </div>
          </div>
        </div>

        <Button className="w-full" onClick={handleApplyClick}>Apply Filters</Button>
      </CardContent>
    </>
  )
} 