"use client";

import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";

export function CreateLogSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <div className="mt-4 flex items-center justify-end gap-3">
      <p aria-live="polite" className="text-[11px] text-muted-foreground">
        {pending ? "Creating log and refreshing the feed..." : null}
      </p>
      <Button
        type="submit"
        size="sm"
        disabled={pending}
        className="h-9 rounded-xl px-5 shadow-sm"
      >
        {pending ? "Creating..." : "Create log"}
      </Button>
    </div>
  );
}
