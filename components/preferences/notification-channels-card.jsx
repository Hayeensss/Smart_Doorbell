"use client"

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function NotificationChannelsCard({
  pushEnabled,
  setPushEnabled,
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Channels</CardTitle>
        <CardDescription>Choose how you want to receive notifications</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="push-notifications">Push Notifications</Label>
            <p className="text-sm text-muted-foreground">Receive notifications on your mobile device</p>
          </div>
          <Switch id="push-notifications" checked={pushEnabled} onCheckedChange={setPushEnabled} />
        </div>
        <Separator /> 
      </CardContent>
    </Card>
  );
} 