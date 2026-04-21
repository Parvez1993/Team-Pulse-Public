function SkeletonRow() {
  return (
    <div className="flex items-start gap-3 px-4 py-3.5">
      <div className="mt-1.5 h-8 w-0.75 shrink-0 animate-pulse rounded-full bg-muted" />
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <div className="h-5 w-16 animate-pulse rounded-full bg-muted" />
          <div className="h-5 w-12 animate-pulse rounded-full bg-muted" />
          <div className="h-4 w-48 animate-pulse rounded-full bg-muted" />
        </div>
        <div className="h-3 w-24 animate-pulse rounded-full bg-muted" />
        <div className="h-3 w-full max-w-sm animate-pulse rounded-full bg-muted" />
      </div>
      <div className="flex shrink-0 flex-col items-end gap-2">
        <div className="h-6 w-20 animate-pulse rounded-full bg-muted" />
        <div className="h-8 w-32 animate-pulse rounded-xl bg-muted" />
      </div>
    </div>
  );
}

function FeedCardSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="rounded-[1.65rem] border border-border/60 bg-card">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/50 px-5 py-4">
        <div className="space-y-1.5">
          <div className="h-4 w-32 animate-pulse rounded-full bg-muted" />
          <div className="h-3 w-48 animate-pulse rounded-full bg-muted" />
        </div>
        <div className="h-5 w-8 animate-pulse rounded-full bg-muted" />
      </div>
      {/* Rows */}
      <div className="divide-y divide-border/40 py-1">
        {Array.from({ length: rows }).map((_, i) => (
          <SkeletonRow key={i} />
        ))}
      </div>
    </div>
  );
}

export function LogsFeedSkeleton() {
  return (
    <div className="space-y-4">
      {/* Create log form skeleton */}
      <div className="rounded-[1.65rem] border border-border/60 bg-card px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="h-4 w-24 animate-pulse rounded-full bg-muted" />
          <div className="ml-auto h-8 w-28 animate-pulse rounded-xl bg-muted" />
        </div>
      </div>

      {/* Filter bar skeleton */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="h-9 w-36 animate-pulse rounded-xl bg-muted" />
        <div className="h-9 w-28 animate-pulse rounded-xl bg-muted" />
        <div className="h-9 w-28 animate-pulse rounded-xl bg-muted" />
        <div className="h-9 w-28 animate-pulse rounded-xl bg-muted" />
      </div>

      {/* Needs Attention feed */}
      <FeedCardSkeleton rows={3} />

      {/* Recent Activity feed */}
      <FeedCardSkeleton rows={2} />
    </div>
  );
}
