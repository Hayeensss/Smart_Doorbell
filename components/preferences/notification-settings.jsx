"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"

export default function NotificationSettings() {
  const [pushEnabled, setPushEnabled] = useState(true)
  const [emailEnabled, setEmailEnabled] = useState(true)
  const [smsEnabled, setSmsEnabled] = useState(false)

  return (
    <div className="space-y-6">
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

      <Card>
        <CardHeader>
          <CardTitle>Notification Types</CardTitle>
          <CardDescription>Select which events trigger notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-start space-x-2">
              <Checkbox id="motion-events" defaultChecked />
              <div className="grid gap-1.5 leading-none">
                <Label htmlFor="motion-events">Motion Events</Label>
                <p className="text-sm text-muted-foreground">Notify when motion is detected by cameras or sensors</p>
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox id="doorbell-events" defaultChecked />
              <div className="grid gap-1.5 leading-none">
                <Label htmlFor="doorbell-events">Doorbell Events</Label>
                <p className="text-sm text-muted-foreground">Notify when someone rings your doorbell</p>
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox id="person-events" defaultChecked />
              <div className="grid gap-1.5 leading-none">
                <Label htmlFor="person-events">Person Detection</Label>
                <p className="text-sm text-muted-foreground">Notify when a person is detected by cameras</p>
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox id="device-events" defaultChecked />
              <div className="grid gap-1.5 leading-none">
                <Label htmlFor="device-events">Device Status</Label>
                <p className="text-sm text-muted-foreground">
                  Notify about device status changes (offline, low battery)
                </p>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="quiet-hours">Quiet Hours</Label>
            <Select defaultValue="none">
              <SelectTrigger id="quiet-hours">
                <SelectValue placeholder="Select quiet hours" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="night">Night (10 PM - 7 AM)</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">Silence non-critical notifications during these hours</p>
          </div>

          <Button>Save Notification Settings</Button>
        </CardContent>
      </Card>
    </div>
  )
} 