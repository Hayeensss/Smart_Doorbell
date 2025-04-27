import EventList from "@/components/history/event-list"
import EventFilters from "@/components/history/event-filters"
import { Separator } from "@/components/ui/separator"
import { Card } from "@/components/ui/card"

export default function HistoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Event History</h1>
        <p className="text-muted-foreground">View past events and recordings from your devices</p>
      </div>

      <Separator />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div>
          <Card className="sticky top-20">
            <EventFilters />
          </Card>
        </div>
        <div className="lg:col-span-3">
          <EventList />
        </div>
      </div>
    </div>
  )
}
