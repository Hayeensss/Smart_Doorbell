import ModeUsageChart from "@/components/analytics/mode-usage-chart"
import MotionChart from "@/components/analytics/motion-chart"
import RingFrequencyChart from "@/components/analytics/ring-frequency-chart"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">View insights and trends from your smart home system</p>
      </div>

      <Separator />

      <Tabs defaultValue="daily" className="w-full">
        <TabsList>
          <TabsTrigger value="daily">Daily</TabsTrigger>
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
        </TabsList>
        <TabsContent value="daily" className="space-y-6 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Mode Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <ModeUsageChart period="daily" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Motion Detection</CardTitle>
              </CardHeader>
              <CardContent>
                <MotionChart period="daily" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Ring Frequency</CardTitle>
              </CardHeader>
              <CardContent>
                <RingFrequencyChart period="daily" />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="weekly" className="space-y-6 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Mode Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <ModeUsageChart period="weekly" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Motion Detection</CardTitle>
              </CardHeader>
              <CardContent>
                <MotionChart period="weekly" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Ring Frequency</CardTitle>
              </CardHeader>
              <CardContent>
                <RingFrequencyChart period="weekly" />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="monthly" className="space-y-6 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Mode Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <ModeUsageChart period="monthly" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Motion Detection</CardTitle>
              </CardHeader>
              <CardContent>
                <MotionChart period="monthly" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Ring Frequency</CardTitle>
              </CardHeader>
              <CardContent>
                <RingFrequencyChart period="monthly" />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
