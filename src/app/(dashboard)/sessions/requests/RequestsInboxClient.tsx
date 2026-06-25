"use client";

import { useEffect, useState } from "react";
import { demoDataClient } from "@/lib/demo/client";
import { DemoDisable } from "@/components/demo/DemoDisable";
import type { DemoSessionRequest } from "@/lib/demo/data/requests";

// --- Inline humanizers (demo copies of @/lib/sessionConstants in live app) ---
function humanizeTimeBlock(block?: string | null): string {
  switch (block) {
    case "morning":
      return "Morning (8am–12pm)";
    case "afternoon":
      return "Afternoon (12pm–5pm)";
    case "evening":
      return "Evening (5pm–8pm)";
    default:
      return "No preference";
  }
}

function humanizeHours(hours?: number | null): string {
  if (!hours || hours <= 0) return "Not specified";
  return `${hours} hour${hours === 1 ? "" : "s"}`;
}

function humanizeMode(mode?: string | null): string {
  switch (mode) {
    case "zoom":
      return "Zoom";
    case "in_person":
      return "In person";
    default:
      return "No preference";
  }
}

function formatYMDForHumans(ymd: string): string {
  const d = new Date(`${ymd}T00:00:00`);
  if (Number.isNaN(d.getTime())) return ymd;
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatReceivedAgo(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "recently";
  const diffMs = Date.now() - then;
  const hour = 60 * 60 * 1000;
  const day = 24 * hour;
  if (diffMs < hour) return "just now";
  if (diffMs < day) {
    const h = Math.round(diffMs / hour);
    return `${h} hour${h === 1 ? "" : "s"} ago`;
  }
  const d = Math.round(diffMs / day);
  return `${d} day${d === 1 ? "" : "s"} ago`;
}

export default function RequestsInboxClient() {
  const [requests, setRequests] = useState<DemoSessionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const data = await demoDataClient.getSessionRequests();
        if (!cancelled) setRequests(data);
      } catch (err: any) {
        if (!cancelled) setError(err?.message ?? "Failed to load requests");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return <p className="text-sm text-slate-500">Loading requests…</p>;
  }

  if (error) {
    return <p className="text-sm text-red-400">{error}</p>;
  }

  if (requests.length === 0) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-8 text-center shadow-sm">
        <h2 className="text-base font-semibold text-slate-100">
          No new requests
        </h2>
        <p className="mt-1 text-sm text-slate-400">
          New session requests from your public request page will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {requests.map((row) => (
        <RequestCard key={row.id} row={row} />
      ))}
    </div>
  );
}

function RequestCard({ row }: { row: DemoSessionRequest }) {
  const dates = row.requested_dates ?? [];
  const summary = row.dispute_summary ?? "";

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0 flex-1 space-y-2">
          <div>
            <p className="text-base font-semibold text-slate-100">
              {row.client_name}
            </p>
            <p className="text-xs text-slate-500">
              received {formatReceivedAgo(row.created_at)}
            </p>
          </div>

          <dl className="grid grid-cols-1 gap-x-6 gap-y-1 text-xs text-slate-400 sm:grid-cols-2">
            {row.client_email && (
              <div>
                <dt className="inline text-slate-500">Email: </dt>
                <dd className="inline text-slate-300">{row.client_email}</dd>
              </div>
            )}
            {row.client_phone && (
              <div>
                <dt className="inline text-slate-500">Phone: </dt>
                <dd className="inline text-slate-300">{row.client_phone}</dd>
              </div>
            )}
            {row.other_party_name && (
              <div>
                <dt className="inline text-slate-500">Other party: </dt>
                <dd className="inline text-slate-300">
                  {row.other_party_name}
                  {row.other_party_email ? ` (${row.other_party_email})` : ""}
                </dd>
              </div>
            )}
            <div>
              <dt className="inline text-slate-500">Time of day: </dt>
              <dd className="inline text-slate-300">
                {humanizeTimeBlock(row.requested_time_block)}
              </dd>
            </div>
            <div>
              <dt className="inline text-slate-500">Estimated length: </dt>
              <dd className="inline text-slate-300">
                {humanizeHours(row.requested_hours)}
              </dd>
            </div>
            <div>
              <dt className="inline text-slate-500">Preferred mode: </dt>
              <dd className="inline text-slate-300">
                {humanizeMode(row.preferred_mode)}
              </dd>
            </div>
          </dl>

          {dates.length > 0 && (
            <div className="text-xs">
              <p className="text-slate-500">Preferred dates:</p>
              <ul className="mt-1 space-y-0.5 text-slate-300">
                {dates.map((d) => (
                  <li key={d}>{formatYMDForHumans(d)}</li>
                ))}
              </ul>
            </div>
          )}

          {summary && (
            <div className="text-xs">
              <p className="text-slate-500">Brief description:</p>
              <p className="mt-1 whitespace-pre-wrap text-slate-300">{summary}</p>
            </div>
          )}
        </div>

        <div className="flex flex-row gap-2 md:flex-col md:items-stretch md:gap-2">
          <DemoDisable message="Demo mode — approving is available in your live workspace.">
            <button
              type="button"
              className="rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-sky-500"
            >
              Approve
            </button>
          </DemoDisable>
          <DemoDisable message="Demo mode — declining is available in your live workspace.">
            <button
              type="button"
              className="rounded-md border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:border-slate-600 hover:bg-slate-700 hover:text-slate-100"
            >
              Decline
            </button>
          </DemoDisable>
        </div>
      </div>
    </div>
  );
}
