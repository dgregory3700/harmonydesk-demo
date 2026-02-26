import Link from "next/link";
import { DashboardGreeting } from "@/components/dashboard/DashboardGreeting";
import { SessionsOverview } from "@/components/dashboard/SessionsOverview";
import { TodayPanel } from "@/components/dashboard/TodayPanel";
import {
  demoDashboardStats,
  demoUpcomingSessions,
} from "@/lib/demo/data/dashboard";

function pickStat(label: string): number {
  const found = demoDashboardStats.find((s) => s.label === label);
  if (!found) return 0;
  const n = Number(found.value);
  return Number.isFinite(n) ? n : 0;
}

export default function DashboardPage() {
  // Production-parity labels + destinations.
  // Values are sourced from demoDashboardStats (fail-soft to 0).
  const stats: Array<{
    label: string;
    value: number;
    href: string;
    hint: string;
  }> = [
    {
      label: "Upcoming sessions",
      value: pickStat("Upcoming sessions"),
      href: "/calendar",
      hint: "View schedule",
    },
    {
      label: "This week’s sessions",
      value: pickStat("This week’s sessions"),
      href: "/calendar",
      hint: "Plan this week",
    },
    {
      label: "Draft invoices",
      value: pickStat("Draft invoices"),
      href: "/billing",
      hint: "Prepare & send",
    },
    {
      label: "Unsent emails",
      value: pickStat("Unsent emails"),
      href: "/messages",
      hint: "Fix & resend",
    },
  ];

  return (
    <div className="space-y-6">
      <DashboardGreeting />

      {/* Production-parity stat cards (demo-safe) */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="group rounded-2xl border border-slate-800 bg-slate-900/50 px-6 py-4 shadow-sm transition hover:border-slate-700 hover:bg-slate-900/70"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-medium text-slate-400">{s.label}</p>
              <p className="text-[11px] text-slate-500 group-hover:text-slate-300">
                {s.hint} →
              </p>
            </div>

            <p className="mt-2 text-2xl font-semibold text-slate-100">
              {s.value}
            </p>
          </Link>
        ))}
      </div>

      {/* Same layout as production */}
      <div className="grid gap-4 lg:grid-cols-[2fr,1fr]">
        <SessionsOverview sessions={demoUpcomingSessions} />
        <TodayPanel />
      </div>

      {/* Demo truth footer */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 text-xs text-slate-500 shadow-sm">
        <p className="font-medium mb-1 text-slate-400">Demo mode</p>
        <p>
          Sample data (read-only). Stats and lists are illustrative. In
          production, Cases are containers (Active/Closed) and “Upcoming” is
          session-level only.
        </p>
      </div>
    </div>
  );
}
