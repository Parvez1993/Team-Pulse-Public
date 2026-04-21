export const LOG_ATTACHMENTS_BUCKET = "log-attachments";
export const LOG_ATTACHMENT_MAX_SIZE_BYTES = 5 * 1024 * 1024;
export const LOG_ATTACHMENT_ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
  "text/plain",
  "text/csv",
  "application/json",
] as const;

export const LOG_DATE_RANGES = ["all", "24h", "7d", "30d"] as const;
export const LOG_SORT_OPTIONS = ["newest", "oldest"] as const;

export type LogDateRange = (typeof LOG_DATE_RANGES)[number];
export type LogSortOption = (typeof LOG_SORT_OPTIONS)[number];
