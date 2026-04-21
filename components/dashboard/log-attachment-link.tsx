export function LogAttachmentLink({
  href,
  name,
}: {
  href: string;
  name: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-2 rounded-lg border border-border/70 bg-muted/30 px-2.5 py-1.5 text-[11px] font-medium text-foreground transition-colors hover:bg-muted"
    >
      <svg
        viewBox="0 0 20 20"
        fill="currentColor"
        className="h-3.5 w-3.5 text-muted-foreground"
      >
        <path d="M10.75 2.5a.75.75 0 0 0-1.5 0v8.19L6.53 7.97a.75.75 0 0 0-1.06 1.06l4 4a.75.75 0 0 0 1.06 0l4-4a.75.75 0 0 0-1.06-1.06l-2.72 2.72V2.5Z" />
        <path d="M3.5 13.75A1.75 1.75 0 0 1 5.25 12h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v1A1.75 1.75 0 0 0 6.75 16.5h6.5A1.75 1.75 0 0 0 15 14.75v-1a.25.25 0 0 0-.25-.25h-1.5a.75.75 0 0 1 0-1.5h1.5a1.75 1.75 0 0 1 1.75 1.75v1A3.25 3.25 0 0 1 13.25 18h-6.5A3.25 3.25 0 0 1 3.5 14.75v-1Z" />
      </svg>
      <span className="max-w-[220px] truncate">{name}</span>
    </a>
  );
}
