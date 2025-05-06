import NotificationSettings from "@/components/preferences/notification-settings";
import UserSettings from "@/components/preferences/user-settings";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getUserPreferences } from "@/db/db";
import { auth } from "@clerk/nextjs/server";

export default async function PreferencesPage() {
  let userPreferences = null;
  let preferencesError = null;

  const { userId } = auth();

  if (!userId) {
    console.error("PreferencesPage: User not authenticated on server.");
    preferencesError = "User not authenticated. Please sign in.";
  } else {
    try {
      userPreferences = await getUserPreferences(userId);
    } catch (error) {
      console.error("PreferencesPage: Exception while fetching preferences on server:", error);
      preferencesError = "An unexpected error occurred while loading settings.";
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Preferences</h1>
        <p className="text-muted-foreground">
          Manage your account and device settings
        </p>
      </div>

      <Separator />

      <Tabs defaultValue="user" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="user">User Settings</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        <TabsContent value="user">
          <UserSettings initialPreferences={userPreferences} preferencesError={preferencesError} />
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}
