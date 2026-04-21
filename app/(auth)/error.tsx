"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AuthError({
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
    <div className="flex flex-col items-center justify-center gap-6 text-center">
      <div className="space-y-2">
        <p className="text-sm font-medium uppercase tracking-[0.22em] text-muted-foreground">
          Auth error
        </p>
        <h2 className="text-2xl font-semibold tracking-tight">
          Something went wrong
        </h2>
        <p className="text-sm leading-6 text-muted-foreground">
          We could not complete this action. Try again or return to login.
        </p>
      </div>
      <div className="flex gap-3">
        <Button onClick={reset}>Try again</Button>
        <Button variant="outline" asChild>
          <Link href="/login">Back to login</Link>
        </Button>
      </div>
    </div>
  );
}
