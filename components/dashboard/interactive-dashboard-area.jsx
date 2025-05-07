"use client";

import { useState, useEffect } from "react";
import DashboardHeader from "@/components/dashboard/dashboard-header";
import QuickActions from "@/components/dashboard/quick-actions";
import { Separator } from "@/components/ui/separator";
import LiveViewSection from "@/components/dashboard/live-view-section";

export default function InteractiveDashboardArea({ initialModeId }) {
  const [activeModeId, setActiveModeId] = useState(initialModeId);

  useEffect(() => {
    setActiveModeId(initialModeId);
  }, [initialModeId]);

  return (
    <div className="space-y-6">
      <DashboardHeader activeModeId={activeModeId} />
      <Separator />
      <QuickActions activeModeId={activeModeId} setActiveModeId={setActiveModeId} />
      <LiveViewSection />
    </div>
  );
} 