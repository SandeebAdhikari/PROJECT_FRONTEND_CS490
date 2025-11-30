"use client";

import React from "react";
import SidebarOpeningHours from "@/components/Salon/SalonSidebar/SidebarOpeningHours";
import SidebarContactCard from "@/components/Salon/SalonSidebar/SidebarContactCard";

interface SalonDetailSidebarProps {
  salon?: {
    salon_id?: number;
    id?: string;
    address?: string;
    city?: string;
    phone?: string;
    email?: string;
  };
  businessHours?: any;
}

const SalonDetailSidebar: React.FC<SalonDetailSidebarProps> = ({ salon, businessHours }) => {
  const salonId = salon?.salon_id || salon?.id;

  return (
    <aside className="space-y-6">
      <SidebarOpeningHours salonId={salonId} businessHours={businessHours} />
      <SidebarContactCard salon={salon} />
    </aside>
  );
};

export default SalonDetailSidebar;
