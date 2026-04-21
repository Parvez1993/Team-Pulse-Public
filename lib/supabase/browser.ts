import { createBrowserClient } from "@supabase/ssr";

import { getSupabaseClientEnv } from "@/lib/supabase/env";

let browserClient: ReturnType<typeof createBrowserClient> | undefined;

export function createClient() {
  const { url, publishableKey } = getSupabaseClientEnv();

  // Reuse one browser-side Supabase client for realtime and client interactions.
  browserClient ??= createBrowserClient(url, publishableKey);

  return browserClient;
}
