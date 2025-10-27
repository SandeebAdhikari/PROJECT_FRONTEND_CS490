import CustomerNavBar from "@/components/CustomerManagement/CustomerNavBar";
import CustomerDashboard from "@/components/CustomerManagement/CustomerDashboard";
import CustomerDashboardTabs from "@/components/CustomerManagement/CustomerDashboardTabs";
import React from "react";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
      <CustomerNavBar />
      <CustomerDashboard />
      <CustomerDashboardTabs />
      <div>{children}</div>
    </main>
  );
}
