export type PlatformSnapshot = {
  ok: boolean;
  warning?: string;
  source: "supabase" | "degraded";
  badges: Record<string, string | number>;
  overview: {
    totalRevenue: number;
    totalUsers: number;
    freelancers: number;
    clients: number;
    activeProjects: number;
    totalJobs: number;
    totalPayments: number;
    platformFee: number;
    escrowHeld: number;
    totalPayouts: number;
    newUsers: number;
    newFreelancers: number;
  };
  users: Array<Record<string, unknown>>;
  freelancers: Array<Record<string, unknown>>;
  clients: Array<Record<string, unknown>>;
  projects: Array<Record<string, unknown>>;
  jobs: Array<Record<string, unknown>>;
  proposals: Array<Record<string, unknown>>;
  invoices: Array<Record<string, unknown>>;
  payments: Array<Record<string, unknown>>;
  escrow: Array<Record<string, unknown>>;
  connect: {
    profiles: Array<Record<string, unknown>>;
    needs: Array<Record<string, unknown>>;
    requests: Array<Record<string, unknown>>;
  };
  events: Array<Record<string, unknown>>;
  tickets: number;
  disputes: number;
  flags: Array<Record<string, unknown>>;
};
