// src/lib/demo/data/clients.ts

export type Client = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  notes: string | null;
};

export const demoClients: Client[] = [
  {
    id: "client-001",
    name: "Sarah Smith",
    email: "sarah.smith@example.com",
    phone: "(206) 555-0101",
    notes: "Property dispute with neighbor. Prefers morning sessions.",
  },
  {
    id: "client-002",
    name: "Michael Jones",
    email: "m.jones@example.com",
    phone: "(206) 555-0102",
    notes: "Neighbor in property dispute case.",
  },
  {
    id: "client-003",
    name: "Emily Anderson",
    email: "emily.anderson@example.com",
    phone: "(253) 555-0103",
    notes: "Part of Anderson family estate case. Primary contact for siblings.",
  },
  {
    id: "client-004",
    name: "Robert Anderson",
    email: null,
    phone: "(253) 555-0104",
    notes: "Prefers phone communication. Part of estate mediation.",
  },
  {
    id: "client-005",
    name: "Lisa Anderson-Chen",
    email: "lisa.chen@example.com",
    phone: "(425) 555-0105",
    notes: "Attorney representing herself in family estate case.",
  },
  {
    id: "client-006",
    name: "David Chen",
    email: "david@chenpartners.biz",
    phone: "(206) 555-0106",
    notes: "Business dissolution case. Very professional and prepared.",
  },
  {
    id: "client-007",
    name: "Patricia Wong",
    email: "pwong@business.com",
    phone: "(206) 555-0107",
    notes: "Former business partner in LLC dissolution.",
  },
  {
    id: "client-008",
    name: "Carlos Martinez",
    email: "carlos.martinez@proprental.com",
    phone: "(425) 555-0108",
    notes: "Landlord with multiple properties. Experienced with mediation.",
  },
];
