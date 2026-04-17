import { Skeleton } from "@/components/ui/Skeleton";

export default function BookingsSkeleton() {
  return (
    <div className="space-y-4 w-full">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="glass-panel p-6 relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center space-x-4 flex-grow">
              <Skeleton className="w-14 h-14 rounded-2xl" />
              <div className="space-y-2 flex-grow max-w-md">
                <Skeleton className="h-6 w-48" />
                <div className="flex gap-2">
                  <Skeleton className="h-4 w-24 rounded-full" />
                  <Skeleton className="h-4 w-32 rounded-full" />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-24 rounded-xl" />
              <Skeleton className="h-10 w-10 rounded-xl" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
