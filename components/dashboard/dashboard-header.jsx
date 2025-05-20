import ModeSelector from "@/components/dashboard/mode-selector";

export default function DashboardHeader({ activeModeId }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor and control your connected devices
        </p>
      </div>
      <ModeSelector activeModeId={activeModeId} />
    </div>
  );
}
