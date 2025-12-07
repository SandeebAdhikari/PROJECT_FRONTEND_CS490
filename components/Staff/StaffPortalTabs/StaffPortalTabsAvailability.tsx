"use client";

import React, { useState, useEffect } from "react";
import { Clock, Save } from "lucide-react";
import { getStaffAvailability, updateStaffAvailability, StaffAvailability } from "@/libs/api/staffPortal";

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const StaffPortalTabsAvailability: React.FC = () => {
  const [availability, setAvailability] = useState<StaffAvailability[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    loadAvailability();
  }, []);

  const loadAvailability = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getStaffAvailability();
      
      // Initialize with all days if empty
      if (data.availability.length === 0) {
        const defaultAvailability: StaffAvailability[] = daysOfWeek.map(day => ({
          day_of_week: day,
          start_time: "09:00",
          end_time: "17:00",
          is_available: day !== "Sunday", // Sunday off by default
        }));
        setAvailability(defaultAvailability);
      } else {
        // Fill in missing days
        const existingDays = new Set(data.availability.map(a => a.day_of_week));
        const missingDays = daysOfWeek.filter(day => !existingDays.has(day));
        const completeAvailability = [
          ...data.availability,
          ...missingDays.map(day => ({
            day_of_week: day,
            start_time: "09:00",
            end_time: "17:00",
            is_available: false,
          })),
        ].sort((a, b) => daysOfWeek.indexOf(a.day_of_week) - daysOfWeek.indexOf(b.day_of_week));
        setAvailability(completeAvailability);
      }
    } catch (err) {
      console.error("Error loading availability:", err);
      setError(err instanceof Error ? err.message : "Failed to load availability");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateDay = (day: string, field: keyof StaffAvailability, value: string | boolean) => {
    setAvailability(prev =>
      prev.map(avail =>
        avail.day_of_week === day ? { ...avail, [field]: value } : avail
      )
    );
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      await updateStaffAvailability(availability);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Error saving availability:", err);
      setError(err instanceof Error ? err.message : "Failed to save availability");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading availability...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold">Your Availability</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Set your working hours for each day of the week
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
        >
          <Save className="w-4 h-4" />
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
          Availability updated successfully!
        </div>
      )}

      <div className="space-y-3">
        {availability.map((avail) => (
          <div
            key={avail.day_of_week}
            className="flex items-center gap-4 p-4 border border-border rounded-lg bg-white"
          >
            <div className="w-24 font-semibold">{avail.day_of_week}</div>
            
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={avail.is_available}
                onChange={(e) =>
                  handleUpdateDay(avail.day_of_week, "is_available", e.target.checked)
                }
                className="w-4 h-4 text-primary rounded"
              />
              <span className="text-sm">Available</span>
            </label>

            {avail.is_available && (
              <>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <input
                    type="time"
                    value={avail.start_time}
                    onChange={(e) =>
                      handleUpdateDay(avail.day_of_week, "start_time", e.target.value)
                    }
                    className="px-3 py-1.5 border border-border rounded-lg text-sm"
                  />
                  <span className="text-muted-foreground">to</span>
                  <input
                    type="time"
                    value={avail.end_time}
                    onChange={(e) =>
                      handleUpdateDay(avail.day_of_week, "end_time", e.target.value)
                    }
                    className="px-3 py-1.5 border border-border rounded-lg text-sm"
                  />
                </div>
              </>
            )}

            {!avail.is_available && (
              <span className="text-sm text-muted-foreground">Not available</span>
            )}
          </div>
        ))}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
        <p className="font-semibold mb-1">💡 Tip</p>
        <p>
          Your availability determines when customers can book appointments with you.
          If you don&apos;t set availability for a day, the system will use the salon&apos;s business hours.
        </p>
      </div>
    </div>
  );
};

export default StaffPortalTabsAvailability;

