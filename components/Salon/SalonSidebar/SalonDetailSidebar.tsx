"use client";

import React from "react";
import SidebarOpeningHours from "@/components/Salon/SalonSidebar/SidebarOpeningHours";
import SidebarLocationCard from "@/components/Salon/SalonSidebar/SidebarLocationCard";
import SidebarContactCard from "@/components/Salon/SalonSidebar/SidebarContactCard";

const SalonDetailSidebar = () => {
  return (
    <aside className="space-y-6">
      <SidebarLocationCard />
      <SidebarOpeningHours />
      <SidebarContactCard />
    </aside>
  );
};

export default SalonDetailSidebar;
