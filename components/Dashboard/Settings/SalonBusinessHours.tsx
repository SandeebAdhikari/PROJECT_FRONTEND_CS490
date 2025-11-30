"use client";

import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Clock } from "lucide-react";
import ToggleButton from "../ToggleButton";
import {
  checkOwnerSalon,
  getSalonBusinessHours,
  updateSalonBusinessHours,
} from "@/libs/api/salons";
import type { BusinessHours } from "@/libs/api/salons";

interface SalonBusinessHoursProps {
  suppressMessages?: boolean;
}

const SalonBusinessHours = forwardRef<
  { save: () => Promise<void> },
  SalonBusinessHoursProps
>(({ suppressMessages = false }, ref) => {
  const [salonId, setSalonId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [_saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [businessHours, setBusinessHours] = useState<BusinessHours>({
    Monday: { enabled: true, start: "09:00", end: "18:00" },
    Tuesday: { enabled: true, start: "09:00", end: "18:00" },
    Wednesday: { enabled: true, start: "09:00", end: "18:00" },
    Thursday: { enabled: true, start: "09:00", end: "20:00" },
    Friday: { enabled: true, start: "09:00", end: "20:00" },
    Saturday: { enabled: true, start: "08:00", end: "17:00" },
    Sunday: { enabled: true, start: "10:00", end: "15:00" },
  });

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await checkOwnerSalon();
        if (result.hasSalon && result.salon?.salon_id) {
          setSalonId(result.salon.salon_id);

          // Fetch business hours
          const hoursResult = await getSalonBusinessHours(
            result.salon.salon_id
          );
          if (hoursResult.businessHours) {
            setBusinessHours(hoursResult.businessHours);
          }
        }
      } catch (error) {
        console.error("Error fetching salon data:", error);
        setMessage({ type: "error", text: "Failed to load business hours" });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleToggle = (day: string) => {
    setBusinessHours((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        enabled: !prev[day].enabled,
      },
    }));
  };

  const handleTimeChange = (
    day: string,
    field: "start" | "end",
    value: string
  ) => {
    setBusinessHours((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value,
      },
    }));
  };

  const handleSave = async () => {
    if (!salonId) {
      setMessage({ type: "error", text: "No salon found" });
      throw new Error("No salon found");
    }

    setSaving(true);
    setMessage(null);

    try {
      const result = await updateSalonBusinessHours(salonId, businessHours);

      if (result.error) {
        setMessage({ type: "error", text: result.error });
        throw new Error(result.error);
      } else {
        setMessage({
          type: "success",
          text: result.message || "Business hours updated successfully!",
        });
      }
    } catch (error) {
      console.error("Error saving business hours:", error);
      setMessage({ type: "error", text: "Failed to save business hours" });
      throw error;
    } finally {
      setSaving(false);
    }
  };

  useImperativeHandle(ref, () => ({
    save: handleSave,
  }));

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-2xl p-6">
        <p className="text-muted-foreground">Loading business hours...</p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-5 h-5" />
        <h2 className="text-lg font-bold">Business Hours</h2>
      </div>

      {!suppressMessages && message && (
        <div
          className={`p-3 rounded-lg ${
            message.type === "success"
              ? "bg-secondary text-foreground"
              : "bg-destructive/10 text-destructive"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="space-y-3">
        {days.map((day) => {
          const dayHours = businessHours[day];
          return (
            <div key={day} className="flex items-center justify-between gap-3">
              <span className="w-28 font-medium">{day}</span>
              <div className="flex items-center gap-3">
                <ToggleButton
                  checked={dayHours.enabled}
                  onChange={() => handleToggle(day)}
                />
              </div>
              <input
                type="time"
                value={dayHours.start}
                onChange={(e) => handleTimeChange(day, "start", e.target.value)}
                disabled={!dayHours.enabled}
                aria-label={`${day} opening time`}
                className="border border-border rounded-lg px-2 py-1 w-28 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <input
                type="time"
                value={dayHours.end}
                onChange={(e) => handleTimeChange(day, "end", e.target.value)}
                disabled={!dayHours.enabled}
                aria-label={`${day} closing time`}
                className="border border-border rounded-lg px-2 py-1 w-28 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
});

SalonBusinessHours.displayName = "SalonBusinessHours";

export default SalonBusinessHours;
