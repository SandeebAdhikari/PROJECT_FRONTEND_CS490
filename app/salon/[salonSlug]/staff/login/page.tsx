"use client";

import React from "react";
import { useParams } from "next/navigation";
import StaffLoginCard from "@/components/Salon/StaffLoginCard";

const StaffLoginPage = () => {
  const params = useParams();
  const salonSlug = decodeURIComponent(params.salonSlug as string);
  
  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <StaffLoginCard salonSlug={salonSlug} />
    </main>
  );
};

export default StaffLoginPage;
