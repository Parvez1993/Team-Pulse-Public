type SupabaseClientEnv = {
  url: string;
  publishableKey: string;
};

function getRequiredEnv(
  name:
    | "NEXT_PUBLIC_SUPABASE_URL"
    | "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"
    | "NEXT_PUBLIC_APP_URL",
) {
  let value: string | undefined;

  if (name === "NEXT_PUBLIC_SUPABASE_URL") {
    value = process.env.NEXT_PUBLIC_SUPABASE_URL;
  } else if (name === "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY") {
    value = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  } else {
    value = process.env.NEXT_PUBLIC_APP_URL;
  }

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export function getSupabaseClientEnv(): SupabaseClientEnv {
  return {
    url: getRequiredEnv("NEXT_PUBLIC_SUPABASE_URL"),
    publishableKey: getRequiredEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"),
  };
}

export function getAppUrl() {
  return getRequiredEnv("NEXT_PUBLIC_APP_URL");
}
