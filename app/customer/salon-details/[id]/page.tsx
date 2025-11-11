"use client";

import React, { useState, useEffect } from "react";
import data from "@/data/data.json";
import { API_ENDPOINTS } from "@/libs/api/config";

import SalonDetailNavbar from "@/components/Salon/SalonDetailNavBar";
import SalonDetailHero from "@/components/Salon/SalonDetailHero";
import SalonSidebar from "@/components/Salon/SalonSidebar/SalonDetailSidebar";
import SalonDetailInfo from "@/components/Salon/SalonDetailInfo";
import SalonDetailBookingPolicy from "@/components/Salon/SalonDetailBookingPolicy";
import SalonDetailServices from "@/components/Salon/SalonDetailServices";
import SalonDetailStaffProfile from "@/components/Salon/SalonDetailStaffProfile";
import SalonDetailReview from "@/components/Salon/SalonDetailReviews";
import SalonDetailExploreOther from "@/components/Salon/SalonDetailExploreOther";

interface Salon {
  id?: string;
  salon_id?: number;
  name: string;
  city?: string;
  address?: string;
  description?: string;
  category?: string;
  rating?: number;
  totalReviews?: number;
  priceFrom?: number;
  imageUrl?: string;
  profile_picture?: string;
  phone?: string;
  email?: string;
  website?: string;
}

const SalonDetailsPage: React.FC<{ params: Promise<{ id: string }> }> = ({
  params,
}) => {
  const unwrappedParams = React.use(params);
  const salonId = String(unwrappedParams.id);
  
  const [salon, setSalon] = useState<Salon | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSalon = async () => {
      try {
        // Try to fetch from backend
        const response = await fetch(`${API_ENDPOINTS.SALONS.LIST}/${salonId}`);
        if (response.ok) {
          const backendSalon = await response.json();
          setSalon(backendSalon);
        } else {
          // Fallback to mock data if backend doesn't have it
          const mockSalon = data.salons.find((s: any) => s.id === salonId);
          setSalon(mockSalon || null);
        }
      } catch (error) {
        console.error("Error fetching salon:", error);
        // Fallback to mock data
        const mockSalon = data.salons.find((s: any) => s.id === salonId);
        setSalon(mockSalon || null);
      } finally {
        setLoading(false);
      }
    };

    fetchSalon();
  }, [salonId]);

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
      )[salon.id || salon.salon_id?.toString() || ""]
    : undefined;

  if (loading) {
    return <div className="p-6 text-center">Loading salon details...</div>;
  }

  if (!salon) {
    return <div className="p-6 text-center">Salon not found</div>;
  }

  const displayId = salon.id || salon.salon_id?.toString() || salonId;

  return (
    <div className="w-full">
      <SalonDetailNavbar salonName={salon.name} />
      <div className="flex">
        <div className="p-6 sm:p-8 w-full sm:w-2/3 ">
          <SalonDetailHero salon={salon} />
          <SalonDetailInfo />
          <SalonDetailBookingPolicy />
          <SalonDetailServices salonId={displayId} />
          <SalonDetailStaffProfile salonId={displayId} />

          {salonReviewData ? (
            <SalonDetailReview stats={salonReviewData} />
          ) : (
            <div className="bg-card border border-border rounded-2xl p-6 text-center text-muted-foreground mt-5">
              No review data found for this salon.
            </div>
          )}

          <SalonDetailExploreOther currentSalonId={displayId} />
          <div className="block sm:hidden mt-8">
            <SalonSidebar />
          </div>
        </div>

        <div className="sm:mt-2 hidden sm:block w-1/3 p-6 overflow-y-auto max-h-screen sticky top-0">
          <SalonSidebar />
        </div>
      </div>
    </div>
  );
};

export default SalonDetailsPage;
