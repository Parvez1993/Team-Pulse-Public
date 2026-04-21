"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import type { LogDateRange } from "@/lib/logs/constants";
import { LOG_DATE_RANGES, LOG_SORT_OPTIONS } from "@/lib/logs/constants";
import type { LogFilters } from "./logs-section";

function SelectWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      {children}
      <svg
        viewBox="0 0 20 20"
        fill="currentColor"
        className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground/50"
      >
        <path
          fillRule="evenodd"
          d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
          clipRule="evenodd"
        />
      </svg>
    </div>
  );
}

const DATE_RANGE_LABELS: Record<LogDateRange, string> = {
  all: "All time",
  "24h": "Last 24 hours",
  "7d": "Last 7 days",
  "30d": "Last 30 days",
};

const selectClass =
  "h-10 w-full appearance-none rounded-xl border border-border/80 bg-background pl-3 pr-8 text-sm outline-none transition cursor-pointer focus:border-foreground/30 focus:ring-4 focus:ring-primary/5";

const labelClass = "text-xs font-medium text-foreground/70";

function SearchField({ value }: { value: string }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor="q" className={labelClass}>
        Search
      </label>
      <div className="relative">
        <svg
          viewBox="0 0 20 20"
          fill="currentColor"
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/40"
        >
          <path
            fillRule="evenodd"
            d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z"
            clipRule="evenodd"
          />
        </svg>
        <input
          id="q"
          name="q"
          type="search"
          defaultValue={value}
          placeholder="Search title or description…"
          className="h-10 w-full rounded-xl border border-border/80 bg-background pl-9 pr-3 text-sm outline-none transition placeholder:text-muted-foreground/40 focus:border-foreground/30 focus:ring-4 focus:ring-primary/5"
        />
      </div>
    </div>
  );
}

function SelectField({
  id,
  name,
  label,
  value,
  children,
}: {
  id: string;
  name: string;
  label: string;
  value: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      <SelectWrapper>
        <select
          id={id}
          name={name}
          defaultValue={value}
          className={selectClass}
        >
          {children}
        </select>
      </SelectWrapper>
    </div>
  );
}

function DateField({
  id,
  name,
  label,
  value,
}: {
  id: string;
  name: string;
  label: string;
  value: string;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      <input
        id={id}
        name={name}
        type="date"
        defaultValue={value}
        className="h-10 w-full rounded-xl border border-border/80 bg-background px-3 text-sm outline-none transition cursor-pointer focus:border-foreground/30 focus:ring-4 focus:ring-primary/5"
      />
    </div>
  );
}

function FiltersHeader({
  hasActiveFilters,
  resultCount,
}: {
  hasActiveFilters: boolean;
  resultCount: number;
}) {
  return (
    <div className="flex items-center justify-between border-b border-border/50 px-5 py-4">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border/70 bg-muted/50">
          <svg
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-3.5 w-3.5 text-muted-foreground"
          >
            <path
              fillRule="evenodd"
              d="M2.628 1.601C5.028 1.206 7.49 1 10 1s4.973.206 7.372.601a.75.75 0 0 1 .628.74v2.288a2.25 2.25 0 0 1-.659 1.59l-4.682 4.683a2.25 2.25 0 0 0-.659 1.59v3.037c0 .684-.31 1.33-.844 1.757l-1.937 1.55A.75.75 0 0 1 9 18.25v-5.757a2.25 2.25 0 0 0-.659-1.591L3.659 6.22A2.25 2.25 0 0 1 3 4.629V2.34a.75.75 0 0 1 .628-.74Z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div>
          <h2 className="text-sm font-semibold tracking-tight">Filters</h2>
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            Narrow the activity feed by team, type, and more.
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {hasActiveFilters ? (
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
        ) : null}
        <span className="rounded-full border border-border/60 bg-muted/50 px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
          {resultCount} {resultCount === 1 ? "result" : "results"}
        </span>
      </div>
    </div>
  );
}

