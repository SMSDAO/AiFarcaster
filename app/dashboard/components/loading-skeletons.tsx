function Pulse({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-lg bg-white/10 ${className}`} />;
}

export function StatCardSkeleton() {
  return (
    <div className="rounded-2xl border border-white/10 bg-gray-900/80 p-5 shadow-lg">
      <Pulse className="h-3 w-24" />
      <Pulse className="mt-3 h-8 w-20" />
      <Pulse className="mt-2 h-3 w-28" />
    </div>
  );
}

export function ActivityFeedSkeleton() {
  return (
    <div className="rounded-2xl border border-white/10 bg-gray-900/80 p-5 shadow-lg">
      <Pulse className="h-5 w-40" />
      <div className="mt-4 space-y-3">
        <Pulse className="h-14 w-full" />
        <Pulse className="h-14 w-full" />
        <Pulse className="h-14 w-full" />
      </div>
    </div>
  );
}

export function FrameTimelineSkeleton() {
  return (
    <div className="rounded-2xl border border-white/10 bg-gray-900/80 p-5 shadow-lg">
      <Pulse className="h-5 w-36" />
      <div className="mt-4 space-y-3">
        <Pulse className="h-16 w-full" />
        <Pulse className="h-16 w-full" />
        <Pulse className="h-16 w-full" />
      </div>
    </div>
  );
}

export function DashboardLoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-white/10 bg-gray-900/80 p-6 shadow-lg">
        <Pulse className="h-7 w-72" />
        <Pulse className="mt-3 h-4 w-96 max-w-full" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <ActivityFeedSkeleton />
        </div>
        <ActivityFeedSkeleton />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-gray-900/80 p-5 shadow-lg">
          <Pulse className="h-5 w-40" />
          <div className="mt-4 grid grid-cols-2 gap-4">
            <Pulse className="h-16 w-full" />
            <Pulse className="h-16 w-full" />
            <Pulse className="h-16 w-full" />
            <Pulse className="h-16 w-full" />
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-gray-900/80 p-5 shadow-lg">
          <Pulse className="h-5 w-44" />
          <Pulse className="mt-4 h-44 w-full" />
        </div>
      </div>

      <FrameTimelineSkeleton />
    </div>
  );
}

export function DashboardRouteLoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-white/10 bg-gray-900/80 p-6 shadow-lg">
        <Pulse className="h-7 w-56" />
        <Pulse className="mt-3 h-4 w-80 max-w-full" />
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Pulse className="h-48 w-full" />
        <Pulse className="h-48 w-full" />
        <Pulse className="h-48 w-full" />
      </div>
    </div>
  );
}
