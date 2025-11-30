import React, { useCallback, useEffect, useState } from "react";
import { Download, Plus } from "lucide-react";
import SalonDashboardCard from "./SalonDashboardCard";
import { icons } from "@/libs/dashboard/dashboard.icons";
import { fetchWithRefresh } from "@/libs/api/fetchWithRefresh";
import { API_ENDPOINTS } from "@/libs/api/config";
import useSalonId from "@/hooks/useSalonId";

type IconName = keyof typeof icons;

type OverviewMetrics = {
  totalRevenue: number;
  totalRevenuePrev: number;
  appointments: number;
  appointmentsPrev: number;
  newCustomers: number;
  newCustomersPrev: number;
  avgRating: number;
  avgRatingPrev: number;
  staffUtilization: number;
  customerRetention: number;
};

const defaultOverview: OverviewMetrics = {
  totalRevenue: 0,
  totalRevenuePrev: 0,
  appointments: 0,
  appointmentsPrev: 0,
  newCustomers: 0,
  newCustomersPrev: 0,
  avgRating: 0,
  avgRatingPrev: 0,
  staffUtilization: 0,
  customerRetention: 0,
};

type CardConfig = {
  id: string;
  title: string;
  icon: IconName;
  valueKey: keyof OverviewMetrics;
  prevKey?: keyof OverviewMetrics;
  formatter: (value: number) => string;
  subtextBuilder: (current: number, previous?: number) => string;
};

