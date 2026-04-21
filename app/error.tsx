"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
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
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
      <div className="space-y-2">
        <p className="text-sm font-medium uppercase tracking-[0.22em] text-muted-foreground">
          Something went wrong
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">
          Unexpected error
        </h1>
        <p className="text-sm leading-6 text-muted-foreground">
          An unexpected error occurred. Try again or refresh the page.
        </p>
      </div>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
