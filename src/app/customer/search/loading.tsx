import { Skeleton } from "@/components/ui/Skeleton";
import SearchSkeleton from "@/components/shop/SearchSkeleton";

export default function CustomerSearchLoading() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
      <div className="h-16 border-b border-foreground/5 bg-background/50 backdrop-blur-md px-6 flex items-center justify-between">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-10 w-10 rounded-full" />
      </div>

      <main className="max-w-7xl mx-auto px-6 py-8 relative z-10 w-full flex-grow">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="space-y-4">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-4 w-48" />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 flex-grow max-w-2xl">
            <Skeleton className="h-12 flex-grow rounded-xl" />
            <Skeleton className="h-12 w-44 rounded-xl" />
          </div>
        </div>

        <div className="flex items-center space-x-2 mb-6">
          <Skeleton className="h-5 w-40" />
        </div>

        <SearchSkeleton />
      </main>
    </div>
  );
}
