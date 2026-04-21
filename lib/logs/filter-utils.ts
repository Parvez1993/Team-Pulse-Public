import {
  LOG_DATE_RANGES,
  LOG_SORT_OPTIONS,
} from "@/lib/logs/constants";
import type { LogFilters } from "@/components/dashboard/logs-section";

type DashboardSearchParams = {
  q?: string;
  team?: string;
  type?: string;
  severity?: string;
  status?: string;
  dateRange?: string;
  sort?: string;
  from?: string;
  to?: string;
};

function getEnumFilter<T extends string>(
  value: string | undefined,
  allowed: readonly T[],
) {
  return value && allowed.includes(value as T) ? (value as T) : "";
}

function getDateInput(value: string | undefined) {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return "";
  }

  return value;
}

function getDateRangeStart(dateRange: LogFilters["dateRange"]) {
  if (dateRange === "all") {
    return null;
  }

  const now = new Date();
  const rangeStart = new Date(now);

  if (dateRange === "24h") {
    rangeStart.setHours(now.getHours() - 24);
    return rangeStart.toISOString();
  }

  rangeStart.setDate(now.getDate() - (dateRange === "7d" ? 7 : 30));
  return rangeStart.toISOString();
}

export function getLogFilters(
  params: DashboardSearchParams | undefined,
  allowedTeamIds: string[],
): LogFilters {
  const q = typeof params?.q === "string" ? params.q.trim() : "";
  const team =
    typeof params?.team === "string" && allowedTeamIds.includes(params.team)
      ? params.team
      : "";
  const type = getEnumFilter(params?.type, ["activity", "error", "incident"]);
  const severity = getEnumFilter(params?.severity, [
    "low",
    "medium",
    "high",
    "critical",
  ]);
  const status = getEnumFilter(params?.status, [
    "open",
    "in_progress",
    "resolved",
    "done",
  ]);
  const dateRange = getEnumFilter(params?.dateRange, LOG_DATE_RANGES) || "all";
  const sort = getEnumFilter(params?.sort, LOG_SORT_OPTIONS) || "newest";
  const from = getDateInput(params?.from);
  const to = getDateInput(params?.to);

  return { q, team, type, severity, status, dateRange, sort, from, to };
}

export function getDateBounds(filters: LogFilters) {
  const lowerBounds = [getDateRangeStart(filters.dateRange)];
  const upperBounds: Array<string | null> = [];

  if (filters.from) {
    lowerBounds.push(new Date(`${filters.from}T00:00:00.000Z`).toISOString());
  }

  if (filters.to) {
    const toDate = new Date(`${filters.to}T00:00:00.000Z`);
    toDate.setUTCDate(toDate.getUTCDate() + 1);
    upperBounds.push(toDate.toISOString());
  }

  return {
    start: lowerBounds.filter(Boolean).sort().at(-1) ?? null,
    end: upperBounds.filter(Boolean).sort().at(0) ?? null,
  };
}
