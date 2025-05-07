import LiveStream from "@/components/dashboard/live-stream";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function LiveViewSection() {
  return (
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
        </div>
      </div>
    </div>
  );
} 