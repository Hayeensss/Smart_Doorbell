"use client"

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function QuietHoursSelect() {
  const [quietHours, setQuietHours] = useState("none"); 

  return (
    <div className="space-y-2">
      <Label htmlFor="quiet-hours">Quiet Hours</Label>
      <Select value={quietHours} onValueChange={setQuietHours} aria-label="Quiet hours">
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
  );
} 