function FiltersActions({
  hasActiveFilters,
  isSubmitting,
}: {
  hasActiveFilters: boolean;
  isSubmitting: boolean;
}) {
  return (
    <div className="flex items-center justify-between border-t border-border/40 pt-3.5">
      <p className="text-[11px] text-muted-foreground">
        {isSubmitting
          ? "Updating results..."
          : hasActiveFilters
          ? "Filtered view — not all logs are shown."
          : "Showing the latest logs across your teams."}
      </p>
      <div className="flex items-center gap-2">
        {hasActiveFilters ? (
          <Link
            href="/dashboard#log-filters"
            className="inline-flex h-8 items-center rounded-lg border border-border/60 bg-background px-3 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            Clear
          </Link>
        ) : null}
        <Button
          type="submit"
          size="sm"
          disabled={isSubmitting}
          className="h-8 rounded-lg px-4"
        >
          {isSubmitting ? "Applying..." : "Apply"}
        </Button>
      </div>
    </div>
  );
}

export function LogFiltersBar({
  teams,
  filters,
  resultCount,
}: {
  teams: { id: string; name: string }[];
  filters: LogFilters;
  resultCount: number;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setIsSubmitting(false);
  }, [filters]);
  const hasActiveFilters =
    Boolean(filters.q) ||
    Boolean(filters.team) ||
    Boolean(filters.type) ||
    Boolean(filters.severity) ||
    Boolean(filters.status) ||
    filters.dateRange !== "all" ||
    filters.sort !== "newest" ||
    Boolean(filters.from) ||
    Boolean(filters.to);

  return (
    <div
      id="log-filters"
      className="rounded-[1.65rem] border border-border/60 bg-card shadow-[0_18px_50px_-28px_rgba(15,23,42,0.32)]"
    >
      <FiltersHeader
        hasActiveFilters={hasActiveFilters}
        resultCount={resultCount}
      />
      <form
        action="/dashboard#log-filters"
        className="space-y-4 p-5"
        onSubmit={() => setIsSubmitting(true)}
      >
        <SearchField value={filters.q} />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <SelectField id="team" name="team" label="Team" value={filters.team}>
            <option value="">All teams</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </SelectField>
          <SelectField id="typeFilter" name="type" label="Type" value={filters.type}>
            <option value="">All types</option>
            <option value="activity">Activity</option>
            <option value="error">Error</option>
            <option value="incident">Incident</option>
          </SelectField>
          <SelectField
            id="severityFilter"
            name="severity"
            label="Severity"
            value={filters.severity}
          >
            <option value="">All severities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </SelectField>
          <SelectField
            id="statusFilter"
            name="status"
            label="Status"
            value={filters.status}
          >
            <option value="">All statuses</option>
            <option value="open">Open</option>
            <option value="in_progress">In progress</option>
            <option value="resolved">Resolved</option>
            <option value="done">Done</option>
          </SelectField>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[repeat(2,minmax(0,1fr))_repeat(2,180px)]">
          <SelectField
            id="dateRangeFilter"
            name="dateRange"
            label="Date range"
            value={filters.dateRange}
          >
            {LOG_DATE_RANGES.map((range) => (
              <option key={range} value={range}>
                {DATE_RANGE_LABELS[range]}
              </option>
            ))}
          </SelectField>
          <SelectField id="sortFilter" name="sort" label="Sort" value={filters.sort}>
            {LOG_SORT_OPTIONS.map((sort) => (
              <option key={sort} value={sort}>
                {sort === "newest" ? "Newest first" : "Oldest first"}
              </option>
            ))}
          </SelectField>
          <DateField id="fromDate" name="from" label="From" value={filters.from} />
          <DateField id="toDate" name="to" label="To" value={filters.to} />
        </div>
        <FiltersActions
          hasActiveFilters={hasActiveFilters}
          isSubmitting={isSubmitting}
        />
      </form>
    </div>
  );
}
