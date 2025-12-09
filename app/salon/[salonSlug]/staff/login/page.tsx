"use client";

import React from "react";
import { useParams } from "next/navigation";
import StaffLoginCard from "@/components/Salon/StaffLoginCard";

const StaffLoginPage = () => {
  const params = useParams();
  
  if (!params?.salonSlug) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Salon not found</h1>
          <p className="text-muted-foreground">Please check the URL and try again.</p>
        </div>
      </main>
    );
  }
  
  const salonSlug = decodeURIComponent(params.salonSlug as string);
  
  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <StaffLoginCard salonSlug={salonSlug} />
    </main>
  );
};

export default StaffLoginPage;
