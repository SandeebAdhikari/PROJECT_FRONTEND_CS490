import React from "react";
import StaffSignInCodeCard from "@/components/Salon/StaffSignInCodeCard";

type PageProps = {
  params: { salonSlug: string };
};

const StaffSignInCodePage = ({ params }: PageProps) => {
  const salonSlug = decodeURIComponent(params.salonSlug);
  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <StaffSignInCodeCard salonSlug={salonSlug} />
    </main>
  );
};

export default StaffSignInCodePage;
