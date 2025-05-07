import { publishMqttMessageAction } from "@/app/actions/mqttActions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Briefcase, Home, Moon } from "lucide-react";

export default function QuickActions() {
  async function handleHomeMode() {
    await publishMqttMessageAction("{mode: 'home'}");
  }
  async function handleAwayMode() {
    await publishMqttMessageAction("{mode: 'away'}");
  }
  async function handleDndMode() {
    await publishMqttMessageAction("{mode: 'dnd'}");
  }
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row justify-between gap-4 w-full">
          <Button
            variant="outline"
            className="flex-col h-auto py-4 gap-2 flex-1"
            onClick={handleHomeMode}
          >
            <Home className="h-5 w-5" />
            <span>Home Mode</span>
          </Button>
          <Button
            variant="outline"
            className="flex-col h-auto py-4 gap-2 flex-1"
            onClick={handleAwayMode}
          >
            <Briefcase className="h-5 w-5" />
            <span>Away Mode</span>
          </Button>
          <Button
            variant="outline"
            className="flex-col h-auto py-4 gap-2 flex-1"
            onClick={handleDndMode}
          >
            <Moon className="h-5 w-5" />
            <span>DND Mode</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
