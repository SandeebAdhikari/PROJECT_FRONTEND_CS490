"use client";

import React, { useState, useEffect } from "react";
import { Clock, CreditCard } from "lucide-react";
import { API_BASE_URL } from "@/libs/api/config";

interface BookingSettings {
  cancellationPolicy?: string | null;
  requireDeposit?: boolean;
  depositAmount?: number;
  refundPolicy?: string | null;
  lateArrivalPolicy?: string | null;
  noShowPolicy?: string | null;
}

interface SalonDetailBookingPolicyProps {
  salonId?: number | string;
  bookingSettings?: BookingSettings | null;
}

const SalonDetailBookingPolicy: React.FC<SalonDetailBookingPolicyProps> = ({ salonId, bookingSettings: propBookingSettings }) => {
  const [bookingSettings, setBookingSettings] = useState<BookingSettings | null>(propBookingSettings || null);
  const [loading, setLoading] = useState(!propBookingSettings && !!salonId);

  useEffect(() => {
    if (propBookingSettings) {
      setBookingSettings(propBookingSettings);
      setLoading(false);
      return;
    }

    if (!salonId) {
      setLoading(false);
      return;
    }

    const fetchPolicy = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.SALONS.GET_BOOKING_POLICY_PUBLIC(salonId));
        if (response.ok) {
          const data = await response.json();
          setBookingSettings(data);
        }
      } catch (error) {
        console.error("Error fetching booking policy:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPolicy();
  }, [salonId, propBookingSettings]);

  if (loading) {
    return (
      <div className="mt-5 bg-muted border border-border rounded-lg p-4">
        <p className="text-sm text-muted-foreground">Loading policies...</p>
      </div>
    );
  }

  const policies = [];
  
  // Add policies from salon_settings
  if (bookingSettings?.cancellationPolicy) {
    policies.push({
      icon: Clock,
      title: "Cancellation Policy",
      description: bookingSettings.cancellationPolicy,
    });
  }

  if (bookingSettings?.requireDeposit) {
    policies.push({
      icon: CreditCard,
      title: "Deposit Requirements",
      description: bookingSettings.depositAmount 
        ? `A deposit of $${bookingSettings.depositAmount} is required for booking`
        : "A deposit is required for booking",
    });
  } else if (bookingSettings?.requireDeposit === false) {
    policies.push({
      icon: CreditCard,
      title: "Deposit Requirements",
      description: "No deposit required for most services",
    });
  }

  if (bookingSettings?.lateArrivalPolicy) {
    policies.push({
      icon: Clock,
      title: "Late Arrival Policy",
      description: bookingSettings.lateArrivalPolicy,
    });
  }

  if (bookingSettings?.noShowPolicy) {
    policies.push({
      icon: Clock,
      title: "No-Show Policy",
      description: bookingSettings.noShowPolicy,
    });
  }

  if (bookingSettings?.refundPolicy) {
    policies.push({
      icon: CreditCard,
      title: "Refund Policy",
      description: bookingSettings.refundPolicy,
    });
  }

  // Only show default policies if no settings exist at all
  if (policies.length === 0 && !bookingSettings) {
    policies.push(
      {
        icon: Clock,
        title: "Cancellation Policy",
        description: "Free cancellation up to 24 hours before appointment",
      },
      {
        icon: CreditCard,
        title: "Deposit Requirements",
        description: "No deposit required for most services",
      },
      {
        icon: Clock,
        title: "Late Arrival Policy",
        description: "15-minute grace period. Late arrivals may result in shortened service time",
      }
    );
  }

  return (
    <div className="mt-5 bg-muted border border-border rounded-lg p-4">
      <h2 className="text-xl font-extrabold mb-6">Booking Policies</h2>

      {policies.length > 0 ? (
        <div className="space-y-5 font-inter">
          {policies.map(({ icon: Icon, title, description }) => (
            <div key={title} className="flex items-start gap-3">
              <Icon className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-foreground">{title}</h3>
                <p className="text-sm text-muted-foreground">{description}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">No booking policies available</p>
      )}
    </div>
  );
};

export default SalonDetailBookingPolicy;
