import { Skeleton } from "@/components/ui/Skeleton";

export default function SearchSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="glass-panel p-6 relative overflow-hidden">
          <div className="flex justify-between items-center relative z-10">
            <div className="flex items-center space-x-4">
              <Skeleton className="w-16 h-16 rounded-2xl" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-20 rounded-full" />
                <Skeleton className="h-3 w-40" />
              </div>
            </div>
            <Skeleton className="w-10 h-10 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
