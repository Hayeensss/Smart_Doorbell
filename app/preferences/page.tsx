import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import UserSettings from "@/components/preferences/user-settings"
import NotificationSettings from "@/components/preferences/notification-settings"

export default function PreferencesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Preferences</h1>
        <p className="text-muted-foreground">Manage your account and device settings</p>
      </div>

      <Separator />

      <Tabs defaultValue="user" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="user">User Settings</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        <TabsContent value="user">
          <UserSettings />
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationSettings />
        </TabsContent>
      </Tabs>
    </div>
  )
}
