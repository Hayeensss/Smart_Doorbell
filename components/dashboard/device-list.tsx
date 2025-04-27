"use client"

import { useState } from "react"
import DeviceCard from "./device-card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

// Mock data for devices
const mockDevices = [
  {
    id: "cam-1",
    name: "Front Door Camera",
    type: "camera",
    status: "online",
    battery: 85,
    lastEvent: "Motion detected",
    lastEventTime: "2 min ago",
    thumbnail: "/placeholder.svg?height=120&width=200",
  },
  {
    id: "door-1",
    name: "Main Doorbell",
    type: "doorbell",
    status: "online",
    battery: 72,
    lastEvent: "Ring",
    lastEventTime: "15 min ago",
    thumbnail: "/placeholder.svg?height=120&width=200",
  },
  {
    id: "cam-2",
    name: "Backyard Camera",
    type: "camera",
    status: "online",
    battery: 64,
    lastEvent: "Motion detected",
    lastEventTime: "35 min ago",
    thumbnail: "/placeholder.svg?height=120&width=200",
  },
  {
    id: "sensor-1",
    name: "Living Room Sensor",
    type: "sensor",
    status: "online",
    battery: 92,
    lastEvent: "Motion detected",
    lastEventTime: "1 hour ago",
    thumbnail: null,
  },
  {
    id: "sensor-2",
    name: "Kitchen Sensor",
    type: "sensor",
    status: "offline",
    battery: 15,
    lastEvent: "Low battery",
    lastEventTime: "2 hours ago",
    thumbnail: null,
  },
  {
    id: "door-2",
    name: "Side Door",
    type: "doorbell",
    status: "online",
    battery: 78,
    lastEvent: "Ring",
    lastEventTime: "3 hours ago",
    thumbnail: "/placeholder.svg?height=120&width=200",
  },
]

export default function DeviceList({ filter = "all" }) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredDevices = mockDevices.filter((device) => {
    // Filter by type
    if (filter !== "all" && device.type !== filter) {
      return false
    }

    // Filter by search query
    if (searchQuery && !device.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }

    return true
  })

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search devices..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {filteredDevices.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No devices found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDevices.map((device) => (
            <DeviceCard key={device.id} device={device} />
          ))}
        </div>
      )}
    </div>
  )
}
