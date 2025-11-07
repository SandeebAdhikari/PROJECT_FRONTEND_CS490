"use client";

import SalonNavBar from "@/components/Dashboard/SalonDashboard/SalonNavBar";
import SalonDashboard from "@/components/Dashboard/SalonDashboard/SalonDashboard";
import SalonDashboardTabs from "@/components/Dashboard/SalonDashboard/SalonDashboardTabs";
import { useFirebaseSession } from "@/libs/auth/useFirebaseSession";
import React from "react";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useFirebaseSession();
  return (
    <main>
      <SalonNavBar />
      <SalonDashboard />
      <SalonDashboardTabs />
      <div>{children}</div>
    </main>
  );
}
