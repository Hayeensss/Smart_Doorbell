import ModeSelector from "@/components/dashboard/mode-selector";
import QuickActions from "@/components/dashboard/quick-actions";
import AudioControls from "@/components/live/audio-controls";
import LiveStream from "@/components/live/live-stream";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor and control your connected devices
          </p>
        </div>
        <ModeSelector />
      </div>

      <Separator />

      <QuickActions />

      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Live View</h1>
          <p className="text-muted-foreground">
            Watch real-time video from your devices
          </p>
        </div>

        <Separator />

        <div className="flex justify-center items-center">
          <div className="w-full max-w-4xl">
            <Card>
              <CardContent className="p-0 overflow-hidden rounded-lg">
                <LiveStream />
              </CardContent>
            </Card>
            <div className="mt-4">
              <AudioControls />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
