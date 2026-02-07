"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  FolderKanban,
  FileText,
  MessageCircle,
  Link2,
  Users,
  Settings,
} from "lucide-react";

const STRIPE_CHECKOUT_URL = process.env.NEXT_PUBLIC_STRIPE_CHECKOUT_URL ?? "";

type Props = {
  children: ReactNode;
  userEmail: string; // kept for compatibility with existing layout; ignored in demo UI
};

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/calendar", label: "Calendar", icon: Calendar },
  { href: "/cases", label: "Cases", icon: FolderKanban },
  { href: "/billing", label: "Billing & Courts", icon: FileText },
  { href: "/messages", label: "Messages", icon: MessageCircle },
  { href: "/booking-links", label: "Booking links", icon: Link2 },
  { href: "/clients", label: "Clients", icon: Users },
  { href: "/settings", label: "Settings", icon: Settings },
];

// --- DARK MODE STYLING ---
const baseLink =
  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors";
const activeLink = "bg-sky-500/10 text-sky-400";
const inactiveLink = "text-slate-400 hover:bg-slate-800 hover:text-slate-200";

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
                (item.href !== "/dashboard" && pathname.startsWith(item.href));

              const className = `${baseLink} ${
                isActive ? activeLink : inactiveLink
              }`;

              return (
                <Link key={item.href} href={item.href} className={className}>
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
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
              <span className="text-xs text-slate-500">
                Demo mode — Sample data (read-only)
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
