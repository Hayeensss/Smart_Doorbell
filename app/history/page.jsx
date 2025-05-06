import { Separator } from "@/components/ui/separator";
import HistoryView from "@/components/history/history-view";
import { getInitialEvents } from '@/lib/event-service';

export const dynamic = 'force-dynamic';

// Define initial filters similar to those in HistoryView or make them configurable
const initialServerFilters = {
  date: new Date(),
  timeRange: "24h",
  eventTypes: {
    motion: true,
    ring: true,
    person: true,
  },
  limit: 10, // Match the limit used in HistoryView or make it consistent
};

export default async function HistoryPage() {
  let initialEvents = [];
  let initialError = null;

  try {
    initialEvents = await getInitialEvents(initialServerFilters);
  } catch (error) {
    console.error("HistoryPage: Failed to fetch initial events on server:", error);
    // You might want to cast the error to a string or a serializable object
    // if you intend to pass the full error object through props,
    // but for simplicity, we'll pass a message.
    initialError = error.message || "Failed to load initial events. Please try again later.";
    // Depending on the error, you might want to render a dedicated error UI
    // or allow HistoryView to display this error.
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Event History</h1>
        <p className="text-muted-foreground">
          View past events and recordings from your devices
        </p>
      </div>

      <Separator />

      <HistoryView initialEvents={initialEvents} initialError={initialError} />
    </div>
  );
}
