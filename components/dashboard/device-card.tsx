import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Camera, Bell, Radio, Eye, History } from "lucide-react"

export default function DeviceCard({ device }) {
  const getDeviceIcon = (type) => {
    switch (type) {
      case "camera":
        return <Camera className="h-4 w-4" />
      case "doorbell":
        return <Bell className="h-4 w-4" />
      case "sensor":
        return <Radio className="h-4 w-4" />
      default:
        return <Camera className="h-4 w-4" />
    }
  }

  return (
    <Card className="overflow-hidden">
      {device.thumbnail ? (
        <div className="relative h-32 w-full">
          <Image src={device.thumbnail || "/placeholder.svg"} alt={device.name} fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center">
            <Badge variant={device.status === "online" ? "default" : "destructive"} className="text-xs">
              {device.status === "online" ? "Online" : "Offline"}
            </Badge>
            <Badge variant="outline" className="bg-black/50 text-white border-0 text-xs">
              {device.battery}%
            </Badge>
          </div>
        </div>
      ) : (
        <div className="h-12 flex items-center justify-between px-4 pt-4">
          <Badge variant={device.status === "online" ? "default" : "destructive"} className="text-xs">
            {device.status === "online" ? "Online" : "Offline"}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {device.battery}%
          </Badge>
        </div>
      )}

      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-medium">{device.name}</h3>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              {getDeviceIcon(device.type)}
              <span className="capitalize">{device.type}</span>
            </div>
          </div>
          <Switch checked={device.status === "online"} />
        </div>

        <div className="text-sm mt-4">
          <div className="text-muted-foreground">Last event:</div>
          <div className="flex justify-between">
            <span>{device.lastEvent}</span>
            <span className="text-xs text-muted-foreground">{device.lastEventTime}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex gap-2">
        {device.type !== "sensor" && (
          <Button asChild variant="secondary" size="sm" className="flex-1">
            <Link href="/live">
              <Eye className="h-4 w-4 mr-1" />
              Live
            </Link>
          </Button>
        )}
        <Button asChild variant="outline" size="sm" className="flex-1">
          <Link href="/history">
            <History className="h-4 w-4 mr-1" />
            History
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
