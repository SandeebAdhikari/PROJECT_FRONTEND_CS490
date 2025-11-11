export type RevenueSeriesPoint = {
  label: string;
  date: string;
  value: number;
};

export type RevenueSummary = {
  totalRevenue: number;
  avgTicket: number;
  dailyRevenue: number;
  goalProgress: number;
};

export type BookingTrendPoint = {
  label: string;
  date: string;
  total: number;
};

export type BookingTotals = {
  total: number;
  confirmed: number;
  pending: number;
  cancelled: number;
  completed: number;
};

export type PeakHour = {
  label: string;
  bookings: number;
};

export type ServiceRevenueItem = {
  service: string;
  revenue: number;
  bookings: number;
  average: number;
};

export type ServiceDistributionItem = {
  name: string;
  value: number;
  percent: number;
};

export type StaffPerformanceEntry = {
  name: string;
  revenue: number;
  rating: number;
  efficiency: number;
};

export type StaffHighlights = {
  topPerformer: { name: string; revenue: number } | null;
  highestRating: { name: string; rating: number } | null;
  mostEfficient: { name: string; efficiency: number } | null;
};

export type RetentionPoint = {
  ym: string;
  month: string;
  retention: number;
  customers: number;
};

export type CustomerValueTier = {
  label: string;
  avg: number;
};

export type GrowthPoint = {
  month: string;
  revenue: number;
  customers: number;
  retention: number;
};

export type GrowthSummary = {
  revenueGrowth: number;
  customerGrowth: number;
  retentionGrowth: number;
};

export type DashboardAnalytics = {
  revenue: {
    summary: RevenueSummary;
    series: RevenueSeriesPoint[];
  };
  bookings: {
    trend: BookingTrendPoint[];
    totals: BookingTotals;
  };
  peakHours: PeakHour[];
  serviceRevenue: ServiceRevenueItem[];
  serviceDistribution: ServiceDistributionItem[];
  staffPerformance: {
    chart: StaffPerformanceEntry[];
    highlights: StaffHighlights;
  };
  customerRetention: {
    chart: RetentionPoint[];
    retentionRate: number;
    newCustomers: number;
  };
  customerValue: {
    avgLtv: number;
    avgVisitsPerYear: number;
    tiers: CustomerValueTier[];
    totalCustomerValue: number;
    activeCustomers: number;
  };
  growthOverview: {
    chart: GrowthPoint[];
    summary: GrowthSummary;
  };
};
