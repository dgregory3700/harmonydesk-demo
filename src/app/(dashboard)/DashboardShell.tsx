"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  Inbox,
  FileText,
  ScrollText,
  MessageCircle,
  Users,
  Settings,
} from "lucide-react";
import { demoSessionRequests } from "@/lib/demo/data/requests";

const STRIPE_CHECKOUT_URL = process.env.NEXT_PUBLIC_STRIPE_CHECKOUT_URL ?? "";

// Static, seed-derived count for the Session Requests badge. The live app
// polls a cookie-bound /api/requests/count endpoint; the demo has no backend,
// so the badge simply reflects the number of seeded inbound requests.
const REQUEST_COUNT = demoSessionRequests.length;

type Props = {
  children: ReactNode;
  userEmail: string; // kept for compatibility with existing layout; ignored in demo UI
};

// Nav mirrors the live SURFACED set (harmonydesk-pro-dashboard @ ad0eea2):
// Overview, Sessions (/calendar = canonical sessions list), Session Requests,
// Billing & Courts, Documents, Messages, Clients, Settings.
// Cases / Intake / booking-links are HIDDEN exactly as in the live app —
// attorney-coded / dead Cal.com surfaces.
const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/calendar", label: "Sessions", icon: Calendar },
  { href: "/sessions/requests", label: "Session Requests", icon: Inbox },
  // { href: "/cases", label: "Cases" } — hidden (attorney-coded surface).
  { href: "/billing", label: "Billing & Courts", icon: FileText },
  { href: "/documents", label: "Documents", icon: ScrollText },
  { href: "/messages", label: "Messages", icon: MessageCircle },
  // Booking links intentionally hidden — Cal.com concept, removed in live app.
  { href: "/clients", label: "Clients", icon: Users },
  { href: "/settings", label: "Settings", icon: Settings },
];

// --- DARK MODE STYLING ---
const baseLink =
  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors";
const activeLink = "bg-sky-500/10 text-sky-400";
const inactiveLink =
  "text-slate-400 hover:bg-slate-800 hover:text-slate-200";

export default function DashboardShell({ children }: Props) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <div className="mx-auto flex max-w-7xl">
        <aside className="hidden w-64 border-r border-slate-800 bg-slate-900/50 px-4 py-6 md:block">
          <div className="mb-6 px-2">
            <span className="text-lg font-semibold text-slate-100">
              <span className="text-sky-500">Harmony</span>Desk
            </span>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;

              const isActive =
                pathname === item.href ||
                (item.href !== "/dashboard" &&
                  pathname.startsWith(item.href));

              const className = `${baseLink} ${
                isActive ? activeLink : inactiveLink
              }`;

              const showBadge =
                item.href === "/sessions/requests" && REQUEST_COUNT > 0;

              return (
                <Link key={item.href} href={item.href} className={className}>
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                  {showBadge && (
                    <span
                      aria-label={`${REQUEST_COUNT} pending request${
                        REQUEST_COUNT === 1 ? "" : "s"
                      }`}
                      className="ml-auto rounded-full bg-sky-500/20 px-2 py-0.5 text-[10px] font-semibold text-sky-300"
                    >
                      {REQUEST_COUNT}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          <footer className="mt-8 px-2 text-xs text-slate-500">
            © {new Date().getFullYear()} HarmonyDesk
          </footer>
        </aside>

        <main className="flex-1">
          <header className="flex items-center justify-between border-b border-slate-800 bg-slate-950 px-4 py-3 md:px-6">
            <div className="flex flex-col">
              <h1 className="text-sm font-medium text-slate-400">
                HarmonyDesk dashboard
              </h1>

              {/* Demo Banner */}
              <span className="text-xs text-slate-500">
                Demo mode — sample data (read-only)
              </span>
              <span className="mt-0.5 text-sm font-semibold text-amber-300">
                Demo v1.4 — your paid dashboard may be newer.
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href={STRIPE_CHECKOUT_URL || "#"}
                className={[
                  "rounded-md px-3 py-1.5 text-sm font-semibold",
                  STRIPE_CHECKOUT_URL
                    ? "bg-sky-500 text-slate-950 hover:opacity-90"
                    : "bg-slate-800 text-slate-400 opacity-60 cursor-not-allowed",
                ].join(" ")}
                aria-disabled={!STRIPE_CHECKOUT_URL}
                onClick={(e) => {
                  if (!STRIPE_CHECKOUT_URL) e.preventDefault();
                }}
                title={
                  STRIPE_CHECKOUT_URL
                    ? "Start HarmonyDesk"
                    : "Set NEXT_PUBLIC_STRIPE_CHECKOUT_URL in Vercel"
                }
              >
                Start HarmonyDesk
              </Link>
            </div>
          </header>

          <div className="px-4 py-6 md:px-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
