import { Skeleton } from "@/components/ui/skeleton";

export default function HistorySkeleton() {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Skeleton for Filters */}
        <div>
          <div className="space-y-4 p-4 border rounded-lg">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
         {/* Skeleton for Event List */}
        <div className="lg:col-span-3 space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="p-4 border rounded-lg shadow space-y-3">
              <div className="flex items-center space-x-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="space-y-1 flex-grow">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
              <Skeleton className="h-4 w-1/4 ml-auto" />
            </div>
          ))}
        </div>
      </div>
    );
  } 