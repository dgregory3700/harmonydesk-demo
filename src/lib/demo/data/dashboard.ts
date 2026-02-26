// src/lib/demo/data/dashboard.ts
//
// Production-parity dashboard stats for the demo.
// Demo is read-only and uses local sample values.

export const demoDashboardStats = [
  { label: "Upcoming sessions", value: 5 },
  { label: "This week’s sessions", value: 7 },
  { label: "Draft invoices", value: 2 },
  { label: "Unsent emails", value: 1 },
] as const;

export type DemoDashboardStat = (typeof demoDashboardStats)[number];

// SessionsOverview demo data (shape mirrors production SessionsOverview input)
export type DemoUpcomingSession = {
  id: string;
  caseId: string;
  date: string; // ISO
  completed: boolean;
  durationHours?: number;
  notes?: string | null;
  caseLabel?: string;
};

export const demoUpcomingSessions: DemoUpcomingSession[] = [
  {
    id: "sess-001",
    caseId: "case-001",
    date: "2026-02-27T15:00:00Z",
    completed: false,
    durationHours: 2,
    caseLabel: "MC-2024-001 • Smith vs. Jones Property Dispute",
    notes: "Session 2 — boundary proposal review.",
  },
  {
    id: "sess-002",
    caseId: "case-004",
    date: "2026-02-28T18:30:00Z",
    completed: false,
    durationHours: 1.5,
    caseLabel: "MC-2024-004 • Martinez Landlord-Tenant Dispute",
    notes: "Deposit dispute — evidence review.",
  },
  {
    id: "sess-003",
    caseId: "case-002",
    date: "2026-03-01T17:00:00Z",
    completed: false,
    durationHours: 1,
    caseLabel: "MC-2024-002 • Anderson Family Estate Division",
    notes: "Agenda + caucus readiness.",
  },
];
