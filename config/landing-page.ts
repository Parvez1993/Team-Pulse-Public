export type LandingPageIcon =
  | "activity"
  | "brainCircuit"
  | "bellRing"
  | "shieldCheck";

type PreviewCard =
  | {
      kind: "stat";
      title: string;
      value: string;
      detail: string;
    }
  | {
      kind: "summary";
      title: string;
      content: string;
    };

export const landingPageContent = {
  metadata: {
    title: "Team Activity Monitoring Dashboard",
    description:
      "TeamPulse helps engineering teams monitor logs, surface incidents, and understand operational patterns with AI.",
  },
  brand: {
    name: "TeamPulse",
    footerTagline:
      "Operational visibility for fast-moving product and engineering teams.",
  },
  navLinks: [
    { href: "#features", label: "Features" },
    { href: "#workflow", label: "Workflow" },
    { href: "#cta", label: "Get Started" },
  ],
  hero: {
    eyebrow: "AI-Powered Team Monitoring",
    title: "Watch your team ship, break, and fix live",
    description:
      "TeamPulse turns daily team activity into a clear operational signal with live log feeds, incident tracking, AI summaries, and anomaly detection built for modern product teams.",
    primaryCta: { href: "#cta", label: "Start Building" },
    secondaryCta: { href: "#features", label: "Explore Features" },
    stats: [
      {
        title: "24h AI Digest",
        description: "Summaries of incidents, activity, and repeated failures.",
      },
      {
        title: "Realtime Logs",
        description: "New updates appear instantly for every team member.",
      },
      {
        title: "Secure Access",
        description: "Team-aware permissions designed for internal ops data.",
      },
    ],
  },
  preview: {
    heading: "Operational Health",
    status: "Stable, watch API",
    badge: "3 alerts detected",
    cards: [
      {
        kind: "stat" as const,
        title: "Logs Today",
        value: "184",
        detail: "+12% from yesterday",
      },
      {
        kind: "summary" as const,
        title: "AI Summary",
        content:
          "Payment retries spiked after 9:40 AM deploy. Errors repeated 3 times this week.",
      },
    ] satisfies readonly PreviewCard[],
    alerts: [
      "Incident: API timeout threshold exceeded in eu-west",
      "Warning: Same billing webhook failed 3 times this week",
      "Info: Team shipping velocity increased after release freeze",
    ],
  },
  features: {
    eyebrow: "Why TeamPulse",
    title: "A dashboard built for teams that need operational clarity.",
    description:
      "The goal is not just to collect logs. The goal is to help teams understand what changed, what repeated, and what needs action.",
    items: [
      {
        title: "Real-Time Activity Feed",
        description:
          "Watch incidents, updates, and team logs appear instantly without refreshing the dashboard.",
        icon: "activity" as LandingPageIcon,
      },
      {
        title: "AI Summaries",
        description:
          "Condense the last 24 hours of operational noise into a clear daily briefing for the whole team.",
        icon: "brainCircuit" as LandingPageIcon,
      },
      {
        title: "Anomaly Alerts",
        description:
          "Catch repeating failures, unusual spikes, and emerging incidents before they become outages.",
        icon: "bellRing" as LandingPageIcon,
      },
      {
        title: "Role-Based Access",
        description:
          "Keep team data protected with clear permissions for admins, members, and read-only viewers.",
        icon: "shieldCheck" as LandingPageIcon,
      },
    ],
  },
  workflowSteps: [
    {
      step: "Step 1",
      title: "Capture every signal",
      description:
        "Team members log incidents, progress, and blockers in a shared operational stream with structured severity and type.",
    },
    {
      step: "Step 2",
      title: "Let AI find the pattern",
      description:
        "Summaries, repeated error detection, and anomaly alerts reduce noise so the dashboard surfaces what matters first.",
    },
    {
      step: "Step 3",
      title: "Respond with confidence",
      description:
        "Admins and team members move from raw logs to decisions with shared context, filtered history, and accessible reporting.",
    },
  ],
  cta: {
    eyebrow: "Get Started",
    title:
      "Give your team one place to track activity, incidents, and emerging risk.",
    description:
      "TeamPulse helps teams move from scattered updates to a clear live operational view with searchable logs, AI summaries, and anomaly detection.",
    primaryCta: { href: "/", label: "Start Monitoring" },
    secondaryCta: { href: "#workflow", label: "See How It Works" },
  },
} as const;
