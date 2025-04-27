"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Home, Briefcase, Moon, ChevronDown } from "lucide-react"

const modes = [
  {
    id: "home",
    name: "Home",
    icon: Home,
    description: "All devices active",
  },
  {
    id: "away",
    name: "Away",
    icon: Briefcase,
    description: "Full security monitoring",
  },
  {
    id: "dnd",
    name: "Do Not Disturb",
    icon: Moon,
    description: "Notifications silenced",
  },
]

export default function ModeSelector() {
  const [currentMode, setCurrentMode] = useState(modes[0])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full md:w-auto justify-between">
          <div className="flex items-center gap-2">
            <currentMode.icon className="h-4 w-4" />
            <span>{currentMode.name}</span>
          </div>
          <ChevronDown className="h-4 w-4 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {modes.map((mode) => (
          <DropdownMenuItem key={mode.id} onClick={() => setCurrentMode(mode)} className="cursor-pointer">
            <div className="flex items-center gap-2">
              <mode.icon className="h-4 w-4" />
              <div>
                <div>{mode.name}</div>
                <div className="text-xs text-muted-foreground">{mode.description}</div>
              </div>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
