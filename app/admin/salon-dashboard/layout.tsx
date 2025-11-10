"use client";

import SalonNavBar from "@/components/Dashboard/Salon/SalonNavBar";
import SalonDashboard from "@/components/Dashboard/Salon/SalonDashboard";
import SalonDashboardTabs from "@/components/Dashboard/Salon/SalonDashboardTabs";
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
