"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { Download, Play } from "lucide-react";
import React, { useState } from "react";

// Define the interface for an event (copied from event-list.tsx for clarity)
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

interface EventItemCardProps {
  event: MockEvent;
  getEventIcon: (deviceName: string) => React.ReactNode;
  getEventBadge: (eventType: string) => React.ReactNode;
}

export default function EventItemCard({
  event,
  getEventIcon,
  getEventBadge,
}: EventItemCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card key={event.id} className="overflow-hidden">
      <CardContent className="p-0">
        <div className="flex flex-col sm:flex-row">
          {event.thumbnail && (
            <div className="relative sm:w-48 h-32">
              <img
                src={event.thumbnail || "/placeholder.svg"}
                alt={`Event from ${event.deviceName}`}
                className="w-full h-full object-cover"
              />
              {event.hasRecording && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="gap-1"
                    onClick={() =>
                      console.log(
                        "Play recording for event:",
                        event.id,
                        event.recordingUrl
                      )
                    }
                  >
                    <Play className="h-4 w-4" />
                    Play
                  </Button>
                </div>
              )}
            </div>
          )}

          <div
            className={`p-4 flex-1 ${!event.thumbnail ? "pl-4" : "sm:pl-4"}`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  {getEventIcon(event.deviceName)}
                  <span className="font-medium">{event.deviceName}</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  {getEventBadge(event.eventType)}
                  <span className="text-sm text-muted-foreground">
                    {event.timestamp instanceof Date &&
                    !isNaN(event.timestamp.valueOf())
                      ? format(event.timestamp, "h:mm a")
                      : "Invalid time"}
                  </span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? "Hide Details" : "View Details"}
              </Button>
            </div>

            {isExpanded && (
              <div className="mt-4 pt-4 border-t text-sm">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <div className="text-muted-foreground">Device</div>
                    <div>{event.deviceName}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Event Type</div>
                    <div className="capitalize">{event.eventType}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Date</div>
                    <div>
                      {event.timestamp instanceof Date &&
                      !isNaN(event.timestamp.valueOf())
                        ? format(event.timestamp, "MMM d, yyyy")
                        : "Invalid date"}
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Time</div>
                    <div>
                      {event.timestamp instanceof Date &&
                      !isNaN(event.timestamp.valueOf())
                        ? format(event.timestamp, "h:mm:ss a")
                        : "Invalid time"}
                    </div>
                  </div>
                </div>

                {event.hasRecording && (
                  <div className="mt-4 flex gap-2">
                    <Button
                      size="sm"
                      className="gap-1"
                      onClick={() =>
                        console.log(
                          "Play recording for event:",
                          event.id,
                          event.recordingUrl
                        )
                      }
                    >
                      <Play className="h-4 w-4" />
                      Play Recording
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1"
                      onClick={() =>
                        console.log(
                          "Download recording for event:",
                          event.id,
                          event.recordingUrl
                        )
                      }
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
