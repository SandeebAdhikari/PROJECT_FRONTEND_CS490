"use client";

import React from "react";
import { useRouter } from "next/navigation";
import AdminHeader from "@/components/Admin/AdminHeader";
import { Download, FileText, TrendingUp, BarChart2 } from "lucide-react";

export default function ReliabilityPage() {
  const router = useRouter();

  return (
    <div className="pb-10">
      <AdminHeader adminName="Admin" />
      <h1 className="text-3xl font-bold mb-8">Reports</h1>
      <p className="text-lg text-muted-foreground mb-10">
        Comprehensive system reports and analytics.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-card border border-border rounded-2xl p-6 shadow-soft hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push("/sidra/overview/reports")}>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Sales Reports</h3>
              <p className="text-sm text-muted-foreground">View detailed sales data</p>
            </div>
          </div>
          <div className="text-primary hover:text-primary/80 text-sm font-medium">
            View Reports →
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 shadow-soft hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push("/sidra/overview/analytics")}>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Analytics</h3>
              <p className="text-sm text-muted-foreground">User and appointment trends</p>
            </div>
          </div>
          <div className="text-primary hover:text-primary/80 text-sm font-medium">
            View Analytics →
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 shadow-soft hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push("/sidra/overview/reports")}>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Download className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Export Data</h3>
              <p className="text-sm text-muted-foreground">Download reports as CSV</p>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            Available in Reports page
          </div>
        </div>
      </div>
    </div>
  );
}

