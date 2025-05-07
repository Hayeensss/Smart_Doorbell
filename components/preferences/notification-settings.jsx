"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import NotificationChannelsCard from "./notification-channels-card"
import NotificationTypesCard from "./notification-types-card"
import { toast } from "@/hooks/use-toast"

export default function NotificationSettings() {
  const [pushEnabled, setPushEnabled] = useState(true)
  const [emailEnabled, setEmailEnabled] = useState(true)
  const [smsEnabled, setSmsEnabled] = useState(false)

  const handleSaveNotificationSettings = () => {
    toast({ 
      title: "Settings Saved", 
      description: "Notification settings have been successfully updated.", 
      variant: "default" 
    })
  }

  return (
    <div className="space-y-6">
      <NotificationChannelsCard 
        pushEnabled={pushEnabled} 
        setPushEnabled={setPushEnabled} 
        emailEnabled={emailEnabled} 
        setEmailEnabled={setEmailEnabled} 
        smsEnabled={smsEnabled} 
        setSmsEnabled={setSmsEnabled} 
      />
      
      <NotificationTypesCard />

      <div className="flex justify-end pt-2">
        <Button onClick={handleSaveNotificationSettings}>Save Notification Settings</Button>
      </div>
    </div>
  )
} 