"use client"

import { useState } from "react"
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

export default function EventFilters() {
  const [date, setDate] = useState(new Date())
  const [timeRange, setTimeRange] = useState("24h")
  const [eventTypes, setEventTypes] = useState({
    motion: true,
    ring: true,
    person: true,
  })

  const handleEventTypeChange = (type) => {
    setEventTypes({
      ...eventTypes,
      [type]: !eventTypes[type],
    })
  }

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
                className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label>Time Range</Label>
          <RadioGroup value={timeRange} onValueChange={setTimeRange}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="24h" id="24h" />
              <Label htmlFor="24h">Last 24 hours</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="7d" id="7d" />
              <Label htmlFor="7d">Last 7 days</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="30d" id="30d" />
              <Label htmlFor="30d">Last 30 days</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="custom" id="custom" />
              <Label htmlFor="custom">Custom range</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label>Event Types</Label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="motion"
                checked={eventTypes.motion}
                onCheckedChange={() => handleEventTypeChange("motion")}
              />
              <Label htmlFor="motion">Motion</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="ring" checked={eventTypes.ring} onCheckedChange={() => handleEventTypeChange("ring")} />
              <Label htmlFor="ring">Ring</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="person"
                checked={eventTypes.person}
                onCheckedChange={() => handleEventTypeChange("person")}
              />
              <Label htmlFor="person">Person</Label>
            </div>
          </div>
        </div>

        <Button className="w-full">Apply Filters</Button>
      </CardContent>
    </>
  )
}
