import SalonNavBar from "@/components/SalonDashboard/SalonNavBar";
import SalonDashboard from "@/components/SalonDashboard/SalonDashboard";
import SalonDashboardTabs from "@/components/SalonDashboard/SalonDashboardTabs";
import React from "react";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
      <SalonNavBar />
      <SalonDashboard />
      <SalonDashboardTabs />
      <div>{children}</div>
    </main>
  );
}
