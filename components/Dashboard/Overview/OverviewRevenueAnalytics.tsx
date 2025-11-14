"use client";

import React, { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { fetchWithRefresh } from "@/libs/api/fetchWithRefresh";
import useSalonId from "@/hooks/useSalonId";
import {
  toFullDateLabel,
  toShortDateLabel,
} from "@/libs/formatters/dateLabels";

type RevenuePoint = {
  day: string;
  value: number;
  rawLabel: string;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const pickArray = <T = unknown>(
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

const transformRevenuePayload = (payload: unknown) => {
  const payloadRecord = isRecord(payload) ? payload : undefined;

  let rawSeries: unknown[] | null = null;
  if (payloadRecord) {
    rawSeries =
      pickArray(payloadRecord, ["data", "revenue", "points", "results"]) ?? null;
  }

  if (!rawSeries && Array.isArray(payload)) {
    rawSeries = payload;
  }

  if (!rawSeries && payloadRecord) {
    const labels = pickArray<string>(payloadRecord, ["labels", "days"]);
    const values = pickArray<number>(payloadRecord, [
      "values",
      "amounts",
      "revenues",
    ]);
    if (labels && values && labels.length === values.length) {
      rawSeries = labels.map((label, index) => ({
        day: label,
        value: values[index],
      }));
    }
  }

  const normalizedEntries = (rawSeries ?? [])
    .map((entry) => {
      if (isRecord(entry)) {
        return entry;
      }
      if (typeof entry === "number") {
        return { value: entry };
      }
      if (typeof entry === "string") {
        return { day: entry };
      }
      return null;
    })
    .filter((entry): entry is Record<string, unknown> => Boolean(entry));

  const periodLabel =
    (payloadRecord &&
      (pickString(payloadRecord, [
        "period",
        "label",
        "period_label",
        "range",
        "timeframe",
      ]) ||
        undefined)) ||
    "Last 7 days";

  const parsed: RevenuePoint[] = normalizedEntries
    .map((entry) => {
      const rawLabel =
        pickString(entry, ["day", "date", "label", "name", "dt"]) || "";
      const readableLabel = rawLabel ? toShortDateLabel(rawLabel) : "";
      return {
        day: readableLabel || rawLabel,
        rawLabel: rawLabel || readableLabel,
        value: pickNumber(entry, [
          "value",
          "amount",
          "total",
          "revenue",
          "count",
        ]),
      };
    })
    .filter((entry) => entry.day);

  return { periodLabel, parsed };
};

const OverviewRevenueAnalytics = () => {
  const { salonId, loadingSalon } = useSalonId();
  const [data, setData] = useState<RevenuePoint[]>([]);
  const [periodLabel, setPeriodLabel] = useState("Last 7 days");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!salonId) return;
    let ignore = false;

    const loadRevenue = async () => {
      setLoading(true);
      setError("");

      try {
        const params = new URLSearchParams({
          salonId: String(salonId),
          salon_id: String(salonId),
        }).toString();
        const res = await fetchWithRefresh(
          `${process.env.NEXT_PUBLIC_API_URL}/api/analytics/revenue-series?${params}`,
          { credentials: "include" }
        );
        const payload = await res.json();

        if (!res.ok) {
          throw new Error(payload?.error || "Failed to load revenue analytics");
        }

        const { periodLabel: label, parsed } = transformRevenuePayload(payload);
        if (!ignore) {
          setData(parsed);
          setPeriodLabel(label || "Last 7 days");
        }
      } catch (err) {
        console.error("Error fetching revenue analytics:", err);
        if (!ignore) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load revenue analytics"
          );
          setData([]);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    loadRevenue();

    return () => {
      ignore = true;
    };
  }, [salonId]);

  const averageValue =
    data.length > 0
      ? data.reduce((acc, point) => acc + point.value, 0) / data.length
      : null;

  return (
    <div className="rounded-2xl bg-secondary border border-border p-4 shadow-soft-br font-inter transition-smooth">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold text-color-primary-dark">
            $
          </span>
          <h2 className="text-lg font-bold text-color-foreground">
            Revenue Analytics
          </h2>
        </div>
        <span className="px-3 py-1 rounded-full text-xs bg-color-muted text-color-subtle-foreground">
          {loadingSalon || loading ? "Loading…" : periodLabel}
        </span>
      </div>

      <div className="h-[245px] flex items-center justify-center">
        {loading || loadingSalon ? (
          <p className="text-sm text-muted-foreground">Loading revenue data…</p>
        ) : error ? (
          <p className="text-sm text-destructive text-center">{error}</p>
        ) : data.length === 0 ? (
          <p className="text-sm text-muted-foreground">No revenue data available.</p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor="hsl(var(--color-primary))"
                    stopOpacity={0.4}
                  />
                  <stop
                    offset="100%"
                    stopColor="hsl(var(--color-primary))"
                    stopOpacity={0.05}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="hsl(var(--color-border))"
                opacity={0.3}
              />
              <XAxis
                dataKey="day"
                tick={{
                  fontSize: 10,
                  fill: "hsl(var(--color-subtle-foreground))",
                }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => value}
                minTickGap={12}
              />
              <YAxis
                tick={{
                  fontSize: 9,
                  fill: "hsl(var(--color-subtle-foreground))",
                }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => `$${Number(value).toFixed(0)}`}
              />
              <Tooltip
                labelFormatter={(value, payload) => {
                  const raw = payload?.[0]?.payload?.rawLabel;
                  return raw ? toFullDateLabel(raw) : value;
                }}
                formatter={(value: number) => [
                  `$${Number(value).toFixed(2)}`,
                  "Revenue",
                ]}
                contentStyle={{
                  backgroundColor: "hsl(var(--color-card))",
                  border: "1px solid hsl(var(--color-border))",
                  borderRadius: "var(--radius)",
                  boxShadow: "var(--shadow-soft)",
                  fontSize: "0.75rem",
                }}
                labelStyle={{ color: "hsl(var(--color-primary-dark))" }}
                itemStyle={{ color: "hsl(var(--color-foreground))" }}
              />
              {typeof averageValue === "number" && !Number.isNaN(averageValue) && (
                <ReferenceLine
                  y={Number(averageValue.toFixed(2))}
                  stroke="hsl(var(--color-destructive))"
                  strokeDasharray="6 6"
                />
              )}
              <Area
                type="monotone"
                dataKey="value"
                stroke="hsl(var(--color-primary))"
                strokeWidth={3}
                fill="url(#revenueGradient)"
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default OverviewRevenueAnalytics;
