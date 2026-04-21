export type NavItem = {
  label: string;
  href: string;
  icon: string;
};

export const NAV_ITEMS: NavItem[] = [
  {
    label: "Overview",
    href: "/dashboard",
    icon: "overview",
  },
  {
    label: "Logs",
    href: "/dashboard/logs",
    icon: "logs",
  },
  {
    label: "Teams",
    href: "/dashboard/teams",
    icon: "teams",
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: "settings",
  },
];
