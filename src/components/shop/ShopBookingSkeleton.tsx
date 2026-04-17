import { Skeleton } from "@/components/ui/Skeleton";

export default function ShopBookingSkeleton() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
      <div className="h-16 border-b border-foreground/5 bg-background/50 backdrop-blur-md px-6 flex items-center justify-between">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-10 w-10 rounded-full" />
      </div>

      <main className="max-w-7xl mx-auto px-6 py-8 relative z-10 w-full flex-grow">
        {/* Shop Header Skeleton */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-4">
            <Skeleton className="h-12 w-64 md:w-96" />
            <div className="flex flex-wrap gap-4">
              <Skeleton className="h-6 w-32 rounded-full" />
              <Skeleton className="h-6 w-48 rounded-full" />
            </div>
          </div>
          <Skeleton className="h-12 w-40 rounded-2xl" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Side: Date & Time Selection */}
          <div className="lg:col-span-8 space-y-10">
            <div className="space-y-4">
              <Skeleton className="h-8 w-40" />
              <div className="flex gap-4 overflow-hidden">
                {[...Array(7)].map((_, i) => (
                  <Skeleton key={i} className="h-24 w-20 flex-shrink-0 rounded-2xl" />
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <Skeleton className="h-8 w-48" />
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {[...Array(18)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full rounded-xl" />
                ))}
              </div>
            </div>
          </div>

          {/* Right Side: Info Panel */}
          <div className="lg:col-span-4">
            <div className="glass-panel p-6 space-y-6">
              <Skeleton className="h-10 w-full rounded-xl" />
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/5" />
              </div>
              <Skeleton className="h-14 w-full rounded-2xl" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
