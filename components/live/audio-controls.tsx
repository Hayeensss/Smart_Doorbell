"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Mic, Speaker } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export default function AudioControls() {
  const [isTalking, setIsTalking] = useState(false)
  const [volume, setVolume] = useState([75])
  const [isAudioEnabled, setIsAudioEnabled] = useState(true)

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="flex-1 w-full space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="volume" className="flex items-center gap-2">
                <Speaker className="h-4 w-4" />
                <span>Speaker Volume</span>
              </Label>
              <div className="flex items-center gap-2">
                <Switch id="audio-toggle" checked={isAudioEnabled} onCheckedChange={setIsAudioEnabled} />
                <span className="text-sm text-muted-foreground">{isAudioEnabled ? "On" : "Off"}</span>
              </div>
            </div>
            <Slider
              id="volume"
              value={volume}
              onValueChange={setVolume}
              max={100}
              step={1}
              disabled={!isAudioEnabled}
            />
          </div>

          <div>
            <Button
              variant={isTalking ? "default" : "outline"}
              size="lg"
              className="h-16 w-16 rounded-full"
              onMouseDown={() => setIsTalking(true)}
              onMouseUp={() => setIsTalking(false)}
              onMouseLeave={() => setIsTalking(false)}
              disabled={!isAudioEnabled}
            >
              <Mic className={`h-6 w-6 ${isTalking ? "text-primary-foreground" : ""}`} />
            </Button>
            <div className="text-xs text-center mt-1 text-muted-foreground">Hold to Talk</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
