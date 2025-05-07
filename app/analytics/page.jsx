import AnalyticsHeader from "@/components/analytics/AnalyticsHeader";
import AnalyticsTabContent from "@/components/analytics/AnalyticsTabContent";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const metadata = {
  title: 'Analytics',
  description: 'View analytics and trends from your smart home system',
};

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <AnalyticsHeader />
      <Separator />
      <Tabs defaultValue="daily" className="w-full">
        <TabsList>
          <TabsTrigger value="daily">Daily</TabsTrigger>
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
        </TabsList>
        <TabsContent value="daily" className="space-y-6 pt-4">
          <AnalyticsTabContent period="daily" />
        </TabsContent>
        <TabsContent value="weekly" className="space-y-6 pt-4">
          <AnalyticsTabContent period="weekly" />
        </TabsContent>
        <TabsContent value="monthly" className="space-y-6 pt-4">
          <AnalyticsTabContent period="monthly" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
