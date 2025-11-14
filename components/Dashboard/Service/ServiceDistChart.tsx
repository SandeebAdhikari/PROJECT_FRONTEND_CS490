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

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const pickArray = <T = unknown,>(
  source: Record<string, unknown>,
  keys: string[]
): T[] | null => {
  for (const key of keys) {
    const candidate = source[key];
    if (Array.isArray(candidate)) {
      return candidate as T[];
    }
  }
  return null;
};

const pickString = (
  source: Record<string, unknown>,
  keys: string[]
): string | undefined => {
  for (const key of keys) {
    const candidate = source[key];
    if (typeof candidate === "string" && candidate.trim().length > 0) {
      return candidate;
    }
  }
  return undefined;
};

const pickNumber = (
  source: Record<string, unknown>,
  keys: string[],
  fallback = 0
): number => {
  for (const key of keys) {
    const candidate = source[key];
    if (typeof candidate === "number") {
      return candidate;
    }
    if (typeof candidate === "string" && candidate.trim() !== "") {
      const asNumber = Number(candidate);
      if (!Number.isNaN(asNumber)) {
        return asNumber;
      }
    }
  }
  return fallback;
};

const mapServicePayload = (payload: unknown): ServiceSlice[] => {
  const payloadRecord = isRecord(payload) ? payload : undefined;

  let collection: unknown[] | null = null;
  if (payloadRecord) {
    collection =
      pickArray(payloadRecord, ["data", "services", "distribution"]) ?? null;
  }

  if (!collection && Array.isArray(payload)) {
    collection = payload;
  }

  if (!collection && payloadRecord) {
    const labels = pickArray<string>(payloadRecord, ["labels", "services"]);
    const values = pickArray<number>(payloadRecord, [
      "values",
      "percentages",
      "counts",
    ]);

    if (labels && values && labels.length === values.length) {
      collection = labels.map((label, index) => ({
        name: label,
        value: values[index],
      }));
    }
  }

  const resolved = (collection ?? [])
    .map((item) => {
      if (isRecord(item)) {
        return item;
      }
      if (typeof item === "string") {
        return { name: item };
      }
      if (typeof item === "number") {
        return { value: item };
      }
      return null;
    })
    .filter((entry): entry is Record<string, unknown> => Boolean(entry));

  return resolved
    .map((item) => ({
      name:
        pickString(item, ["name", "service", "service_name", "label"]) || "",
      value: pickNumber(item, [
        "value",
        "percentage",
        "total",
        "count",
        "appointments",
      ]),
    }))
    .filter(
      (item) => item.name && !Number.isNaN(item.value) && item.value >= 0
    );
};

const MAX_LABEL_LENGTH = 16;
const truncateLabel = (label: string) =>
  label.length > MAX_LABEL_LENGTH
    ? `${label.slice(0, MAX_LABEL_LENGTH - 1)}…`
    : label;

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
