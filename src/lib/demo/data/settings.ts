// src/lib/demo/data/settings.ts

export type UserSettings = {
  id: string | null;
  userEmail: string;

  fullName: string | null;
  phone: string | null;

  businessName: string | null;
  businessAddress: string | null;

  defaultHourlyRate: number | null;

  // legacy (string) kept only for older demo screens that still render it
  defaultCounty: string | null;

  // new deterministic default (uuid-ish string in demo)
  defaultCountyId: string | null;

  defaultSessionDuration: number | null;
  timezone: string | null;

  // kept for backwards compatibility (theme is fixed; demo should not mutate it)
  darkMode: boolean;
};

export const demoUserSettings: UserSettings = {
  id: "settings-demo",
  userEmail: "demo@harmonydesk.ai",

  fullName: "Demo Mediator",
  phone: "(206) 555-0100",

  businessName: "HarmonyDesk Demo Mediation Services",
  businessAddress: "123 Demo Street\nSeattle, WA 98101",

  defaultHourlyRate: 250,

  // legacy
  defaultCounty: "King County",

  // new
  defaultCountyId: "county-king",

  defaultSessionDuration: 2,
  timezone: "America/Los_Angeles",

  darkMode: true,
};
