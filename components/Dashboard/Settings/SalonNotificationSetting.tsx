"use client";

import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Bell } from "lucide-react";
import ToggleButton from "../ToggleButton";
import {
  checkOwnerSalon,
  getSalonNotificationSettings,
  updateSalonNotificationSettings,
} from "@/libs/api/salons";
import type { NotificationSettings } from "@/libs/api/salons";

interface SalonNotificationSettingsProps {
  suppressMessages?: boolean;
}

const SalonNotificationSettings = forwardRef<
  { save: () => Promise<void> },
  SalonNotificationSettingsProps
>(({ suppressMessages = false }, ref) => {
  const [salonId, setSalonId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [_saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [notificationSettings, setNotificationSettings] =
    useState<NotificationSettings>({
      emailReminders: true,
      inAppReminders: true,
      reminderHoursBefore: 24,
    });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await checkOwnerSalon();
        if (result.hasSalon && result.salon?.salon_id) {
          setSalonId(result.salon.salon_id);

          // Fetch notification settings
          const settingsResult = await getSalonNotificationSettings(
            result.salon.salon_id
          );
          if (settingsResult.notificationSettings) {
            setNotificationSettings(settingsResult.notificationSettings);
          }
        }
      } catch (error) {
        console.error("Error fetching salon data:", error);
        setMessage({
          type: "error",
          text: "Failed to load notification settings",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleToggle = (field: "emailReminders" | "inAppReminders") => {
    setNotificationSettings((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleReminderTimeChange = (value: string) => {
    const hours = parseInt(value);
    setNotificationSettings((prev) => ({
      ...prev,
      reminderHoursBefore: hours,
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
      const result = await updateSalonNotificationSettings(
        salonId,
        notificationSettings
      );

      if (result.error) {
        setMessage({ type: "error", text: result.error });
        throw new Error(result.error);
      } else {
        setMessage({
          type: "success",
          text: result.message || "Notification settings updated successfully!",
        });
      }
    } catch (error) {
      console.error("Error saving notification settings:", error);
      setMessage({
        type: "error",
        text: "Failed to save notification settings",
      });
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
        <p className="text-muted-foreground">
          Loading notification settings...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
      <div className="flex items-center gap-2 mb-4">
        <Bell className="w-5 h-5" />
        <h2 className="text-lg font-bold">Notifications</h2>
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
            <p className="font-medium">Email Reminders</p>
            <p className="text-sm text-muted-foreground">
              Send appointment reminders via email
            </p>
          </div>
          <div className="flex items-center gap-3">
            <ToggleButton
              checked={notificationSettings.emailReminders}
              onChange={() => handleToggle("emailReminders")}
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">In-App Reminders</p>
            <p className="text-sm text-muted-foreground">
              Send appointment reminders via in-app notifications
            </p>
          </div>
          <div className="flex items-center gap-3">
            <ToggleButton
              checked={notificationSettings.inAppReminders}
              onChange={() => handleToggle("inAppReminders")}
            />
          </div>
        </div>

        <div>
          <label htmlFor="reminder-time" className="block text-sm font-medium">
            Reminder Time (Hours Before)
          </label>
          <select
            id="reminder-time"
            value={notificationSettings.reminderHoursBefore}
            onChange={(e) => handleReminderTimeChange(e.target.value)}
            className="w-full mt-1 rounded-lg border border-border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value={24}>24 hours</option>
            <option value={12}>12 hours</option>
            <option value={6}>6 hours</option>
            <option value={3}>3 hours</option>
          </select>
        </div>
      </div>
    </div>
  );
});

SalonNotificationSettings.displayName = "SalonNotificationSettings";

export default SalonNotificationSettings;
