import { auth } from "@clerk/nextjs/server";
import { getUserPreferences } from "@/db/db";

import InteractiveDashboardArea from "@/components/dashboard/interactive-dashboard-area";

export const metadata = {
  title: 'Dashboard',
  description: 'View your smart doorbell dashboard',
};

export default async function DashboardPage() {
  const { userId } = await auth();
  let initialModeId = 'home';

  if (userId) {
      const preferences = await getUserPreferences(userId);
      if (preferences && preferences.defaultMode) {
        initialModeId = preferences.defaultMode;
      }
  }

  return (
    <InteractiveDashboardArea initialModeId={initialModeId} />
  );
}
