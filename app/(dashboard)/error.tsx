"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center gap-6 py-24 text-center">
      <div className="space-y-2">
        <p className="text-sm font-medium uppercase tracking-[0.22em] text-muted-foreground">
          Dashboard error
        </p>
        <h2 className="text-2xl font-semibold tracking-tight">
          Something went wrong
        </h2>
        <p className="text-sm leading-6 text-muted-foreground">
          We could not load this page. Try again or come back shortly.
        </p>
      </div>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
