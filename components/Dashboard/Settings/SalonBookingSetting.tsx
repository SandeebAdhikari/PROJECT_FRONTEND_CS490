"use client";

import React, { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { Calendar } from "lucide-react";
import ToggleButton from "../ToggleButton";
import { checkOwnerSalon } from "@/libs/api/salons";
import { API_ENDPOINTS } from "@/libs/api/config";

interface SalonBookingSettingsProps {
  suppressMessages?: boolean;
}

const SalonBookingSettings = forwardRef<
  { save: () => Promise<void> },
  SalonBookingSettingsProps
>(({ suppressMessages = false }, ref) => {
  const [salonId, setSalonId] = useState<number | null>(null);
  const [enabled, setEnabled] = useState(true);
  const [cancellationPolicy, setCancellationPolicy] = useState("");
  const [advanceBookingDays, setAdvanceBookingDays] = useState(30);
  const [depositAmount, setDepositAmount] = useState(25);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    const loadSalonData = async () => {
      try {
        const result = await checkOwnerSalon();
        if (result.salon?.salon_id) {
          setSalonId(result.salon.salon_id);
          
          // Fetch booking settings
          const token = localStorage.getItem("token");
          const response = await fetch(
            API_ENDPOINTS.SALONS.BOOKING_SETTINGS(result.salon.salon_id),
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.ok) {
            const data = await response.json();
            setCancellationPolicy(data.cancellationPolicy || "");
            setAdvanceBookingDays(data.advanceBookingDays || 30);
            setDepositAmount(data.depositAmount || 25);
            setEnabled(data.requireDeposit || false);
          }
        }
      } catch (error) {
        console.error("Error loading booking settings:", error);
      } finally {
        setLoading(false);
      }
    };

    loadSalonData();
  }, []);

  const handleSave = async () => {
    if (!salonId) {
      setMessage({ type: "error", text: "Salon not found" });
      throw new Error("Salon not found");
    }

    setSaving(true);
    setMessage(null);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        API_ENDPOINTS.SALONS.BOOKING_SETTINGS(salonId),
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            cancellationPolicy,
            advanceBookingDays,
            requireDeposit: enabled,
            depositAmount,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        setMessage({ type: "error", text: result.error || "Failed to save settings" });
        throw new Error(result.error || "Failed to save settings");
      } else {
        setMessage({ type: "success", text: "Booking settings updated successfully!" });
      }
    } catch (error) {
      console.error("Error saving booking settings:", error);
      setMessage({ type: "error", text: "Failed to save booking settings" });
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
        <p className="text-muted-foreground">Loading booking settings...</p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="w-5 h-5" />
        <h2 className="text-lg font-bold">Booking Settings</h2>
      </div>

      {!suppressMessages && message && (
        <div
          className={`p-3 rounded-lg text-sm ${
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
          <label className="block text-sm font-medium">
            Advance Booking (Days)
          </label>
          <input
            type="number"
            value={advanceBookingDays}
            onChange={(e) => setAdvanceBookingDays(Number(e.target.value))}
            className="w-full mt-1 rounded-lg border border-border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Enter number of days"
            title="Advance Booking (Days)"
          />
        </div>

        <div>
          <label
            htmlFor="cancellationPolicy"
            className="block text-sm font-medium"
          >
            Cancellation Policy
          </label>
          <textarea
            id="cancellationPolicy"
            value={cancellationPolicy}
            onChange={(e) => setCancellationPolicy(e.target.value)}
            className="w-full mt-1 rounded-lg border border-border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            rows={3}
            placeholder="Enter cancellation policy (e.g., Free cancellation up to 24 hours before appointment)"
            title="Cancellation Policy"
            aria-label="Cancellation Policy"
          />
        </div>

        <div className="flex justify-between items-center">
          <div>
            <p id="require-deposit-label" className="font-medium">
              Require Deposit
            </p>
            <p className="text-sm text-muted-foreground">
              Require customers to pay a deposit
            </p>
          </div>
          <div className="flex items-center gap-3">
            <ToggleButton checked={enabled} onChange={setEnabled} />
          </div>
        </div>
        {enabled && (
          <div className="mt-6">
            <label className="block text-sm font-medium">
              Deposit Amount ($)
            </label>
            <input
              type="number"
              value={depositAmount}
              onChange={(e) => setDepositAmount(Number(e.target.value))}
              className="w-full mt-1 rounded-lg border border-border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter deposit amount"
              title="Deposit Amount"
            />
          </div>
        )}
      </div>
    </div>
  );
});

SalonBookingSettings.displayName = "SalonBookingSettings";

export default SalonBookingSettings;
