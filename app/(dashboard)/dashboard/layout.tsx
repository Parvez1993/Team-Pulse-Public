import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const name =
    user?.user_metadata?.full_name ?? user?.user_metadata?.name ?? "";
  const email = user?.email ?? "";

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader name={name} email={email} />
      <main className="mx-auto w-full max-w-[1200px] px-4 py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
