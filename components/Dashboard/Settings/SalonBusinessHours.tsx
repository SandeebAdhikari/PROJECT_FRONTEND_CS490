"use client";

import React, { useState } from "react";
import { Clock } from "lucide-react";
import ToggleButton from "../ToggleButton";

const SalonBusinessHours = () => {
  const [enabled, setEnabled] = useState(true);
  const days = [
    { day: "Monday", start: "09:00 AM", end: "06:00 PM" },
    { day: "Tuesday", start: "09:00 AM", end: "06:00 PM" },
    { day: "Wednesday", start: "09:00 AM", end: "06:00 PM" },
    { day: "Thursday", start: "09:00 AM", end: "08:00 PM" },
    { day: "Friday", start: "09:00 AM", end: "08:00 PM" },
    { day: "Saturday", start: "08:00 AM", end: "05:00 PM" },
    { day: "Sunday", start: "10:00 AM", end: "03:00 PM" },
  ];

  return (
    <div className="bg-white border border-border rounded-2xl p-6 space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-5 h-5" />
        <h2 className="text-lg font-bold">Business Hours</h2>
      </div>

      <div className="space-y-3">
        {days.map(({ day, start, end }) => (
          <div key={day} className="flex items-center justify-between gap-3">
            <span className="w-28 font-medium">{day}</span>
            <div className="flex items-center gap-3">
              <ToggleButton checked={enabled} onChange={setEnabled} />
            </div>
            <input
              type="text"
              defaultValue={start}
              title={`${day} start time`}
              placeholder={`${day} start time`}
              aria-label={`${day} start time`}
              className="border border-border rounded-lg px-2 py-1 w-28"
            />
            <span className="text-gray-500">to</span>
            <input
              type="text"
              defaultValue={end}
              title={`${day} end time`}
              placeholder={`${day} end time`}
              aria-label={`${day} end time`}
              className="border border-border rounded-lg px-2 py-1 w-28"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SalonBusinessHours;
