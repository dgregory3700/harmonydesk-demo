// src/lib/demo/data/counties.ts

export type County = {
  id: string;
  name: string;
  reportFormat: "csv" | "pdf";
};

export const demoCounties: County[] = [
  { id: "county-king", name: "King County", reportFormat: "csv" },
  { id: "county-pierce", name: "Pierce County", reportFormat: "pdf" },
  { id: "county-snohomish", name: "Snohomish County", reportFormat: "csv" },
];
