import React from "react";
import SalonDashboard from "@/components/SalonDashboard/SalonDashboard";
import SwitchComponent from "@/components/SalonDashboard/SalonDashboardTabs";

const Page = () => {
  return (
    <div>
      <SalonDashboard />
      <SwitchComponent />
    </div>
  );
};

export default Page;
