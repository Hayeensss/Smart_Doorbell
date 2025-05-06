"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Wifi, WifiOff, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function DeviceConnectionButton() {
  const [isConnected, setIsConnected] = useState(true)
  const [isConnecting, setIsConnecting] = useState(false)

  const handleConnect = () => {
    setIsConnecting(true)
    // Simulate connection process
    setTimeout(() => {
      setIsConnected(true)
      setIsConnecting(false)
    }, 2000)
  }

  const handleDisconnect = () => {
    setIsConnected(false)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          {isConnected ? (
            <>
              <Wifi className="h-4 w-4 text-green-500" />
              <span className="hidden sm:inline">Connected</span>
            </>
          ) : (
            <>
              <WifiOff className="h-4 w-4 text-red-500" />
              <span className="hidden sm:inline">Disconnected</span>
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Device Connection</DialogTitle>
          <DialogDescription>
            {isConnected ? "Your devices are currently connected." : "Connect to your smart home devices."}
          </DialogDescription>
        </DialogHeader>

        {isConnected ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wifi className="h-5 w-5 text-green-500" />
                <span>Home Hub</span>
              </div>
              <Button variant="outline" size="sm" onClick={handleDisconnect}>
                Disconnect
              </Button>
            </div>
            <div className="text-sm text-muted-foreground">Connected to 8 devices</div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="hub-id">Hub ID</Label>
              <Input id="hub-id" placeholder="Enter your hub ID" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hub-password">Password</Label>
              <Input id="hub-password" type="password" placeholder="••••••••" />
            </div>
            <Button className="w-full" onClick={handleConnect} disabled={isConnecting}>
              {isConnecting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                "Connect"
              )}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
} 