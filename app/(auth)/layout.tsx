import Link from "next/link";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(20,184,166,0.18),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.14),transparent_28%)]">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 py-6 lg:px-8">
        <header className="flex items-center justify-between py-2">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            TeamPulse
          </Link>
          <Link
            href="/"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Back to Home
          </Link>
        </header>

        <div className="flex flex-1 items-center justify-center py-10">
          {children}
        </div>
      </div>
    </main>
  );
}
