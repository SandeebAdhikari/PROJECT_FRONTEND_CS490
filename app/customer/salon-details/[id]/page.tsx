"use client";

import React from "react";
import data from "@/data/data.json";

import SalonDetailNavbar from "@/components/Salon/SalonDetailNavBar";
import SalonDetailHero from "@/components/Salon/SalonDetailHero";
import SalonSidebar from "@/components/Salon/SalonDetailSidebar";
import SalonDetailInfo from "@/components/Salon/SalonDetailInfo";
import SalonDetailBookingPolicy from "@/components/Salon/SalonDetailBookingPolicy";
import SalonDetailGallery from "@/components/Salon/SalonDetailGallery";
import SalonDetailServices from "@/components/Salon/SalonDetailServices";
import SalonDetailStaffProfile from "@/components/Salon/SalonDetailStaffProfile";
import SalonDetailReview from "@/components/Salon/SalonDetailReviews";
import SalonDetailExploreOther from "@/components/Salon/SalonDetailExploreOther";

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
  const salonId = String(unwrappedParams.id);

  const salon = data.salons.find((s: Salon) => s.id === salonId);

  const salonReviewData = salon
    ? (
        data.reviews as Record<
          string,
          {
            average: number;
            totalReviews: number;
            breakdown: Record<number, number>;
          }
        >
      )[salon.id]
    : undefined;

  if (!salon) {
    return <div className="p-6 text-center">Salon not found</div>;
  }

  return (
    <div className="w-full">
      <SalonDetailNavbar salonName={salon.name} />

      <div className="p-6 sm:p-8 w-full sm:w-2/3">
        <SalonDetailHero salon={salon} />
        <SalonDetailInfo />
        <SalonDetailBookingPolicy />
        <SalonDetailGallery salonId={salon.id} />
        <SalonDetailServices salonId={salon.id} />
        <SalonDetailStaffProfile salonId={salon.id} />

        {salonReviewData ? (
          <SalonDetailReview stats={salonReviewData} />
        ) : (
          <div className="bg-card border border-border rounded-2xl p-6 text-center text-muted-foreground mt-5">
            No review data found for this salon.
          </div>
        )}

        <SalonDetailExploreOther currentSalonId={salon.id} />
      </div>

      <SalonSidebar />
    </div>
  );
};

export default SalonDetailsPage;
