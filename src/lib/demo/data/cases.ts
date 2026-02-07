// src/lib/demo/data/cases.ts

export type CaseStatus = "Open" | "Upcoming" | "Closed";

export type MediationCase = {
  id: string;
  caseNumber: string;
  matter: string;
  parties: string;
  county: string;
  status: CaseStatus;
  nextSessionDate: string | null;
  notes: string | null;
};

export const demoCases: MediationCase[] = [
  {
    id: "case-001",
    caseNumber: "MC-2024-001",
    matter: "Smith vs. Jones Property Dispute",
    parties: "Sarah Smith, Michael Jones",
    county: "King County",
    status: "Open",
    nextSessionDate: "2026-02-15T14:00:00Z",
    notes: "Initial session completed. Parties willing to negotiate boundary fence placement.",
  },
  {
    id: "case-002",
    caseNumber: "MC-2024-002",
    matter: "Anderson Family Estate Division",
    parties: "Emily Anderson, Robert Anderson, Lisa Anderson-Chen",
    county: "Pierce County",
    status: "Upcoming",
    nextSessionDate: "2026-02-12T10:00:00Z",
    notes: "Family mediation regarding inheritance distribution. All parties are cooperative.",
  },
  {
    id: "case-003",
    caseNumber: "MC-2024-003",
    matter: "Chen & Partners LLC Business Dissolution",
    parties: "David Chen, Patricia Wong",
    county: "King County",
    status: "Closed",
    nextSessionDate: null,
    notes: "Successfully mediated business partnership dissolution. Agreement signed and filed.",
  },
  {
    id: "case-004",
    caseNumber: "MC-2024-004",
    matter: "Martinez Landlord-Tenant Dispute",
    parties: "Carlos Martinez (Landlord), Jennifer Thompson (Tenant)",
    county: "Snohomish County",
    status: "Open",
    nextSessionDate: "2026-02-20T15:30:00Z",
    notes: "Dispute over security deposit and property damage. Second session scheduled.",
  },
  {
    id: "case-005",
    caseNumber: "MC-2023-089",
    matter: "Wilson Construction Contract Dispute",
    parties: "Wilson Construction Inc., Oak Street Homeowners",
    county: "King County",
    status: "Closed",
    nextSessionDate: null,
    notes: "Settled after 3 sessions. Payment plan agreed upon for outstanding work.",
  },
];
