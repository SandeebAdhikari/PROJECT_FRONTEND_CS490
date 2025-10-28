"use client";

import React from "react";
import data from "@/data/data.json";

import SalonDetailNavbar from "@/components/Salon/SalonDetailNavBar";
import SalonDetailHero from "@/components/Salon/SalonDetailHero";
import SalonSidebar from "@/components/Salon/SalonDetailSidebar";
import SalonDetailInfo from "@/components/Salon/SalonDetailInfo";
import SalonDetailBookingPolicy from "@/components/Salon/SalonDetailBookingPolicy";
import SalonDetailGallery from "@/components/Salon/SalonDetailGallery";

interface Salon {
  id: string;
  name: string;
  city: string;
  description: string;
  category: string;
  rating: number;
  totalReviews: number;
  priceFrom: number;
  imageUrl?: string;
}

const SalonDetailsPage: React.FC<{ params: Promise<{ id: string }> }> = ({
  params,
}) => {
  const unwrappedParams = React.use(params);
  const salon = data.salons.find(
    (s: Salon) => String(s.id) === String(unwrappedParams.id)
  );

  if (!salon) {
    return <div className="p-6 text-center">Salon not found</div>;
  }

  return (
    <div className="w-full">
      <SalonDetailNavbar salonName={salon.name} />
      <div className="p-6 sm:p-8  w-full sm:w-2/3">
        <SalonDetailHero salon={salon} />
        <SalonDetailInfo />
        <SalonDetailBookingPolicy />
        <SalonDetailGallery salonId={salon.id} />
      </div>

      <SalonSidebar />
    </div>
  );
};

export default SalonDetailsPage;
