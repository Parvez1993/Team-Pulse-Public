export default function AuthLoading() {
  return (
    <div className="w-full max-w-lg rounded-[2rem] border border-border/70 bg-card/95 p-8 shadow-[0_24px_80px_rgba(15,23,42,0.12)] backdrop-blur sm:p-10">
      <div className="space-y-3">
        <div className="h-3 w-20 animate-pulse rounded-full bg-muted" />
        <div className="h-8 w-64 animate-pulse rounded-full bg-muted" />
        <div className="h-4 w-80 animate-pulse rounded-full bg-muted" />
      </div>
      <div className="mt-8 space-y-5 border-t border-border/60 pt-8">
        <div className="space-y-2">
          <div className="h-4 w-20 animate-pulse rounded-full bg-muted" />
          <div className="h-12 w-full animate-pulse rounded-xl bg-muted" />
        </div>
        <div className="space-y-2">
          <div className="h-4 w-24 animate-pulse rounded-full bg-muted" />
          <div className="h-12 w-full animate-pulse rounded-xl bg-muted" />
        </div>
        <div className="h-12 w-full animate-pulse rounded-xl bg-muted" />
      </div>
    </div>
  );
}
