"use client";

import React, { useEffect, useMemo, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import AdminHeader from "@/components/Admin/AdminHeader";
import { AlertTriangle, CheckCircle, Clock, ServerCrash } from "lucide-react";
import { getSystemHealth, SystemHealth } from "@/libs/api/admins";

export default function ReliabilityPage() {
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    const load = async () => {
      setLoading(true);
      const result = await getSystemHealth();
      if (result.error || !result.health) {
        setError(result.error || "Failed to fetch system health");
        setHealth(null);
      } else {
        setError(null);
        setHealth(result.health);
      }
      setLoading(false);
    };

    load();
    timer = setInterval(load, 30_000); // auto-refresh every 30s

    return () => {
      if (timer) clearInterval(timer);
    };
  }, []);

  const incidents = health?.incidents || [];
  const errors = useMemo(() => health?.recent_errors || [], [health]);
  const trend = useMemo(() => health?.error_trend || [], [health]);

  // Fallback trend: if DB trend is empty but we have recent errors, build a per-minute series
  const trendData = useMemo(() => {
    if (trend.length > 0) return trend;
    if (!errors.length) return [];
    const counts = new Map<string, number>();
    errors.forEach((err) => {
      if (!err.timestamp) return;
      const d = new Date(err.timestamp);
      if (Number.isNaN(d.getTime())) return;
      const key = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      counts.set(key, (counts.get(key) || 0) + 1);
    });
    return Array.from(counts.entries())
      .map(([minute, count]) => ({ minute, count }))
      .sort((a, b) => a.minute.localeCompare(b.minute));
  }, [trend, errors]);
  const latencyMs = health?.avg_latency_ms;
  const uptimePercent = health?.uptime_percent;
  const errorRate = health?.error_rate_per_min;
  const totalErrors24h = health?.total_errors_24h ?? 0;
  const lastUp = health?.last_up ? new Date(health.last_up) : null;
  const lastDown = health?.last_down ? new Date(health.last_down) : null;
  const sentryEnabled = health?.sentry_enabled;

  const latencyDisplay = Number.isFinite(latencyMs) ? `${Math.round(latencyMs!)} ms` : "N/A";
  const uptimeDisplay = Number.isFinite(uptimePercent) ? `${uptimePercent!.toFixed(2)}%` : "--";
  const statusDisplay =
    Number.isFinite(uptimePercent) && uptimePercent! > 0 ? "Up" : "Down";
  const errorRateDisplay = Number.isFinite(errorRate)
    ? `${errorRate!.toFixed(2)}/min`
    : "--";

  return (
    <div className="pb-10">
      <AdminHeader adminName="Admin" />
      <h1 className="text-3xl font-bold mb-2">Reliability</h1>
      <p className="text-lg text-muted-foreground mb-6">
        Monitor platform uptime, latency, and error signals to keep StyGo stable.
      </p>

      {error && (
        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Uptime (30d)"
          value={uptimeDisplay}
          icon={<CheckCircle className="w-5 h-5 text-green-600" />}
          subtitle={`Status: ${statusDisplay}`}
        />
        <StatCard
          title="Avg Latency"
          value={latencyDisplay}
          icon={<Clock className="w-5 h-5 text-blue-600" />}
          subtitle="DB ping latency"
        />
        <StatCard
          title="Error Rate"
          value={errorRateDisplay}
          icon={<AlertTriangle className="w-5 h-5 text-amber-600" />}
          subtitle={`Errors last 24h: ${health?.total_errors_24h ?? "n/a"}`}
        />
        <StatCard
          title="Sentry"
          value={sentryEnabled ? "Enabled" : "Disabled"}
          icon={<ServerCrash className="w-5 h-5 text-purple-600" />}
          subtitle={sentryEnabled ? "Capturing errors" : "Set SENTRY_DSN to enable"}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-4 shadow-soft">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold">Error trend (last hour)</h3>
            <span className="text-xs text-muted-foreground">Auto-refresh on page load</span>
          </div>
          {trendData.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-sm text-muted-foreground">
              No error activity in the last hour.
            </div>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis
                    dataKey="minute"
                    tick={{ fontSize: 12 }}
                    label={{ value: "Minute (last hour)", position: "insideBottom", offset: -5, fontSize: 12 }}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fontSize: 12 }}
                    label={{ value: "Events", angle: -90, position: "insideLeft", offset: 10, fontSize: 12 }}
                  />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="count"
                    name="Events/min"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary))/0.1"
                    strokeWidth={3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="bg-card border border-border rounded-2xl p-4 shadow-soft">
          <div className="flex items-center gap-2 mb-3">
            <ServerCrash className="w-5 h-5 text-red-600" />
            <h3 className="text-lg font-semibold">Recent incidents</h3>
          </div>
          {incidents.length === 0 ? (
            <p className="text-sm text-muted-foreground">No active or recent incidents.</p>
          ) : (
            <div className="space-y-3">
              {incidents.map((inc) => (
                <div
                  key={inc.id || inc.started_at || Math.random().toString(36)}
                  className="border border-border rounded-lg p-3"
                >
                  <p className="text-sm font-semibold">
                    {inc.title || inc.summary || "Incident detected"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Started: {inc.started_at ? new Date(inc.started_at).toLocaleString() : "Unknown"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Status: <span className="capitalize">{inc.status || "open"}</span>
                    {inc.resolved_at ? ` • Resolved: ${new Date(inc.resolved_at).toLocaleString()}` : ""}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-card border border-border rounded-2xl p-4 shadow-soft">
          <h3 className="text-lg font-semibold mb-3">Detailed checks</h3>
          <div className="space-y-3 text-sm">
            <CheckRow
              label="Database"
              status={latencyMs !== undefined && latencyMs !== null}
              detail={latencyDisplay !== "N/A" ? `Latency ${latencyDisplay}` : "No response"}
            />
            <CheckRow
              label="Error rate"
              status={Number.isFinite(errorRate) && (errorRate ?? 0) < 1}
              detail={Number.isFinite(errorRate) ? `${errorRateDisplay}` : "No data"}
            />
            <CheckRow
              label="Incidents"
              status={incidents.length === 0}
              detail={incidents.length === 0 ? "None open" : `${incidents.length} active/recent`}
            />
            <CheckRow
              label="Sentry"
              status={Boolean(sentryEnabled)}
              detail={sentryEnabled ? "Enabled" : "Not configured"}
            />
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-4 shadow-soft">
          <h3 className="text-lg font-semibold mb-3">Performance</h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>Latency (db ping): {latencyDisplay}</p>
            <p>Uptime (30d): {uptimeDisplay}</p>
            <p>Error rate (last hour): {errorRateDisplay}</p>
            <p>Total errors (24h): {totalErrors24h}</p>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-4 shadow-soft">
          <h3 className="text-lg font-semibold mb-3">Event summary</h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <SummaryPill label="Recent errors" value={errors.length} />
            <SummaryPill label="Incidents" value={incidents.length} />
            <SummaryPill label="Last up" value={lastUp ? lastUp.toLocaleString() : "Unknown"} />
            <SummaryPill label="Last down" value={lastDown ? lastDown.toLocaleString() : "Unknown"} />
          </div>
        </div>
      </div>

      <div className="mt-6 bg-card border border-border rounded-2xl p-4 shadow-soft">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">Recent errors</h3>
          <span className="text-xs text-muted-foreground">Last ~10</span>
        </div>
        {errors.length === 0 ? (
          <p className="text-sm text-muted-foreground">No recent errors.</p>
        ) : (
          <div className="divide-y divide-border">
            {errors.map((err) => (
              <div key={err.id} className="py-2 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold capitalize">{err.service}</p>
                  <p className="text-sm text-muted-foreground">{err.message}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(err.timestamp).toLocaleString()} • {err.severity}
                  </p>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    err.severity === "critical"
                      ? "bg-red-100 text-red-700"
                      : err.severity === "warn"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-slate-100 text-slate-700"
                  }`}
                >
                  {err.severity}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  subtitle,
  icon,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-card border border-border rounded-2xl p-4 shadow-soft flex items-center gap-3">
      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">{icon}</div>
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="text-2xl font-bold text-foreground">{value}</p>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </div>
    </div>
  );
}

function CheckRow({
  label,
  status,
  detail,
}: {
  label: string;
  status: boolean;
  detail: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border px-3 py-2">
      <div>
        <p className="text-sm font-semibold text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">{detail}</p>
      </div>
      <span
        className={`text-xs px-2 py-1 rounded-full ${
          status ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
        }`}
      >
        {status ? "OK" : "Issue"}
      </span>
    </div>
  );
}

function SummaryPill({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-lg border border-border px-3 py-2">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-semibold text-foreground truncate">{value}</p>
    </div>
  );
}
