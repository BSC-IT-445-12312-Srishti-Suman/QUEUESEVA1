import { Skeleton, SkeletonCard } from "@/components/ui/Skeleton";

export default function RootLoading() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center">
      {/* Background decorations - matching HomeLanding */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-glow-cyan rounded-full mix-blend-screen filter blur-[150px] opacity-10 -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-glow-violet rounded-full mix-blend-screen filter blur-[150px] opacity-10 translate-y-1/4 -translate-x-1/4"></div>

      <main className="max-w-5xl mx-auto px-6 py-12 relative z-10 w-full">
        <div className="text-center mb-16 flex flex-col items-center">
          <Skeleton className="h-9 w-48 rounded-full mb-6" />
          <Skeleton className="h-16 w-3/4 md:w-1/2 mb-4" />
          <Skeleton className="h-16 w-1/2 md:w-1/3 mb-6" />
          <Skeleton className="h-6 w-2/3 md:w-1/2" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </main>
      
      {/* Decorative footer line */}
      <div className="fixed bottom-0 left-0 w-full h-1 bg-foreground/10"></div>
    </div>
  );
}
