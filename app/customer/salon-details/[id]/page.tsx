"use client";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

import React, { useState, useEffect } from "react";
import { API_ENDPOINTS } from "@/libs/api/config";

import SalonDetailNavbar from "@/components/Salon/SalonDetailNavBar";
import SalonDetailHero from "@/components/Salon/SalonDetailHero";
import SalonSidebar from "@/components/Salon/SalonSidebar/SalonDetailSidebar";
import SalonDetailInfo from "@/components/Salon/SalonDetailInfo";
import SalonDetailBookingPolicy from "@/components/Salon/SalonDetailBookingPolicy";
import SalonDetailServices from "@/components/Salon/SalonDetailServices";
import SalonDetailProducts from "@/components/Salon/SalonDetailProducts";
import SalonDetailStaffProfile from "@/components/Salon/SalonDetailStaffProfile";
import SalonDetailReview from "@/components/Salon/SalonDetailReviews";
import SalonDetailGallery from "@/components/Salon/SalonDetailGallery";

interface BusinessHours {
  [key: string]: { open: string; close: string; closed?: boolean } | undefined;
}

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
  amenities?: string[];
  status?: string;
  owner_id?: number;
}

const SalonDetailsPage: React.FC<{ params: Promise<{ id: string }> }> = ({
  params,
}) => {
  const [salonId, setSalonId] = useState<string>("");
  const [salon, setSalon] = useState<Salon | null>(null);
  const [businessHours, setBusinessHours] = useState<BusinessHours | null>(
    null
  );
  const [bookingSettings, setBookingSettings] = useState<Record<
    string,
    unknown
  > | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    params.then((resolvedParams) => {
      setSalonId(resolvedParams.id);
    });
  }, [params]);

  useEffect(() => {
    const fetchSalon = async () => {
      try {
        // Fetch from backend public endpoint
        const response = await fetch(API_ENDPOINTS.SALONS.GET_PUBLIC(salonId));
        if (response.ok) {
          const backendSalon = await response.json();
          setSalon(backendSalon);
          if (backendSalon.businessHours) {
            setBusinessHours(backendSalon.businessHours);
          }
          if (backendSalon.bookingSettings) {
            setBookingSettings(backendSalon.bookingSettings);
          }
        } else {
          const errorData = await response
            .json()
            .catch(() => ({ error: response.statusText }));
          console.error(
            "Failed to fetch salon:",
            errorData.error || response.statusText
          );
          // Set error message if provided by backend
          if (errorData.message) {
            setErrorMessage(errorData.message);
          } else if (errorData.error) {
            setErrorMessage(errorData.error);
          }
          // Set salon to null so the error message shows
          setSalon(null);
        }
      } catch (error) {
        console.error("Error fetching salon:", error);
        setSalon(null);
      } finally {
        setLoading(false);
      }
    };

    if (salonId) {
      fetchSalon();
    } else {
      setLoading(false);
      setSalon(null);
    }
  }, [salonId]);

  if (loading) {
    return (
      <div className="p-6 text-center">
        <p className="text-muted-foreground">Loading salon details...</p>
      </div>
    );
  }

  if (!salon) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold mb-2">
          {errorMessage?.includes("not available")
            ? "Salon Not Available"
            : "Salon Not Found"}
        </h1>
        <p className="text-muted-foreground mb-4">
          {errorMessage ||
            "The salon you're looking for doesn't exist or is not available."}
        </p>
        <a
          href="/customer"
          className="text-primary hover:underline font-medium"
        >
          ← Back to Salons
        </a>
      </div>
    );
  }

  const displayId = salon.id || salon.salon_id?.toString() || salonId;

  // Transform businessHours to match SidebarOpeningHours.BusinessHours type
  const transformBusinessHours = (
    hours: BusinessHours | null
  ):
    | Record<
        string,
        {
          enabled: boolean;
          start: string;
          end: string;
          open?: string;
          close?: string;
        }
      >
    | undefined => {
    if (!hours) return undefined;
    const result: Record<
      string,
      {
        enabled: boolean;
        start: string;
        end: string;
        open?: string;
        close?: string;
      }
    > = {};
    Object.entries(hours).forEach(([day, value]) => {
      if (value) {
        result[day] = {
          enabled: !value.closed,
          start: value.open,
          end: value.close,
          open: value.open,
          close: value.close,
        };
      } else {
        result[day] = {
          enabled: false,
          start: "",
          end: "",
        };
      }
    });
    return result;
  };

  const sidebarBusinessHours = transformBusinessHours(businessHours);

  return (
    <div className="w-full">
      <SalonDetailNavbar salonName={salon.name} />
      <div className="flex">
        <div className="p-6 sm:p-8 w-full sm:w-2/3 ">
          <SalonDetailHero salon={salon} />
          <SalonDetailInfo
            amenities={salon.amenities || []}
            description={salon.description}
          />
          <SalonDetailGallery salonId={displayId} />
          <SalonDetailBookingPolicy
            salonId={displayId}
            bookingSettings={bookingSettings}
          />
          <SalonDetailServices salonId={displayId} />
          <SalonDetailProducts salonId={displayId} />
          <SalonDetailStaffProfile salonId={displayId} />

          <SalonDetailReview salonId={displayId} salonOwnerId={salon.owner_id} />

          <div className="block sm:hidden mt-8">
            <SalonSidebar salon={salon} businessHours={sidebarBusinessHours} />
          </div>
        </div>

        <div className="sm:mt-2 hidden sm:block w-1/3 p-6 overflow-y-auto max-h-screen sticky top-0">
          <SalonSidebar salon={salon} businessHours={sidebarBusinessHours} />
        </div>
      </div>
    </div>
  );
};

export default SalonDetailsPage;
