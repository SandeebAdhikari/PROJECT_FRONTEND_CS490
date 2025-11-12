"use client";

import React from "react";
import { useParams } from "next/navigation";
import StaffSignInCodeCard from "@/components/Salon/StaffSignInCodeCard";

const StaffSignInCodePage = () => {
  const params = useParams();
  const salonSlug = decodeURIComponent(params.salonSlug as string);
  
  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <StaffSignInCodeCard salonSlug={salonSlug} />
    </main>
  );
};

export default StaffSignInCodePage;
