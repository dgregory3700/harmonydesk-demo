// src/lib/demo/data/documents.ts
// Seed fixtures for the Court Documents library. Shape mirrors the live
// document_templates rows so the demo library + generate UI render
// identically. NO network — pure local data. Generation is disabled in demo.

export type DemoDocumentTemplate = {
  id: string;
  name: string;
  filename: string;
  tokens: string[];
  token_labels: Record<string, string>;
  county: string | null;
  court: string | null;
  created_at: string;
};

export const demoDocumentTemplates: DemoDocumentTemplate[] = [
  {
    id: "template-001",
    name: "Mediator's Report — Full Agreement",
    filename: "mediators-report-full-agreement.docx",
    tokens: [
      "{{case_number}}",
      "{{petitioner_name}}",
      "{{respondent_name}}",
      "{{county}}",
      "{{session_date_long}}",
      "{{mediator_name}}",
      "{{mediator_business_name}}",
      "{{agreement_summary}}",
    ],
    token_labels: {
      "{{case_number}}": "Case Number",
      "{{petitioner_name}}": "Petitioner Name",
      "{{respondent_name}}": "Respondent Name",
      "{{county}}": "County",
      "{{session_date_long}}": "Session Date",
      "{{mediator_name}}": "Mediator Name",
      "{{mediator_business_name}}": "Mediator Business Name",
      "{{agreement_summary}}": "Agreement Summary",
    },
    county: "King County",
    court: "Superior Court",
    created_at: "2026-01-12T18:00:00Z",
  },
  {
    id: "template-002",
    name: "Mediation Certificate of Completion",
    filename: "certificate-of-completion.docx",
    tokens: [
      "{{case_number}}",
      "{{petitioner_name}}",
      "{{respondent_name}}",
      "{{session_date_long}}",
      "{{mediator_name}}",
    ],
    token_labels: {
      "{{case_number}}": "Case Number",
      "{{petitioner_name}}": "Petitioner Name",
      "{{respondent_name}}": "Respondent Name",
      "{{session_date_long}}": "Session Date",
      "{{mediator_name}}": "Mediator Name",
    },
    county: "Pierce County",
    court: "District Court",
    created_at: "2026-01-20T17:30:00Z",
  },
  {
    id: "template-003",
    name: "Impasse / No-Agreement Notice",
    filename: "impasse-notice.docx",
    tokens: [
      "{{case_number}}",
      "{{county}}",
      "{{session_date_long}}",
      "{{mediator_name}}",
      "{{next_steps}}",
    ],
    token_labels: {
      "{{case_number}}": "Case Number",
      "{{county}}": "County",
      "{{session_date_long}}": "Session Date",
      "{{mediator_name}}": "Mediator Name",
      "{{next_steps}}": "Next Steps",
    },
    county: null,
    court: null,
    created_at: "2026-02-02T15:10:00Z",
  },
];
