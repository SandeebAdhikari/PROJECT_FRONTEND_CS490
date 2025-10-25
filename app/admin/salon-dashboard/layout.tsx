import SalonNavBar from "@/components/SalonDashboard/SalonNavBar";
import SalonDashboard from "@/components/SalonDashboard/SalonDashboard";
import SalonDashboardTabs from "@/components/SalonDashboard/SalonDashboardTabs";
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
