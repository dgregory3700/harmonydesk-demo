// src/lib/demo/data/invoices.ts

export type InvoiceStatus = "Draft" | "Sent" | "Paid" | "Overdue";

export type Invoice = {
  id: string;
  invoiceNumber: string;
  caseId: string | null;
  caseName: string | null;
  clientName: string;
  amount: number;
  status: InvoiceStatus;
  issueDate: string;
  dueDate: string;
  paidDate: string | null;
  notes: string | null;
};

export const demoInvoices: Invoice[] = [
  {
    id: "inv-001",
    invoiceNumber: "INV-2024-001",
    caseId: "case-003",
    caseName: "Chen & Partners LLC Business Dissolution",
    clientName: "David Chen & Patricia Wong",
    amount: 750.00,
    status: "Paid",
    issueDate: "2026-01-16T00:00:00Z",
    dueDate: "2026-01-30T00:00:00Z",
    paidDate: "2026-01-28T00:00:00Z",
    notes: "3 hours mediation @ $250/hr",
  },
  {
    id: "inv-002",
    invoiceNumber: "INV-2024-002",
    caseId: "case-001",
    caseName: "Smith vs. Jones Property Dispute",
    clientName: "Sarah Smith",
    amount: 250.00,
    status: "Paid",
    issueDate: "2026-01-26T00:00:00Z",
    dueDate: "2026-02-09T00:00:00Z",
    paidDate: "2026-02-05T00:00:00Z",
    notes: "Initial session - Split fee (1 hour @ $250/hr)",
  },
  {
    id: "inv-003",
    invoiceNumber: "INV-2024-003",
    caseId: "case-001",
    caseName: "Smith vs. Jones Property Dispute",
    clientName: "Michael Jones",
    amount: 250.00,
    status: "Paid",
    issueDate: "2026-01-26T00:00:00Z",
    dueDate: "2026-02-09T00:00:00Z",
    paidDate: "2026-02-03T00:00:00Z",
    notes: "Initial session - Split fee (1 hour @ $250/hr)",
  },
  {
    id: "inv-004",
    invoiceNumber: "INV-2024-004",
    caseId: "case-002",
    caseName: "Anderson Family Estate Division",
    clientName: "Anderson Estate (All Parties)",
    amount: 500.00,
    status: "Sent",
    issueDate: "2026-01-30T00:00:00Z",
    dueDate: "2026-02-13T00:00:00Z",
    paidDate: null,
    notes: "Initial session - 2 hours @ $250/hr",
  },
  {
    id: "inv-005",
    invoiceNumber: "INV-2024-005",
    caseId: "case-004",
    caseName: "Martinez Landlord-Tenant Dispute",
    clientName: "Carlos Martinez",
    amount: 187.50,
    status: "Draft",
    issueDate: "2026-02-08T00:00:00Z",
    dueDate: "2026-02-22T00:00:00Z",
    paidDate: null,
    notes: "Initial session - Split fee (0.75 hours @ $250/hr)",
  },
  {
    id: "inv-006",
    invoiceNumber: "INV-2024-006",
    caseId: "case-004",
    caseName: "Martinez Landlord-Tenant Dispute",
    clientName: "Jennifer Thompson",
    amount: 187.50,
    status: "Draft",
    issueDate: "2026-02-08T00:00:00Z",
    dueDate: "2026-02-22T00:00:00Z",
    paidDate: null,
    notes: "Initial session - Split fee (0.75 hours @ $250/hr)",
  },
];
