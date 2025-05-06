// "use client"; removed

import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Bell, Camera, Radio } from "lucide-react";
import { revalidatePath } from "next/cache";

import { db } from "@/db";
import { events as eventsTable } from "@/db/schema"; // devices might not be used in the simplified query
import EventDisplay from "./EventDisplay"; // Import the new client component

// MockEvent interface removed

export default async function EventList() {
  let events = []; // Removed MockEvent[] type
  let error = null; // Removed string | null type

  try {
    // --- Simplified data fetching from database for debugging ---
    const rawDbData = await db
      .select({
        eventId: eventsTable.eventId,
        deviceId: eventsTable.deviceId,
        eventType: eventsTable.eventType,
        occurredAt: eventsTable.occurredAt,
        // deviceName: devices.name, // Temporarily removed for debugging
      })
      .from(eventsTable)
      // .leftJoin(devices, eq(eventsTable.deviceId, devices.deviceId)) // Temporarily removed for debugging
      // .orderBy(desc(eventsTable.occurredAt)) // Temporarily removed for debugging
      .limit(10);

    // Map rawDbData to event structure
    events = rawDbData.map((item) => ({
      id: item.eventId,
      deviceId: item.deviceId,
      deviceName: "Unknown Device (Debug)", // Placeholder as deviceName is not fetched
      eventType: item.eventType,
      timestamp: new Date(item.occurredAt),
      hasRecording: false,
      thumbnail: null,
    }));
  } catch (err) {
    console.error("Error fetching events from DB (simplified query):", err);
    if (err instanceof Error) {
      error = `Database error (simplified query): ${err.message}`;
    } else {
      error =
        "An unknown error occurred while fetching events (simplified query).";
    }
  }

  const getEventIcon = (deviceName) => {
    // Removed string type from deviceName
    const lowerName = deviceName.toLowerCase();
    if (lowerName.includes("camera")) return <Camera className="h-4 w-4" />;
    if (lowerName.includes("doorbell")) return <Bell className="h-4 w-4" />;
    if (lowerName.includes("sensor")) return <Radio className="h-4 w-4" />;
    return <Camera className="h-4 w-4" />;
  };

  const getEventBadge = (eventType) => {
    // Removed MockEvent["eventType"] type
    switch (eventType) {
      case "motion":
        return <Badge variant="secondary">Motion</Badge>;
      case "ring":
        return <Badge>Ring</Badge>;
      default:
        return <Badge variant="outline">Event</Badge>;
    }
  };

  const eventsByDate = events.reduce((acc, event) => {
    // Removed <Record<string, MockEvent[]>> type from reduce
    const dateKey =
      event.timestamp instanceof Date && !isNaN(event.timestamp.valueOf())
        ? format(event.timestamp, "yyyy-MM-dd")
        : "unknown-date";
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(event);
    return acc;
  }, {});

  async function handleTryAgain() {
    "use server";
    revalidatePath("/history");
  }

  return (
    <EventDisplay
      events={events}
      error={error}
      getEventIcon={getEventIcon}
      getEventBadge={getEventBadge}
      onTryAgain={handleTryAgain}
    />
  );
}
