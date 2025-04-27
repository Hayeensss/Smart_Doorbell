"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function UserSettings() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [soundsEnabled, setSoundsEnabled] = useState(true)
  const [defaultMode, setDefaultMode] = useState("home")

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>Update your personal information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" defaultValue="John Doe" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue="john.doe@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" type="tel" defaultValue="+1 (555) 123-4567" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Select defaultValue="america-new_york">
                <SelectTrigger id="timezone">
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="america-new_york">America/New York</SelectItem>
                  <SelectItem value="america-los_angeles">America/Los Angeles</SelectItem>
                  <SelectItem value="america-chicago">America/Chicago</SelectItem>
                  <SelectItem value="europe-london">Europe/London</SelectItem>
                  <SelectItem value="asia-tokyo">Asia/Tokyo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button>Save Changes</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Default Settings</CardTitle>
          <CardDescription>Configure your default system settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="default-mode">Default Mode</Label>
            <Select value={defaultMode} onValueChange={setDefaultMode}>
              <SelectTrigger id="default-mode">
                <SelectValue placeholder="Select default mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="home">Home</SelectItem>
                <SelectItem value="away">Away</SelectItem>
                <SelectItem value="dnd">Do Not Disturb</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">This mode will be activated when the system starts up</p>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="notifications">Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive notifications for important events</p>
              </div>
              <Switch id="notifications" checked={notificationsEnabled} onCheckedChange={setNotificationsEnabled} />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="sounds">Sounds</Label>
                <p className="text-sm text-muted-foreground">Play sounds for alerts and notifications</p>
              </div>
              <Switch id="sounds" checked={soundsEnabled} onCheckedChange={setSoundsEnabled} />
            </div>
          </div>

          <Button>Save Preferences</Button>
        </CardContent>
      </Card>
    </div>
  )
}
