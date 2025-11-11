"use client";

import React, { useEffect, useMemo, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { PieChart as PieIcon } from "lucide-react";
import { fetchWithRefresh } from "@/libs/api/fetchWithRefresh";
import useSalonId from "@/hooks/useSalonId";

type ServiceSlice = {
  name: string;
  value: number;
};

type ChartSlice = {
  name: string; // truncated label for chart display
  fullName: string;
  rawValue: number;
  value: number; // percentage
};

const COLORS = [
  "hsl(260, 85%, 65%)",
  "hsl(190, 80%, 55%)",
  "hsl(160, 60%, 50%)",
  "hsl(40, 90%, 55%)",
  "hsl(0, 80%, 60%)",
  "hsl(320, 70%, 65%)",
  "hsl(120, 55%, 45%)",
  "hsl(30, 75%, 60%)",
];

const mapServicePayload = (payload: unknown): ServiceSlice[] => {
  let collection =
    (payload &&
      typeof payload === "object" &&
      (Array.isArray((payload as any).data)
        ? (payload as any).data
        : Array.isArray((payload as any).services)
        ? (payload as any).services
        : Array.isArray((payload as any).distribution)
        ? (payload as any).distribution
        : null)) ||
    (Array.isArray(payload) ? payload : null);

  if (!collection && payload && typeof payload === "object") {
    const labels = Array.isArray((payload as any).labels)
      ? (payload as any).labels
      : Array.isArray((payload as any).services)
      ? (payload as any).services
      : null;
    const values = Array.isArray((payload as any).values)
      ? (payload as any).values
      : Array.isArray((payload as any).percentages)
      ? (payload as any).percentages
      : Array.isArray((payload as any).counts)
      ? (payload as any).counts
      : null;

    if (labels && values && labels.length === values.length) {
      collection = labels.map((label, index) => ({
        name: label,
        value: values[index],
      }));
    }
  }

  const resolved = collection || [];

  return resolved
    .map((item: any) => ({
      name:
        String(
          item?.name ??
            item?.service ??
            item?.service_name ??
            item?.label ??
            ""
        ).trim() || "",
      value: Number(
        item?.value ??
          item?.percentage ??
          item?.total ??
          item?.count ??
          item?.appointments ??
          0
      ),
    }))
    .filter((item) => item.name && !Number.isNaN(item.value) && item.value >= 0);
};

const MAX_LABEL_LENGTH = 16;
const truncateLabel = (label: string) =>
  label.length > MAX_LABEL_LENGTH ? `${label.slice(0, MAX_LABEL_LENGTH - 1)}…` : label;

const ServiceDistribution = () => {
  const { salonId, loadingSalon } = useSalonId();
  const [slices, setSlices] = useState<ServiceSlice[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!salonId) return;
    let ignore = false;

    const loadDistribution = async () => {
      setLoading(true);
      setError("");

      try {
        const params = new URLSearchParams({
          salonId: String(salonId),
          salon_id: String(salonId),
        }).toString();
        const res = await fetchWithRefresh(
          `${process.env.NEXT_PUBLIC_API_URL}/api/analytics/service-distribution?${params}`,
          { credentials: "include" }
        );
        const payload = await res.json();

        if (!res.ok) {
          throw new Error(
            payload?.error ||
              payload?.message ||
              "Failed to load service distribution"
          );
        }

        const mapped = mapServicePayload(payload);
        if (!ignore) {
          setSlices(mapped);
        }
      } catch (err) {
        console.error("Error fetching service distribution:", err);
        if (!ignore) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load service distribution"
          );
          setSlices([]);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    loadDistribution();

    return () => {
      ignore = true;
    };
  }, [salonId]);

  const chartData = useMemo<ChartSlice[]>(() => {
    if (slices.length === 0) return [];
    const total = slices.reduce((sum, slice) => sum + slice.value, 0);
    if (total === 0) return [];
    return slices.map((slice) => {
      const percentage = Number(((slice.value / total) * 100).toFixed(2));
      return {
        name: truncateLabel(slice.name),
        rawValue: slice.value,
        value: percentage,
        fullName: slice.name,
      };
    });
  }, [slices]);

  return (
    <div className=" rounded-2xl bg-secondary border border-border p-4 shadow-soft-br font-inter transition-smooth">
      <div className="flex items-center gap-2 mb-4">
        <PieIcon className="w-5 h-5 text-color-primary-dark" />
        <h2 className="text-lg font-bold text-color-foreground">
          Service Distribution
        </h2>
      </div>

      <div className="h-[240px] flex justify-center items-center text-center">
        {loading || loadingSalon ? (
          <p className="text-sm text-muted-foreground">Loading services…</p>
        ) : error ? (
          <p className="text-sm text-destructive">{error}</p>
        ) : chartData.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No service distribution data available.
          </p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, value, payload }) =>
                  `${name}: ${value}%${
                    payload?.rawValue || payload?.rawValue === 0
                      ? ` (${payload.rawValue})`
                      : ""
                  }`
                }
                labelLine={true}
                stroke="hsl(var(--color-background))"
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${entry.name}-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number, name, entry) => [
                  `${Number(value).toFixed(2)}%${
                    entry?.payload?.rawValue || entry?.payload?.rawValue === 0
                      ? ` (${entry.payload.rawValue})`
                      : ""
                  }`,
                  entry?.payload?.fullName || name,
                ]}
                contentStyle={{
                  backgroundColor: "hsl(var(--color-card))",
                  border: "1px solid hsl(var(--color-border))",
                  borderRadius: "var(--radius)",
                  boxShadow: "var(--shadow-soft)",
                  fontSize: "0.75rem",
                }}
                itemStyle={{ color: "hsl(var(--color-foreground))" }}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default ServiceDistribution;
