"use client";

import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Clock } from "lucide-react";
import {
  checkOwnerSalon,
  getSalonSlotSettings,
  updateSalonSlotSettings,
} from "@/libs/api/salons";
import type { SlotSettings } from "@/libs/api/salons";

interface SalonSlotSettingsProps {
  suppressMessages?: boolean;
}

const SalonSlotSettings = forwardRef<
  { save: () => Promise<void> },
  SalonSlotSettingsProps
>(({ suppressMessages = false }, ref) => {
  const [salonId, setSalonId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [_saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [slotSettings, setSlotSettings] = useState<SlotSettings>({
    slotDuration: 30,
    bufferTime: 0,
    minAdvanceBookingHours: 2,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await checkOwnerSalon();
        if (result.hasSalon && result.salon?.salon_id) {
          setSalonId(result.salon.salon_id);

          const settingsResult = await getSalonSlotSettings(
            result.salon.salon_id
          );
          if (settingsResult.slotSettings) {
            setSlotSettings(settingsResult.slotSettings);
          }
        }
      } catch (error) {
        console.error("Error fetching salon data:", error);
        setMessage({ type: "error", text: "Failed to load slot settings" });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSave = async () => {
    if (!salonId) {
      setMessage({ type: "error", text: "No salon found" });
      throw new Error("No salon found");
    }

    setSaving(true);
    setMessage(null);

    try {
      const result = await updateSalonSlotSettings(salonId, slotSettings);

      if (result.error) {
        setMessage({ type: "error", text: result.error });
        throw new Error(result.error);
      } else {
        setMessage({
          type: "success",
          text: result.message || "Slot settings updated successfully!",
        });
      }
    } catch (error) {
      console.error("Error saving slot settings:", error);
      setMessage({ type: "error", text: "Failed to save slot settings" });
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
        <p className="text-muted-foreground">Loading slot settings...</p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-5 h-5" />
        <h2 className="text-lg font-bold">Appointment Slots</h2>
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

      <div className="space-y-4">
        <div>
          <label
            htmlFor="slotDuration"
            className="block text-sm font-medium mb-2"
          >
            Appointment Duration (minutes)
          </label>
          <input
            id="slotDuration"
            type="number"
            value={slotSettings.slotDuration}
            onChange={(e) =>
              setSlotSettings({
                ...slotSettings,
                slotDuration: parseInt(e.target.value) || 30,
              })
            }
            className="w-full rounded-lg border border-border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            min="15"
            step="15"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Standard appointment duration (e.g., 30, 45, 60 minutes)
          </p>
        </div>
        <div>
          <label
            htmlFor="bufferTime"
            className="block text-sm font-medium mb-2"
          >
            Buffer Time Between Appointments (minutes)
          </label>
          <input
            id="bufferTime"
            type="number"
            value={slotSettings.bufferTime}
            onChange={(e) =>
              setSlotSettings({
                ...slotSettings,
                bufferTime: parseInt(e.target.value) || 0,
              })
            }
            className="w-full rounded-lg border border-border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            min="0"
            step="5"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Time between appointments for cleanup/preparation
          </p>
        </div>
        <div>
          <label
            htmlFor="minAdvanceBookingHours"
            className="block text-sm font-medium mb-2"
          >
            Minimum Advance Booking (hours)
          </label>
          <input
            id="minAdvanceBookingHours"
            type="number"
            value={slotSettings.minAdvanceBookingHours}
            onChange={(e) =>
              setSlotSettings({
                ...slotSettings,
                minAdvanceBookingHours: parseInt(e.target.value) || 2,
              })
            }
            className="w-full rounded-lg border border-border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            min="0"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Minimum hours before an appointment can be booked
          </p>
        </div>
      </div>
    </div>
  );
});

SalonSlotSettings.displayName = "SalonSlotSettings";

export default SalonSlotSettings;
