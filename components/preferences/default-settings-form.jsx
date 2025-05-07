"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function DefaultSettingsForm({
  notificationsEnabled,
  setNotificationsEnabled,
  soundsEnabled,
  setSoundsEnabled,
  handleSavePreferences,
  isSavingPreferences,
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Default Settings</CardTitle>
        <CardDescription>
          Configure your default notification and sound settings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="notifications">Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive notifications for important events
              </p>
            </div>
            <Switch
              id="notifications"
              checked={notificationsEnabled}
              onCheckedChange={setNotificationsEnabled}
              aria-label="Enable notifications"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="sounds">Sounds</Label>
              <p className="text-sm text-muted-foreground">
                Play sounds for alerts and notifications
              </p>
            </div>
            <Switch 
              id="sounds" 
              checked={soundsEnabled} 
              onCheckedChange={setSoundsEnabled} 
              aria-label="Enable sounds"
            />
          </div>
        </div>

        <Button onClick={handleSavePreferences} disabled={isSavingPreferences}>
          {isSavingPreferences ? "Saving..." : "Save Preferences"}
        </Button>
      </CardContent>
    </Card>
  );
} 