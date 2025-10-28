"use client";

import React from "react";
import { Clock } from "lucide-react";

const hours = {
  Monday: "09:00 - 18:00",
  Tuesday: "09:00 - 18:00",
  Wednesday: "09:00 - 18:00",
  Thursday: "09:00 - 18:00",
  Friday: "09:00 - 20:00",
  Saturday: "10:00 - 17:00",
  Sunday: "10:00 - 16:00",
};

const SidebarOpeningHours = () => {
  type Day = keyof typeof hours;
  const today = new Date().toLocaleString("en-US", { weekday: "long" }) as Day;
  const now = new Date().getHours();
  const [openTime, closeTime] =
    (hours[today] && hours[today].split(" - ")) || [];
  const isOpen =
    openTime && closeTime
      ? now >= parseInt(openTime, 10) && now < parseInt(closeTime, 10)
      : false;

  return (
    <div className="bg-muted border border-border rounded-2xl p-5 shadow-sm font-inter">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold">Opening Hours</h3>
        <span
          className={`flex items-center gap-1 text-sm font-medium ${
            isOpen ? "text-green-600" : "text-muted-foreground"
          }`}
        >
          <Clock className="w-4 h-4" />
          {isOpen ? "Open Now" : "Closed"}
        </span>
      </div>

      <ul className="space-y-2">
        {Object.entries(hours).map(([day, time]) => (
          <li
            key={day}
            className={`flex items-center justify-between text-sm rounded-lg px-2 py-1 ${
              day === today ? "bg-green-50 text-green-600 font-semibold" : ""
            }`}
          >
            <span>{day}</span>
            <span>{time}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SidebarOpeningHours;
