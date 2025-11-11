import React from "react";
import StaffLoginCard from "@/components/Salon/StaffLoginCard";

type PageProps = {
  params: { salonSlug: string };
};

const StaffLoginPage = ({ params }: PageProps) => {
  const salonSlug = decodeURIComponent(params.salonSlug);
  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <StaffLoginCard salonSlug={salonSlug} />
    </main>
  );
};

export default StaffLoginPage;
