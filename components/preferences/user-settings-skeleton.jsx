"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function UserSettingsSkeleton() {
  return (
    <div className="space-y-6 p-6">
      {/* Skeleton for Account Information Card */}
      <div className="space-y-4">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-4 w-1/2" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="space-y-2">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
        <Skeleton className="h-10 w-1/4" />
      </div>

      {/* Skeleton for Default Settings Card */}
      <div className="space-y-4">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-4 w-1/2" />
        <div className="space-y-2 pt-2">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        <Skeleton className="h-px w-full my-4" />
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-4 w-2/3" />
            </div>
            <Skeleton className="h-6 w-12" />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-4 w-2/3" />
            </div>
            <Skeleton className="h-6 w-12" />
          </div>
        </div>
        <Skeleton className="h-10 w-1/4" />
      </div>
    </div>
  );
} 