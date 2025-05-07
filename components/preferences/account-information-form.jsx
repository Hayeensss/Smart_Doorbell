"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AccountInformationForm({
  name,
  email,
  deviceId,
  setDeviceId,
  timezone,
  setTimezone,
  handleAccountInfoSaveChanges,
  isSavingAccountInfo,
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Information</CardTitle>
        <CardDescription>View your account details and set default device/region.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              aria-label="Full name"
              disabled
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              aria-label="Email address"
              disabled
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="device-id">Default Device ID</Label>
            <Input
              id="device-id"
              type="text"
              value={deviceId}
              onChange={(e) => setDeviceId(e.target.value)}
              placeholder="Enter your default device ID"
              aria-label="Default Device ID"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="timezone">Timezone</Label>
            <Select value={timezone} onValueChange={setTimezone} aria-label="Timezone">
              <SelectTrigger id="timezone">
                <SelectValue placeholder="Select timezone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Australia/Sydney">Australia/Sydney (AEST/AEDT)</SelectItem>
                <SelectItem value="Australia/Melbourne">Australia/Melbourne (AEST/AEDT)</SelectItem>
                <SelectItem value="Australia/Brisbane">Australia/Brisbane (AEST)</SelectItem>
                <SelectItem value="Australia/Perth">Australia/Perth (AWST)</SelectItem>
                <SelectItem value="Australia/Adelaide">Australia/Adelaide (ACST/ACDT)</SelectItem>
                <SelectItem value="Australia/Darwin">Australia/Darwin (ACST)</SelectItem>
                <SelectItem value="Australia/Hobart">Australia/Hobart (AEST/AEDT)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button onClick={handleAccountInfoSaveChanges} disabled={isSavingAccountInfo}>
          {isSavingAccountInfo ? "Saving..." : "Save Settings"}
        </Button>
      </CardContent>
    </Card>
  );
} 