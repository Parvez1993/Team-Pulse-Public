export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      {/* Stats / greeting skeleton */}
      <div className="rounded-[1.65rem] border border-border/60 bg-card px-6 py-5">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="h-3 w-16 animate-pulse rounded-full bg-muted" />
            <div className="h-7 w-52 animate-pulse rounded-full bg-muted" />
            <div className="h-3 w-32 animate-pulse rounded-full bg-muted" />
          </div>
          <div className="h-7 w-28 animate-pulse rounded-full bg-muted" />
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-xl border border-border/60 bg-muted/40 p-4">
              <div className="h-3 w-12 animate-pulse rounded-full bg-muted" />
              <div className="mt-2 h-7 w-10 animate-pulse rounded-full bg-muted" />
              <div className="mt-1.5 h-3 w-20 animate-pulse rounded-full bg-muted" />
            </div>
          ))}
        </div>
      </div>

      {/* Main two-column grid */}
      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        {/* Left: logs feed */}
        <div className="space-y-4">
          {/* Create log form */}
          <div className="rounded-[1.65rem] border border-border/60 bg-card px-5 py-4">
            <div className="flex items-center justify-between">
              <div className="h-4 w-24 animate-pulse rounded-full bg-muted" />
              <div className="h-8 w-28 animate-pulse rounded-xl bg-muted" />
            </div>
          </div>

          {/* Filter bar */}
          <div className="flex flex-wrap gap-2">
            {[80, 96, 88, 80].map((w, i) => (
              <div
                key={i}
                style={{ width: w }}
                className="h-9 animate-pulse rounded-xl bg-muted"
              />
            ))}
          </div>

          {/* Needs attention feed */}
          <div className="rounded-[1.65rem] border border-border/60 bg-card">
            <div className="flex items-center justify-between border-b border-border/50 px-5 py-4">
              <div className="space-y-1.5">
                <div className="h-4 w-32 animate-pulse rounded-full bg-muted" />
                <div className="h-3 w-44 animate-pulse rounded-full bg-muted" />
              </div>
              <div className="h-5 w-6 animate-pulse rounded-full bg-muted" />
            </div>
            <div className="divide-y divide-border/40 py-1">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-start gap-3 px-4 py-3.5">
                  <div className="mt-1.5 h-8 w-0.75 animate-pulse rounded-full bg-muted" />
                  <div className="flex-1 space-y-2">
                    <div className="flex gap-2">
                      <div className="h-5 w-16 animate-pulse rounded-full bg-muted" />
                      <div className="h-5 w-12 animate-pulse rounded-full bg-muted" />
                      <div className="h-4 w-40 animate-pulse rounded-full bg-muted" />
                    </div>
                    <div className="h-3 w-20 animate-pulse rounded-full bg-muted" />
                  </div>
                  <div className="h-8 w-32 animate-pulse rounded-xl bg-muted" />
                </div>
              ))}
            </div>
          </div>

          {/* Recent activity feed */}
          <div className="rounded-[1.65rem] border border-border/60 bg-card">
            <div className="border-b border-border/50 px-5 py-4">
              <div className="h-4 w-28 animate-pulse rounded-full bg-muted" />
              <div className="mt-1.5 h-3 w-44 animate-pulse rounded-full bg-muted" />
            </div>
            <div className="divide-y divide-border/40 py-1">
              {[1, 2].map((i) => (
                <div key={i} className="flex items-start gap-3 px-4 py-3.5">
                  <div className="mt-1.5 h-8 w-0.75 animate-pulse rounded-full bg-muted" />
                  <div className="flex-1 space-y-2">
                    <div className="flex gap-2">
                      <div className="h-5 w-16 animate-pulse rounded-full bg-muted" />
                      <div className="h-4 w-48 animate-pulse rounded-full bg-muted" />
                    </div>
                    <div className="h-3 w-24 animate-pulse rounded-full bg-muted" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: team list */}
        <div className="rounded-[1.65rem] border border-border/60 bg-card p-5">
          <div className="h-4 w-20 animate-pulse rounded-full bg-muted" />
          <div className="mt-1.5 h-6 w-32 animate-pulse rounded-full bg-muted" />
          <div className="mt-5 space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="rounded-xl border border-border/60 p-4">
                <div className="flex items-start justify-between">
                  <div className="h-10 w-10 animate-pulse rounded-xl bg-muted" />
                  <div className="h-5 w-14 animate-pulse rounded-full bg-muted" />
                </div>
                <div className="mt-4 h-5 w-36 animate-pulse rounded-full bg-muted" />
                <div className="mt-1.5 h-3 w-24 animate-pulse rounded-full bg-muted" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
