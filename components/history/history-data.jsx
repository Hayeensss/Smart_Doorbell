import HistoryView from "@/components/history/history-view";
import { getRecentEventsWithDeviceNames, getEventsCount } from '@/db/db';
import { Button } from "@/components/ui/button";

const ITEMS_PER_PAGE = 10;

export default async function HistoryData({ 
  userId,
  currentPage, 
  dbQueryFilters, 
  uiInitializationFilters, 
  availableEventTypes
}) {
    const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  
    const [events, totalCount] = await Promise.all([
      getRecentEventsWithDeviceNames(userId, ITEMS_PER_PAGE, offset, dbQueryFilters),
      getEventsCount(dbQueryFilters)
    ]);
  
    return (
      <HistoryView 
        initialEvents={events} 
        serverSideInitialFilters={uiInitializationFilters} 
        currentPage={currentPage}
        itemsPerPage={ITEMS_PER_PAGE}
        totalCount={totalCount}
        availableEventTypes={availableEventTypes}
      />
    );
  }
