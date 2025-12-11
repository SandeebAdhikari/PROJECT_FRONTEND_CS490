"use client";

import React, { useState, useEffect } from "react";
import AdminHeader from "@/components/Admin/AdminHeader";
import { Activity, Server, Database, CheckCircle, XCircle, AlertCircle } from "lucide-react";

export default function SystemHealthPage() {
  const [healthStatus, setHealthStatus] = useState({
    database: "checking",
    api: "checking",
    overall: "checking",
  });

  useEffect(() => {
    checkSystemHealth();
    const interval = setInterval(checkSystemHealth, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const checkSystemHealth = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/health`);
      const data = await response.json();
      
      setHealthStatus({
        database: data.database || "unknown",
        api: data.status === "ok" ? "healthy" : "unhealthy",
        overall: data.status === "ok" ? "healthy" : "unhealthy",
      });
    } catch {
      setHealthStatus({
        database: "unhealthy",
        api: "unhealthy",
        overall: "unhealthy",
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "unhealthy":
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "healthy":
        return "Healthy";
      case "unhealthy":
        return "Unhealthy";
      case "checking":
        return "Checking...";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="pb-10">
      <AdminHeader adminName="Admin" />
      <h1 className="text-3xl font-bold mb-8">System Health</h1>
      <p className="text-lg text-muted-foreground mb-10">
        Monitor the health and status of system components.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-card border border-border rounded-2xl p-6 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Database className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Database</h3>
                <p className="text-sm text-muted-foreground">MySQL Connection</p>
              </div>
            </div>
            {getStatusIcon(healthStatus.database)}
          </div>
          <p className="text-sm font-medium text-foreground">
            Status: {getStatusText(healthStatus.database)}
          </p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Server className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">API Server</h3>
                <p className="text-sm text-muted-foreground">Backend Services</p>
              </div>
            </div>
            {getStatusIcon(healthStatus.api)}
          </div>
          <p className="text-sm font-medium text-foreground">
            Status: {getStatusText(healthStatus.api)}
          </p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Overall</h3>
                <p className="text-sm text-muted-foreground">System Status</p>
              </div>
            </div>
            {getStatusIcon(healthStatus.overall)}
          </div>
          <p className="text-sm font-medium text-foreground">
            Status: {getStatusText(healthStatus.overall)}
          </p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6 shadow-soft">
        <h2 className="text-xl font-bold mb-4 text-foreground">System Information</h2>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Environment:</span>
            <span className="text-foreground font-medium">
              {process.env.NODE_ENV || "development"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Last Check:</span>
            <span className="text-foreground font-medium">
              {new Date().toLocaleTimeString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

