"use client";

import React, { useState, useEffect } from "react";
import { Clock } from "lucide-react";
import { API_ENDPOINTS } from "@/libs/api/config";

export interface BusinessHours {
  [key: string]: {
    enabled: boolean;
    start: string;
    end: string;
    // Support legacy format with open/close
    open?: string;
    close?: string;
  };
}

interface SidebarOpeningHoursProps {
  salonId?: number | string;
  businessHours?: BusinessHours;
}

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

// Convert 24-hour time (e.g., "09:00" or "18:00") to 12-hour format (e.g., "9:00 AM" or "6:00 PM")
const formatTo12Hour = (time24: string): string => {
  if (!time24) return "";
  const [hourStr, minuteStr] = time24.split(":");
  let hour = parseInt(hourStr, 10);
  const minute = minuteStr || "00";
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12; // Convert 0 to 12 for midnight, and 13-23 to 1-11
  return `${hour}:${minute} ${ampm}`;
};

const SidebarOpeningHours: React.FC<SidebarOpeningHoursProps> = ({
  salonId,
  businessHours: propBusinessHours,
}) => {
  const [businessHours, setBusinessHours] = useState<BusinessHours | null>(
    propBusinessHours || null
  );
  const [loading, setLoading] = useState(!propBusinessHours);

  useEffect(() => {
    if (propBusinessHours) {
      setBusinessHours(propBusinessHours);
      setLoading(false);
      return;
    }

    if (!salonId) {
      setLoading(false);
      return;
    }

    const fetchBusinessHours = async () => {
      try {
        const response = await fetch(
          API_ENDPOINTS.SALONS.GET_BUSINESS_HOURS_PUBLIC(salonId)
        );
        if (response.ok) {
          const data = await response.json();
          if (data.businessHours) {
            setBusinessHours(data.businessHours);
          }
        }
      } catch (error) {
        console.error("Error fetching business hours:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessHours();
  }, [salonId, propBusinessHours]);

  const today = new Date().toLocaleString("en-US", { weekday: "long" });
  const now = new Date().getHours();

  let isOpen = false;
  if (businessHours && businessHours[today]?.enabled) {
    const dayHours = businessHours[today];
    // Support both 'start/end' and legacy 'open/close' formats
    const openTime = dayHours.start || dayHours.open;
    const closeTime = dayHours.end || dayHours.close;

    if (
      openTime &&
      closeTime &&
      typeof openTime === "string" &&
      typeof closeTime === "string"
    ) {
      const [openHour] = openTime.split(":").map(Number);
      const [closeHour] = closeTime.split(":").map(Number);
      if (!isNaN(openHour) && !isNaN(closeHour)) {
        isOpen = now >= openHour && now < closeHour;
      }
    }
  }

  if (loading) {
    return (
      <div className="bg-muted border border-border rounded-2xl p-5 shadow-sm font-inter">
        <p className="text-sm text-muted-foreground">Loading hours...</p>
      </div>
    );
  }

  return (
    <div className="bg-muted border border-border rounded-2xl p-5 shadow-sm font-inter">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold">Opening Hours</h3>
        {businessHours && (
          <span
            className={`flex items-center gap-1 text-sm font-medium ${
              isOpen ? "text-green-600" : "text-muted-foreground"
            }`}
          >
            <Clock className="w-4 h-4" />
            {isOpen ? "Open Now" : "Closed"}
          </span>
        )}
      </div>

      {businessHours ? (
        <ul className="space-y-2">
          {DAYS.map((day) => {
            const dayHours = businessHours[day];
            const isToday = day === today;
            // Support both 'start/end' and legacy 'open/close' formats
            const openTime = dayHours?.start || dayHours?.open;
            const closeTime = dayHours?.end || dayHours?.close;
            const timeDisplay =
              dayHours?.enabled && openTime && closeTime
                ? `${formatTo12Hour(openTime)} - ${formatTo12Hour(closeTime)}`
                : "Closed";

            return (
              <li
                key={day}
                className={`flex items-center justify-between text-sm rounded-lg px-2 py-1 ${
                  isToday && dayHours?.enabled
                    ? "bg-green-50 text-green-600 font-semibold"
                    : ""
                }`}
              >
                <span>{day}</span>
                <span>{timeDisplay}</span>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground">No hours available</p>
      )}
    </div>
  );
};

export default SidebarOpeningHours;
