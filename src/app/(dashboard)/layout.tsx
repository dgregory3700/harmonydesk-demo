// src/app/(dashboard)/layout.tsx

import type { ReactNode } from "react";
import DashboardShell from "./DashboardShell";

type DashboardLayoutProps = {
  children: ReactNode;
};

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  // Demo repo: NO auth, NO subscription gating, NO Supabase coupling.
  // Keep prop for pixel-identical shell if it expects userEmail.
  return <DashboardShell userEmail={"demo@harmonydesk.ai"}>{children}</DashboardShell>;
}
