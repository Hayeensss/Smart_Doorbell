import { Suspense } from 'react';
import { Separator } from "@/components/ui/separator";
import PageHeader from "@/components/history/page-header";
import HistoryData from "@/components/history/history-data";
import HistorySkeleton from "@/components/history/history-skeleton";
import { getDistinctEventTypes } from "@/db/db";
import { parseFiltersFromParams } from "@/lib/history-service";
import { currentUser } from '@clerk/nextjs/server';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'History',
  description: 'View past events and recordings from your devices',
};

export default async function HistoryPage({ searchParams: incomingSearchParams }) {
  const searchParams = await incomingSearchParams;
  const user = await currentUser();

  if (!user || !user.id) {
    // Handle case where user is not logged in or user.id is not available
    // Depending on your app's logic, you might redirect, show an error, or return null
    // For now, let's assume we might want to show a message or redirect.
    // This part might need adjustment based on how you want to handle unauthorized access.
    console.error("User not found or user ID is missing.");
    // Potentially return a component indicating an error or redirect
    return <div>Error: User not authenticated. Please sign in.</div>; 
  }
  const userId = user.id;

  const availableEventTypes = await getDistinctEventTypes();

  const { date, timeRange, eventTypes, page: pageParam } = searchParams;

  const tempSearchParams = {
    date,
    timeRange,
    eventTypes
  };

  const { dbQueryFilters, uiInitializationFilters } = parseFiltersFromParams(tempSearchParams, availableEventTypes);

  const currentPage = parseInt(pageParam || '1', 10);
  const validPage = Math.max(1, isNaN(currentPage) ? 1 : currentPage);

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Event History" 
        description="View past events and recordings from your devices" 
      />
      <Separator />
      <Suspense fallback={<HistorySkeleton />}> 
        <HistoryData 
          userId={userId}
          currentPage={validPage} 
          dbQueryFilters={dbQueryFilters} 
          uiInitializationFilters={uiInitializationFilters} 
          availableEventTypes={availableEventTypes} 
        />
      </Suspense>
    </div>
  );
}