const formatCurrency = (value: number) =>
  `$${Number(value || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const formatInteger = (value: number) => Number(value || 0).toLocaleString();

const formatPercent = (value: number) =>
  `${(Number(value || 0) * 100).toFixed(1)}%`;

const formatRating = (value: number) => `${Number(value || 0).toFixed(1)}/5`;

const cardConfigs: CardConfig[] = [
  {
    id: "revenue",
    title: "Total Revenue",
    icon: "DollarSign",
    valueKey: "totalRevenue",
    prevKey: "totalRevenuePrev",
    formatter: formatCurrency,
    subtextBuilder: (_current, previous = 0) =>
      `Prev: ${formatCurrency(previous)}`,
  },
  {
    id: "appointments",
    title: "Appointments",
    icon: "CalendarDays",
    valueKey: "appointments",
    prevKey: "appointmentsPrev",
    formatter: formatInteger,
    subtextBuilder: (_current, previous = 0) =>
      `Prev: ${formatInteger(previous)}`,
  },
  {
    id: "customers",
    title: "New Customers",
    icon: "Users",
    valueKey: "newCustomers",
    prevKey: "newCustomersPrev",
    formatter: formatInteger,
    subtextBuilder: (_current, previous = 0) =>
      `Prev: ${formatInteger(previous)}`,
  },
  {
    id: "rating",
    title: "Avg Rating",
    icon: "Star",
    valueKey: "avgRating",
    prevKey: "avgRatingPrev",
    formatter: formatRating,
    subtextBuilder: (_current, previous = 0) =>
      `Prev: ${formatRating(previous)}`,
  },
  {
    id: "utilization",
    title: "Staff Utilization",
    icon: "Activity",
    valueKey: "staffUtilization",
    formatter: formatPercent,
    subtextBuilder: () => "Share of staffed minutes used",
  },
  {
    id: "retention",
    title: "Customer Retention",
    icon: "UserCheck",
    valueKey: "customerRetention",
    formatter: formatPercent,
    subtextBuilder: () => "Repeat customers (last 6 months)",
  },
];

const formatChange = (current: number, previous?: number): string => {
  if (previous === undefined || previous === null) return "+0%";
  if (previous === 0) {
    if (current === 0) return "+0%";
    return "+100%";
  }
  const delta = ((current - previous) / Math.abs(previous)) * 100;
  const safeDelta = Number.isFinite(delta) ? delta : 0;
  const rounded = safeDelta.toFixed(1);
  return `${safeDelta >= 0 ? "+" : ""}${rounded}%`;
};

const getTrendIconName = (change: string): IconName =>
  change.startsWith("-") ? "TrendingDown" : "TrendingUp";

const SalonDashboard = () => {
  const { salonId, loadingSalon, ownerName } = useSalonId();
  const [overview, setOverview] = useState<OverviewMetrics>(defaultOverview);
  const [loadingMetrics, setLoadingMetrics] = useState(false);
  const [error, setError] = useState("");

  const loadOverview = useCallback(async () => {
    if (!salonId) return;
    setLoadingMetrics(true);
    setError("");
    try {
      const params = new URLSearchParams({
        salonId: String(salonId),
        range: "lifetime",
      });
      const res = await fetchWithRefresh(
        API_ENDPOINTS.ANALYTICS.OVERVIEW(salonId, params.toString()),
        { credentials: "include" }
      );
      const payload = await res.json();
      if (!res.ok || !payload?.data) {
        throw new Error(
          payload?.message ||
            payload?.error ||
            "Failed to load overview metrics"
        );
      }
      setOverview({
        ...defaultOverview,
        ...payload.data,
      });
    } catch (err) {
      console.error("Error loading overview metrics:", err);
      setError(
        err instanceof Error ? err.message : "Unable to load lifetime metrics"
      );
    } finally {
      setLoadingMetrics(false);
    }
  }, [salonId]);

  useEffect(() => {
    if (salonId) {
      loadOverview();
    }
  }, [salonId, loadOverview]);

  const greetingName = ownerName ? ownerName.split(" ")[0] : "";
  const cards = cardConfigs.map((config) => {
    const current = Number(overview[config.valueKey]) || 0;
    const previous =
      config.prevKey && overview[config.prevKey] !== undefined
        ? Number(overview[config.prevKey]) || 0
        : undefined;

    const change = formatChange(current, previous);
    const Icon = icons[config.icon];
    const TrendIcon = icons[getTrendIconName(change)];

    return {
      id: config.id,
      title: config.title,
      value: config.formatter(current),
      subtext: config.subtextBuilder(current, previous),
      change,
      icon: Icon,
      trendIcon: TrendIcon,
    };
  });

  return (
    <div className="p-4 sm:px-8">
      <div className="sm:flex sm:justify-between w-full">
        <div>
          <h1 className="text-xl sm:text-3xl lg:text-4xl font-extrabold">
            Welcome{greetingName ? `, ${greetingName}` : ""}!
          </h1>
          <p className="text-muted-foreground font-inter text-base mt-2 sm:text-lg">
            Lifetime performance snapshot for your salon.
          </p>
        </div>

        <div className="flex mt-3 gap-2">
          <div className="relative">
            <Download className="absolute w-4 h-4 top-3 left-3 sm:top-4 sm:left-4" />
            <button className="border border-border rounded-lg py-3 px-4 text-xs sm:text-sm font-inter font-semibold hover:cursor-pointer hover:bg-accent shadow-soft-br">
              <span className="sm:hidden ml-6">Export</span>
              <span className="hidden sm:flex ml-6">Export Report</span>
            </button>
          </div>

          <div className="relative transition-smooth hover:scale-108">
            <Plus className="absolute w-4 h-4 top-3 left-3 text-white sm:top-4 sm:left-4" />
            <button className="border border-border rounded-lg py-3 px-4 text-xs sm:text-sm font-inter font-semibold bg-primary-light text-white hover:cursor-pointer shadow-soft-br">
              <span className="sm:hidden ml-6">Actions</span>
              <span className="hidden sm:flex ml-6">Quick Actions</span>
            </button>
          </div>
        </div>
      </div>

      {loadingSalon || loadingMetrics ? (
        <p className="text-sm text-muted-foreground mt-4">
          Loading lifetime metrics…
        </p>
      ) : null}
      {error && <p className="text-sm text-destructive mt-2">{error}</p>}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mt-6">
        {cards.map((card) => (
          <SalonDashboardCard
            key={card.id}
            title={card.title}
            value={card.value}
            subtext={card.subtext}
            change={card.change}
            icon={card.icon}
            trendIcon={card.trendIcon}
          />
        ))}
      </div>
    </div>
  );
};

export default SalonDashboard;
