"use client";

import EventList from "@/components/history/event-list";
import { Skeleton } from "@/components/ui/skeleton";

export default function EventDisplayArea({ isLoading, events }) {
  if (isLoading) {
    return (
      Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="p-4 border rounded-lg shadow space-y-3">
          <div className="flex items-center space-x-3">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="space-y-1 flex-grow">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
          <Skeleton className="h-4 w-1/4 ml-auto" />
        </div>
      ))
    );
  }

  return <EventList events={events} />;
} 