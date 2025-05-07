import ModeUsageChart from "@/components/analytics/mode-usage-chart";
import MotionChart from "@/components/analytics/motion-chart";
import RingFrequencyChart from "@/components/analytics/ring-frequency-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AnalyticsTabContent({ period }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Mode Usage</CardTitle>
        </CardHeader>
        <CardContent>
          <ModeUsageChart period={period} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Motion Detection</CardTitle>
        </CardHeader>
        <CardContent>
          <MotionChart period={period} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Ring Frequency</CardTitle>
        </CardHeader>
        <CardContent>
          <RingFrequencyChart period={period} />
        </CardContent>
      </Card>
    </div>
  );
} 