// src/data/runtimeData.ts
// TEMP bridge to prevent UI crashes while migrating from mockData → API

export const currentUser = {
  id: "local-user",
  name: "SOC Analyst",
  email: "analyst@local.dev",
  role: "SOC_ANALYST",
};

export const organizations = [
  {
    id: "primary-org",
    name: "Primary Org",
  },
];
