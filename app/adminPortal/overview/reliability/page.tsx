"use client";

import React, { useState, useEffect } from "react";
import ChartCard from "@/components/Admin/ChartCard";
import { Activity, AlertCircle, CheckCircle, Clock, TrendingUp, Database, Zap } from "lucide-react";
import {
  getSystemHealth,
  getSystemLogs,
  getPlatformReliability,
  SystemHealth,
  SystemLogsResponse,
  PlatformReliabilityResponse,
} from "@/libs/api/admins";

export default function ReliabilityPage() {
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [logs, setLogs] = useState<SystemLogsResponse | null>(null);
  const [reliability, setReliability] = useState<PlatformReliabilityResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadReliabilityData();
    // Refresh every 30 seconds
    const interval = setInterval(loadReliabilityData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadReliabilityData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [healthResult, logsResult, reliabilityResult] = await Promise.all([
        getSystemHealth(),
        getSystemLogs(50),
        getPlatformReliability(),
      ]);

      if (healthResult.error) {
        console.error("Failed to load health:", healthResult.error);
        setError(healthResult.error);
      } else {
        setHealth(healthResult.health || null);
      }

      if (logsResult.error) {
        console.error("Failed to load logs:", logsResult.error);
      } else {
        setLogs(logsResult.logs || null);
      }

      if (reliabilityResult.error) {
        console.error("Failed to load reliability:", reliabilityResult.error);
      } else {
        setReliability(reliabilityResult.reliability || null);
      }
    } catch (err) {
      console.error("Error loading reliability data:", err);
      setError("Failed to load reliability data");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "healthy":
      case "ok":
        return "text-green-600";
      case "degraded":
        return "text-yellow-600";
      case "down":
      case "error":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getEventTypeColor = (eventType: string) => {
    switch (eventType.toUpperCase()) {
      case "REJECTED":
      case "BLOCKED":
        return "bg-red-100 text-red-800 border-red-200";
      case "APPROVED":
        return "bg-green-100 text-green-800 border-green-200";
      case "CREATED":
      case "UPDATED":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (loading && !health) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading reliability data...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Platform Reliability</h1>
          <p className="text-lg text-muted-foreground">
            Monitor system health, uptime, and error logs
          </p>
        </div>
        <button
          onClick={loadReliabilityData}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Health Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
          <div className="flex items-center gap-3 mb-2">
            {health?.status === "healthy" ? (
              <CheckCircle className="w-6 h-6 text-green-600" />
            ) : (
              <AlertCircle className="w-6 h-6 text-red-600" />
            )}
            <h3 className="text-sm font-medium text-muted-foreground">System Status</h3>
          </div>
          <p className={`text-2xl font-bold ${getStatusColor(health?.status || "unknown")}`}>
            {health?.status ? health.status.toUpperCase() : "Unknown"}
          </p>
        </div>

        <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-6 h-6 text-primary" />
            <h3 className="text-sm font-medium text-muted-foreground">Uptime</h3>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {reliability?.uptime.uptime_days ? `${reliability.uptime.uptime_days}d` : "N/A"}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {reliability?.uptime.uptime_percentage ? `${reliability.uptime.uptime_percentage.toFixed(2)}%` : ""}
          </p>
        </div>

        <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-6 h-6 text-green-600" />
            <h3 className="text-sm font-medium text-muted-foreground">Success Rate</h3>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {reliability?.reliability.success_rate_30d !== undefined
              ? `${reliability.reliability.success_rate_30d.toFixed(1)}%`
              : "N/A"}
          </p>
          <p className="text-xs text-muted-foreground mt-1">Last 30 days</p>
        </div>

        <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
          <div className="flex items-center gap-3 mb-2">
            <Activity className="w-6 h-6 text-accent" />
            <h3 className="text-sm font-medium text-muted-foreground">Error Rate (1h)</h3>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {health?.checks.error_rate.error_percentage !== undefined
              ? `${health.checks.error_rate.error_percentage.toFixed(2)}%`
              : "N/A"}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {health?.checks.error_rate.error_events_1h || 0} errors
          </p>
        </div>
      </div>

      {/* System Health Checks */}
      {health && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Database</span>
              </div>
              <span className={`text-xs font-semibold ${getStatusColor(health.checks.database.status)}`}>
                {health.checks.database.status}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Latency: {health.checks.database.latency_ms}ms
            </p>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Error Rate</span>
              </div>
              <span className={`text-xs font-semibold ${getStatusColor(health.checks.error_rate.status)}`}>
                {health.checks.error_rate.status}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              {health.checks.error_rate.error_events_1h} / {health.checks.error_rate.total_events_1h} events
            </p>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">System Load</span>
              </div>
              <span className={`text-xs font-semibold ${getStatusColor(health.checks.system_load.status)}`}>
                {health.checks.system_load.status}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              {health.checks.system_load.active_users_24h} active users
            </p>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">DB Tables</span>
              </div>
              <span className={`text-xs font-semibold ${getStatusColor(health.checks.database_tables.status)}`}>
                {health.checks.database_tables.status}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              {health.checks.database_tables.table_count} tables
            </p>
          </div>
        </div>
      )}

      {/* Performance Metrics */}
      {reliability && (
        <div className="mb-8">
          <ChartCard title="Performance Metrics">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Avg Processing Time</p>
                <p className="text-2xl font-bold">{reliability.performance.avg_appointment_processing_time_sec}s</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Appointments (7d)</p>
                <p className="text-2xl font-bold">{reliability.performance.total_appointments_7d}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Completed (7d)</p>
                <p className="text-2xl font-bold text-green-600">{reliability.performance.completed_appointments_7d}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Completion Rate</p>
                <p className="text-2xl font-bold">{reliability.performance.completion_rate_7d}%</p>
              </div>
            </div>
          </ChartCard>
        </div>
      )}

      {/* Event Summary */}
      {logs && logs.event_summary && logs.event_summary.length > 0 && (
        <div className="mb-8">
          <ChartCard title="Event Summary (Last 7 Days)">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {logs.event_summary.map((event) => (
                <div key={event.event_type} className="bg-muted/50 p-3 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">{event.event_type}</p>
                  <p className="text-xl font-bold">{event.count}</p>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>
      )}

      {/* System Logs */}
      <ChartCard title="Recent System Logs">
        <div className="max-h-[500px] overflow-y-auto">
          {logs && logs.recent_logs && logs.recent_logs.length > 0 ? (
            <table className="w-full">
              <thead className="bg-muted sticky top-0">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-foreground">
                    Timestamp
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-foreground">
                    Event Type
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-foreground">
                    Salon ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-foreground">
                    Event Note
                  </th>
                </tr>
              </thead>
              <tbody>
                {logs.recent_logs.map((log, index) => (
                  <tr
                    key={log.audit_id || index}
                    className="border-b border-border hover:bg-muted/50"
                  >
                    <td className="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-2 py-1 text-xs font-medium rounded border ${getEventTypeColor(
                          log.event_type
                        )}`}
                      >
                        {log.event_type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      {log.salon_id || "-"}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      {log.event_note}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No system logs available</p>
            </div>
          )}
        </div>
      </ChartCard>
    </div>
  );
}
