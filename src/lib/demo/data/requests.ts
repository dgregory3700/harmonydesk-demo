// src/lib/demo/data/requests.ts
// Seed fixtures for the Session Requests inbox (status='requested' rows).
// Shape mirrors the live pro-dashboard SessionRequestRow so the demo inbox
// renders identically. NO network — pure local data.

export type DemoSessionRequest = {
  id: string;
  client_name: string;
  client_email: string | null;
  client_phone: string | null;
  other_party_name: string | null;
  other_party_email: string | null;
  dispute_summary: string | null;
  requested_dates: string[] | null;
  requested_time_block: string | null; // "morning" | "afternoon" | "evening"
  requested_hours: number | null;
  preferred_mode: string | null; // "zoom" | "in_person"
  created_at: string;
};

export const demoSessionRequests: DemoSessionRequest[] = [
  {
    id: "request-001",
    client_name: "Dana Whitfield",
    client_email: "dana.whitfield@example.com",
    client_phone: "(206) 555-0148",
    other_party_name: "Greg Whitfield",
    other_party_email: "greg.whitfield@example.com",
    dispute_summary:
      "Co-parenting schedule disagreement following separation. We need help agreeing on a consistent weekday/weekend split and a holiday rotation for our two kids before the school year starts.",
    requested_dates: ["2026-03-03", "2026-03-05", "2026-03-09"],
    requested_time_block: "morning",
    requested_hours: 2,
    preferred_mode: "zoom",
    created_at: "2026-02-22T16:40:00Z",
  },
  {
    id: "request-002",
    client_name: "Priya Nair",
    client_email: "priya.nair@example.com",
    client_phone: "(253) 555-0192",
    other_party_name: "Sunrise Landscaping LLC",
    other_party_email: "billing@sunrise-landscaping.example.com",
    dispute_summary:
      "Contract dispute over unfinished backyard hardscaping, roughly $9,400 in question. I'd like a neutral session to work out a completion-or-refund agreement without going to small claims.",
    requested_dates: ["2026-03-04", "2026-03-06"],
    requested_time_block: "afternoon",
    requested_hours: 1.5,
    preferred_mode: "in_person",
    created_at: "2026-02-21T19:05:00Z",
  },
  {
    id: "request-003",
    client_name: "Marcus Bell",
    client_email: "marcus.bell@example.com",
    client_phone: null,
    other_party_name: "Toni Alvarez",
    other_party_email: null,
    dispute_summary:
      "Two-person business partnership winding down. We agree on dissolving but not on how to divide the remaining client accounts and the shared equipment.",
    requested_dates: ["2026-03-10"],
    requested_time_block: "evening",
    requested_hours: 3,
    preferred_mode: "zoom",
    created_at: "2026-02-20T13:15:00Z",
  },
];
