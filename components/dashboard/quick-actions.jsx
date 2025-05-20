import { publishMqttMessageAction } from "@/app/actions/mqttActions";
import {
  getUserPreferencesAction,
  saveUserPreferencesAction,
} from "@/app/actions/userPreferencesActions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Briefcase, Home, Moon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function QuickActions() {
  const router = useRouter();
  const [currentMode, setCurrentMode] = useState(null);

  // Fetch current user preferences when component mounts
  useEffect(() => {
    async function fetchUserPreferences() {
      try {
        const result = await getUserPreferencesAction();
        if (result.success && result.data) {
          setCurrentMode(result.data.defaultMode?.toLowerCase() || null);
        }
      } catch (error) {
        console.error("Error fetching user preferences:", error);
      }
    }

    fetchUserPreferences();
  }, []);

  async function handleHomeMode() {
    try {
      await publishMqttMessageAction("{mode: 'home'}");

      // Update user preferences in the database
      const result = await saveUserPreferencesAction({
        defaultMode: "home",
        notificationsEnabled: true,
        soundsEnabled: true,
      });

      if (!result.success) {
        console.error("Failed to update preferences:", result.error);
        toast({
          title: "Warning",
          description: "Mode was set, but preferences couldn't be saved.",
          variant: "warning",
        });
      }

      // Update local state
      setCurrentMode("home");

      // Refresh the page
      router.refresh();
    } catch (error) {
      console.error("Error in handleHomeMode:", error);
      toast({
        title: "Error",
        description: "Failed to set Home mode. Please try again.",
        variant: "destructive",
      });
    }
  }

  async function handleAwayMode() {
    try {
      await publishMqttMessageAction("{mode: 'away'}");

      // Update user preferences in the database
      const result = await saveUserPreferencesAction({
        defaultMode: "away",
        notificationsEnabled: true,
        soundsEnabled: true,
      });

      if (!result.success) {
        console.error("Failed to update preferences:", result.error);
        toast({
          title: "Warning",
          description: "Mode was set, but preferences couldn't be saved.",
          variant: "warning",
        });
      }

      // Update local state
      setCurrentMode("away");

      // Refresh the page
      router.refresh();
    } catch (error) {
      console.error("Error in handleAwayMode:", error);
      toast({
        title: "Error",
        description: "Failed to set Away mode. Please try again.",
        variant: "destructive",
      });
    }
  }

  async function handleDndMode() {
    try {
      await publishMqttMessageAction("{mode: 'dnd'}");

      // Update user preferences in the database
      const result = await saveUserPreferencesAction({
        defaultMode: "dnd",
        notificationsEnabled: false,
        soundsEnabled: false,
      });

      if (!result.success) {
        console.error("Failed to update preferences:", result.error);
        toast({
          title: "Warning",
          description: "Mode was set, but preferences couldn't be saved.",
          variant: "warning",
        });
      }

      // Update local state
      setCurrentMode("dnd");

      // Refresh the page
      router.refresh();
    } catch (error) {
      console.error("Error in handleDndMode:", error);
      toast({
        title: "Error",
        description: "Failed to set DND mode. Please try again.",
        variant: "destructive",
      });
    }
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row justify-between gap-4 w-full">
          <Button
            variant={currentMode === "home" ? "default" : "outline"}
            className={`flex-col h-auto py-4 gap-2 flex-1 ${
              currentMode === "home" ? "bg-primary text-primary-foreground" : ""
            }`}
            onClick={handleHomeMode}
          >
            <Home className="h-5 w-5" />
            <span>Home Mode</span>
          </Button>
          <Button
            variant={currentMode === "away" ? "default" : "outline"}
            className={`flex-col h-auto py-4 gap-2 flex-1 ${
              currentMode === "away" ? "bg-primary text-primary-foreground" : ""
            }`}
            onClick={handleAwayMode}
          >
            <Briefcase className="h-5 w-5" />
            <span>Away Mode</span>
          </Button>
          <Button
            variant={currentMode === "dnd" ? "default" : "outline"}
            className={`flex-col h-auto py-4 gap-2 flex-1 ${
              currentMode === "dnd" ? "bg-primary text-primary-foreground" : ""
            }`}
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
