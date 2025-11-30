"use client";

import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Star } from "lucide-react";
import ToggleButton from "../ToggleButton";
import {
  checkOwnerSalon,
  getSalonReviewSettings,
  updateSalonReviewSettings,
} from "@/libs/api/salons";
import type { ReviewSettings } from "@/libs/api/salons";

interface SalonReviewSettingsProps {
  suppressMessages?: boolean;
}

const SalonReviewSettings = forwardRef<
  { save: () => Promise<void> },
  SalonReviewSettingsProps
>(({ suppressMessages = false }, ref) => {
  const [salonId, setSalonId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [_saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [reviewSettings, setReviewSettings] = useState<ReviewSettings>({
    autoRequestReviews: true,
    reviewRequestTiming: 24,
    publicReviewsEnabled: true,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await checkOwnerSalon();
        if (result.hasSalon && result.salon?.salon_id) {
          setSalonId(result.salon.salon_id);

          const settingsResult = await getSalonReviewSettings(
            result.salon.salon_id
          );
          if (settingsResult.reviewSettings) {
            setReviewSettings(settingsResult.reviewSettings);
          }
        }
      } catch (error) {
        console.error("Error fetching salon data:", error);
        setMessage({ type: "error", text: "Failed to load review settings" });
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
      const result = await updateSalonReviewSettings(salonId, reviewSettings);

      if (result.error) {
        setMessage({ type: "error", text: result.error });
        throw new Error(result.error);
      } else {
        setMessage({
          type: "success",
          text: result.message || "Review settings updated successfully!",
        });
      }
    } catch (error) {
      console.error("Error saving review settings:", error);
      setMessage({ type: "error", text: "Failed to save review settings" });
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
        <p className="text-muted-foreground">Loading review settings...</p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
      <div className="flex items-center gap-2 mb-4">
        <Star className="w-5 h-5" />
        <h2 className="text-lg font-bold">Review Settings</h2>
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
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Auto-Request Reviews</p>
            <p className="text-sm text-muted-foreground">
              Automatically request reviews after appointments
            </p>
          </div>
          <ToggleButton
            checked={reviewSettings.autoRequestReviews}
            onChange={(checked) =>
              setReviewSettings({
                ...reviewSettings,
                autoRequestReviews: checked,
              })
            }
          />
        </div>

        {reviewSettings.autoRequestReviews && (
          <div>
            <label
              htmlFor="review-timing"
              className="block text-sm font-medium mb-2"
            >
              Review Request Timing (hours after appointment)
            </label>
            <select
              id="review-timing"
              value={reviewSettings.reviewRequestTiming}
              onChange={(e) =>
                setReviewSettings({
                  ...reviewSettings,
                  reviewRequestTiming: parseInt(e.target.value),
                })
              }
              className="w-full rounded-lg border border-border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value={1}>1 hour</option>
              <option value={6}>6 hours</option>
              <option value={24}>24 hours</option>
              <option value={48}>48 hours</option>
              <option value={72}>72 hours</option>
            </select>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Public Reviews</p>
            <p className="text-sm text-muted-foreground">
              Display reviews publicly on salon page
            </p>
          </div>
          <ToggleButton
            checked={reviewSettings.publicReviewsEnabled}
            onChange={(checked) =>
              setReviewSettings({
                ...reviewSettings,
                publicReviewsEnabled: checked,
              })
            }
          />
        </div>
      </div>
    </div>
  );
});

SalonReviewSettings.displayName = "SalonReviewSettings";

export default SalonReviewSettings;
