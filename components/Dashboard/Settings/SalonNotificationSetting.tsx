"use client";

import React, { useState } from "react";
import { Bell } from "lucide-react";
import ToggleButton from "../ToggleButton";

const SalonNotificationSettings = () => {
  const [enabled, setEnabled] = useState(true);
  return (
    <div className="bg-primary-foreground border border-border rounded-2xl p-6 space-y-5">
      <div className="flex items-center gap-2 mb-4">
        <Bell className="w-5 h-5" />
        <h2 className="text-lg font-bold">Notifications</h2>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Email Reminders</p>
            <p className="text-sm text-gray-500">
              Send appointment reminders via email
            </p>
          </div>
          <div className="flex items-center gap-3">
            <ToggleButton checked={enabled} onChange={setEnabled} />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">SMS Reminders</p>
            <p className="text-sm text-gray-500">
              Send appointment reminders via SMS
            </p>
          </div>
          <div className="flex items-center gap-3">
            <ToggleButton checked={enabled} onChange={setEnabled} />
          </div>
        </div>

        <div>
          <label htmlFor="reminder-time" className="block text-sm font-medium">
            Reminder Time (Hours Before)
          </label>
          <select
            id="reminder-time"
            title="Reminder Time (Hours Before)"
            className="w-full mt-1 rounded-lg border border-border px-3 py-2"
          >
            <option>24 hours</option>
            <option>12 hours</option>
            <option>6 hours</option>
            <option>3 hours</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default SalonNotificationSettings;
