"use client";

import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { AlertCircle, Calendar } from "lucide-react";
import React from "react";
import EventItemCard from "./EventItemCard"; // Corrected import

// Define the interface for an event (consistent with EventItemCard.tsx)
interface MockEvent {
  id: number | string;
  deviceId: string;
  deviceName: string;
  eventType: string;
  timestamp: Date;
  hasRecording: boolean;
  thumbnail: string | null;
  recordingUrl?: string | null;
}

interface EventDisplayProps {
  events: MockEvent[];
  error: string | null;
  getEventIcon: (deviceName: string) => React.ReactNode;
  getEventBadge: (eventType: string) => React.ReactNode;
  onTryAgain: () => void; // For the try again button
}

export default function EventDisplay({
  events,
  error,
  getEventIcon,
  getEventBadge,
  onTryAgain,
}: EventDisplayProps) {
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
        <AlertCircle className="h-10 w-10 text-destructive mb-2" />
        <p className="text-lg font-medium text-destructive">
          Failed to load events
        </p>
        <p className="text-sm text-muted-foreground mb-4">{error}</p>
        {/*
          The form for revalidation needs to be handled carefully.
          A simple onClick handler calling a server action passed as prop or via revalidatePath
          is more typical in client components if revalidation is initiated from client.
          For now, using the passed onTryAgain function.
        */}
        <Button onClick={onTryAgain}>Try Again</Button>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        No events recorded yet.
      </div>
    );
  }

  const eventsByDate = events.reduce((acc, event) => {
    const dateKey =
      event.timestamp instanceof Date && !isNaN(event.timestamp.valueOf())
        ? format(event.timestamp, "yyyy-MM-dd")
        : "unknown-date";
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(event);
    return acc;
  }, {} as Record<string, MockEvent[]>);

  return (
    <div className="space-y-6">
      {Object.entries(eventsByDate).map(([dateKey, dateEvents]) => (
        <div key={dateKey} className="space-y-2">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <h3 className="font-medium">
              {dateKey === "unknown-date"
                ? "Unknown Date"
                : format(new Date(dateKey), "EEEE, MMMM d, yyyy")}
            </h3>
          </div>
          <div className="space-y-2">
            {dateEvents.map((event) => (
              <EventItemCard
                key={event.id}
                event={event}
                getEventIcon={getEventIcon}
                getEventBadge={getEventBadge}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
