// src/lib/demo/data/sessions.ts

export type MediationSession = {
  id: string;
  userEmail: string;
  caseId: string;
  date: string;
  durationHours: number;
  notes: string | null;
  completed: boolean;
};

export const demoSessions: MediationSession[] = [
  {
    id: "session-001",
    userEmail: "demo@harmonydesk.ai",
    caseId: "case-001",
    date: "2026-02-15T14:00:00Z",
    durationHours: 2,
    notes: "Second session - discuss fence options and cost sharing after survey results.",
    completed: false,
  },
  {
    id: "session-002",
    userEmail: "demo@harmonydesk.ai",
    caseId: "case-002",
    date: "2026-02-12T10:00:00Z",
    durationHours: 2.5,
    notes: "Review cabin appraisal and discuss Robert's buyout offer.",
    completed: false,
  },
  {
    id: "session-003",
    userEmail: "demo@harmonydesk.ai",
    caseId: "case-004",
    date: "2026-02-20T15:30:00Z",
    durationHours: 1.5,
    notes: "Review damage photos and discuss fair resolution for security deposit.",
    completed: false,
  },
  {
    id: "session-004",
    userEmail: "demo@harmonydesk.ai",
    caseId: "case-001",
    date: "2026-01-25T14:00:00Z",
    durationHours: 2,
    notes: "Initial mediation session. Both parties presented their perspectives. Agreed to get property survey before next meeting.",
    completed: true,
  },
  {
    id: "session-005",
    userEmail: "demo@harmonydesk.ai",
    caseId: "case-002",
    date: "2026-01-29T10:00:00Z",
    durationHours: 2,
    notes: "First session with all three Anderson siblings. Reviewed estate assets and identified cabin as main point of contention. Ordered appraisal.",
    completed: true,
  },
  {
    id: "session-006",
    userEmail: "demo@harmonydesk.ai",
    caseId: "case-003",
    date: "2026-01-15T13:00:00Z",
    durationHours: 3,
    notes: "Final session. Reached full agreement on business dissolution terms. Both parties signed settlement agreement.",
    completed: true,
  },
  {
    id: "session-007",
    userEmail: "demo@harmonydesk.ai",
    caseId: "case-004",
    date: "2026-02-08T15:30:00Z",
    durationHours: 1.5,
    notes: "Initial session. Carlos and Jennifer presented their positions. Agreed to exchange photos and documentation before next session.",
    completed: true,
  },
];
