import NotificationSettings from "@/components/preferences/notification-settings";
import UserSettings from "@/components/preferences/user-settings";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getUserPreferences } from "@/db/db";
import { auth } from "@clerk/nextjs/server";
import PreferencesHeader from "@/components/preferences/preferences-header";

export const metadata = {
  title: 'Preferences',
  description: 'Configure your preferences for the smart doorbell',
};

export default async function PreferencesPage() {
  const { userId } = await auth();
  const userPreferences = await getUserPreferences(userId);

  return (
    <div className="space-y-6">
      <PreferencesHeader />

      <Separator />

      <Tabs defaultValue="user" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="user">User Settings</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        <TabsContent value="user">
          <UserSettings initialPreferences={userPreferences} />
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}
