"use client";

import type { REALTIME_SUBSCRIBE_STATES, RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import { startTransition, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { createClient } from "@/lib/supabase/browser";

type LogsRealtimeListenerProps = {
  teamIds: string[];
};

const EVENT_MESSAGES = {
  INSERT: "New log entry added.",
  UPDATE: "A log was updated.",
  DELETE: "A log was removed.",
} as const;

export function LogsRealtimeListener({
  teamIds,
}: LogsRealtimeListenerProps) {
  const router = useRouter();
  const refreshTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const teamIdsKey = useMemo(() => teamIds.join(","), [teamIds]);

  useEffect(() => {
    if (!teamIdsKey) {
      return;
    }

    const supabase = createClient();
    let isActive = true;

    const scheduleRefresh = (eventType: keyof typeof EVENT_MESSAGES) => {
      toast.info(EVENT_MESSAGES[eventType], {
        description: "The activity feed has been updated.",
        duration: 4000,
      });

      if (refreshTimer.current) {
        clearTimeout(refreshTimer.current);
      }

      refreshTimer.current = setTimeout(() => {
        startTransition(() => {
          router.refresh();
        });
      }, 200);
    };

    let channel:
      | ReturnType<ReturnType<typeof createClient>["channel"]>
      | undefined;

    void (async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!isActive) {
        return;
      }

      if (session?.access_token) {
        await supabase.realtime.setAuth(session.access_token);
      }

      channel = supabase
        .channel(`logs-realtime-${teamIdsKey}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "logs",
            filter: `team_id=in.(${teamIdsKey})`,
          },
          (payload: RealtimePostgresChangesPayload<{ [key: string]: unknown }>) => {
            if (process.env.NODE_ENV !== "production") {
              console.warn("[team-pulse] logs realtime event received", payload.eventType);
            }
            scheduleRefresh(payload.eventType as keyof typeof EVENT_MESSAGES);
          },
        )
        .subscribe((status: REALTIME_SUBSCRIBE_STATES, err?: Error) => {
          if (process.env.NODE_ENV !== "production") {
            console.warn("[team-pulse] logs realtime status:", status);

            if (err) {
              console.warn("[team-pulse] logs realtime error:", err.message);
            }
          }
        });
    })();

    return () => {
      isActive = false;

      if (refreshTimer.current) {
        clearTimeout(refreshTimer.current);
      }

      if (channel) {
        void supabase.removeChannel(channel);
      }
    };
  }, [router, teamIdsKey]);

  return null;
}
