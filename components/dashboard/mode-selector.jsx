"use client";

import { Briefcase, Home, Moon } from "lucide-react";

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
];

export default function ModeSelector({ activeModeId }) {
  const currentMode =
    modes.find((mode) => mode.id === activeModeId) || modes[0];

  if (!currentMode) {
    return (
      <div className="flex items-center gap-2 p-2 border rounded-md bg-muted text-muted-foreground">
        <span>Mode Undefined</span>
      </div>
    );
  }

  const IconComponent = currentMode.icon;

  return (
    <div className="flex items-center gap-2 p-2 border rounded-md bg-background shadow-sm">
      <IconComponent className="h-5 w-5 text-primary" />
      <span className="font-medium text-foreground">{currentMode.name}</span>
    </div>
  );
}
