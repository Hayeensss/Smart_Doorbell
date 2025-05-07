"use client"

import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import QuietHoursSelect from "./quiet-hours-select";

const NotificationTypeItem = ({ id, label, description, defaultChecked }) => {
  return (
    <div className="flex items-start space-x-2">
      <Checkbox id={id} defaultChecked={defaultChecked} />
      <div className="grid gap-1.5 leading-none">
        <Label htmlFor={id}>{label}</Label>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
    </div>
  );
};

export default function NotificationTypesCard() {

  const notificationEventTypes = [
    {
      id: "motion-events",
      label: "Motion Events",
      description: "Notify when motion is detected by cameras or sensors",
      defaultChecked: true,
    },
    {
      id: "doorbell-events",
      label: "Doorbell Events",
      description: "Notify when someone rings your doorbell",
      defaultChecked: true,
    },
    {
      id: "person-events",
      label: "Person Detection",
      description: "Notify when a person is detected by cameras",
      defaultChecked: true,
    },
    {
      id: "device-events",
      label: "Device Status",
      description: "Notify about device status changes (offline, low battery)",
      defaultChecked: true,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Types & Schedule</CardTitle>
        <CardDescription>Select which events trigger notifications and when</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          {notificationEventTypes.map((item) => (
            <NotificationTypeItem
              key={item.id}
              id={item.id}
              label={item.label}
              description={item.description}
              defaultChecked={item.defaultChecked}
            />
          ))}
        </div>
        <Separator />
        <QuietHoursSelect />
      </CardContent>
    </Card>
  );
} 