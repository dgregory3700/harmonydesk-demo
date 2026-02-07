// src/lib/demo/data/messages.ts

export type Message = {
  id: string;
  caseId: string | null;
  subject: string;
  body: string;
  createdAt: string;
};

export const demoMessages: Message[] = [
  {
    id: "msg-001",
    caseId: "case-001",
    subject: "Initial intake notes - Smith/Jones",
    body: "Spoke with both parties separately. Both are willing to mediate. Main issue is fence placement and cost sharing. Sarah prefers wood fence, Michael prefers chain link. Need to discuss property line survey results.",
    createdAt: "2026-01-28T09:30:00Z",
  },
  {
    id: "msg-002",
    caseId: "case-002",
    subject: "Anderson Estate - Document review",
    body: "Reviewed estate documents provided by Emily. All three siblings agree on most items. Main contention is the family cabin in the San Juans. Need to explore options: sell and split, one sibling buys out others, or create shared ownership agreement.",
    createdAt: "2026-01-30T14:15:00Z",
  },
  {
    id: "msg-003",
    caseId: "case-004",
    subject: "Martinez case - Security deposit breakdown",
    body: "Carlos provided itemized list of property damage claims totaling $1,850. Jennifer disputes $1,200 of these claims. Need to review photos from move-in and move-out inspections during next session.",
    createdAt: "2026-02-01T11:00:00Z",
  },
  {
    id: "msg-004",
    caseId: null,
    subject: "Reminder: Update court reporting fees",
    body: "Need to review and update court reporting rates for Pierce County. Current rate may not reflect 2026 increases.",
    createdAt: "2026-02-03T08:00:00Z",
  },
  {
    id: "msg-005",
    caseId: "case-001",
    subject: "Smith/Jones - Survey results received",
    body: "Property surveyor confirmed fence location. Actual property line is 6 inches inside where Michael thought it was. This strengthens Sarah's position but both parties still need to agree on fence type and cost sharing.",
    createdAt: "2026-02-05T16:45:00Z",
  },
  {
    id: "msg-006",
    caseId: "case-002",
    subject: "Anderson siblings - Cabin appraisal",
    body: "Professional appraisal came in at $425,000. Robert is interested in buying out his sisters at $141,666 each. Emily and Lisa are discussing this option.",
    createdAt: "2026-02-06T10:20:00Z",
  },
];
