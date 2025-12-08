"use client";

import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Calendar } from "lucide-react";
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
  const [cancellationPolicy, setCancellationPolicy] = useState("");
  const [advanceBookingDays, setAdvanceBookingDays] = useState(30);
  const [depositPercentage, setDepositPercentage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [_saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

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
            setDepositPercentage(data.depositPercentage || 0);
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
            depositPercentage: depositPercentage,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        setMessage({
          type: "error",
          text: result.error || "Failed to save settings",
        });
        throw new Error(result.error || "Failed to save settings");
      } else {
        setMessage({
          type: "success",
          text: "Booking settings updated successfully!",
        });
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

        <div>
          <label className="block text-sm font-medium mb-1">
            Deposit Percentage (%)
          </label>
          <p className="text-sm text-muted-foreground mb-2">
            Percentage of total amount required as deposit for &quot;pay in store&quot; appointments (0-100%)
          </p>
          <input
            type="number"
            min="0"
            max="100"
            step="0.1"
            value={depositPercentage}
            onChange={(e) => {
              const value = Math.max(0, Math.min(100, Number(e.target.value) || 0));
              setDepositPercentage(value);
            }}
            className="w-full mt-1 rounded-lg border border-border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="0"
            title="Deposit Percentage"
          />
          {depositPercentage > 0 && (
            <p className="text-xs text-muted-foreground mt-1">
              Customers will pay {depositPercentage}% of the total as a deposit online, then pay the remaining balance at the salon.
            </p>
          )}
          {depositPercentage === 0 && (
            <p className="text-xs text-muted-foreground mt-1">
              No deposit required. Customers can pay the full amount when they arrive.
            </p>
          )}
        </div>
      </div>
    </div>
  );
});

SalonBookingSettings.displayName = "SalonBookingSettings";

export default SalonBookingSettings;
