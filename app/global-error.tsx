"use client";

import { useEffect } from "react";

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
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-6 text-center text-foreground">
        <div className="space-y-2">
          <p className="text-sm font-medium uppercase tracking-[0.22em] text-muted-foreground">
            Critical error
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">
            Something went wrong
          </h1>
          <p className="text-sm leading-6 text-muted-foreground">
            A critical error occurred. Try again or refresh the page.
          </p>
        </div>
        <button
          onClick={reset}
          className="rounded-xl bg-foreground px-5 py-2.5 text-sm font-medium text-background transition hover:opacity-90"
        >
          Try again
        </button>
      </body>
    </html>
  );
}
