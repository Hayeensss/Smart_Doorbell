"use client"

import { useState } from "react"
import { Calendar } from "lucide-react"
import { format } from "date-fns"
import EventCard from "./event-card"

export default function EventList({ events }) {
  const [expandedEvent, setExpandedEvent] = useState(null)

  if (!events || events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
        <Calendar className="h-12 w-12 mb-4" />
        <h2 className="text-xl font-semibold">No events found</h2>
        <p>There are no events to display at this time.</p>
      </div>
    )
  }

  const eventsByDate = events.reduce((acc, event) => {
    let dateKey = "unknown-date"
    const timestampDate = new Date(event.timestamp)
    if (!isNaN(timestampDate)) {
      dateKey = format(timestampDate, "yyyy-MM-dd")
    }

    if (!acc[dateKey]) {
      acc[dateKey] = []
    }
    acc[dateKey].push(event)
    return acc
  }, {})

  return (
    <div className="space-y-6">
      {Object.entries(eventsByDate).map(([dateKey, dateEvents]) => (
        <div key={dateKey} className="space-y-2">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <h3 className="font-medium">
              {dateKey === "unknown-date" 
                ? "Events with Invalid Dates" 
                : format(new Date(dateKey), "EEEE, MMMM d, yyyy")}
            </h3>
          </div>

          <div className="space-y-2">
            {dateEvents.map((event) => (
              <EventCard 
                key={event.id} 
                event={event} 
                isExpanded={expandedEvent === event.id}
                onToggleExpand={() => setExpandedEvent(expandedEvent === event.id ? null : event.id)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
