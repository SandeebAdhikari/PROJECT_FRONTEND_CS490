"use client";

import React, { useEffect } from "react";
import { Clock } from "lucide-react";

const peakData = [
  { time: "9:00 - 11:00 AM", bookings: 45 },
  { time: "11:00 AM - 1:00 PM", bookings: 38 },
  { time: "1:00 - 3:00 PM", bookings: 52 },
  { time: "3:00 - 5:00 PM", bookings: 60 },
  { time: "5:00 - 7:00 PM", bookings: 48 },
  { time: "7:00 - 9:00 PM", bookings: 25 },
];

const AnalyticsPeakHours = () => {
  const maxBookings = Math.max(...peakData.map((d) => d.bookings));

  useEffect(() => {
    const bars = document.querySelectorAll<HTMLDivElement>(".progress-bar");
    bars.forEach((bar) => {
      const progress = bar.dataset.progress;
      if (progress) bar.style.setProperty("--progress", `${progress}%`);
    });
  }, []);

  return (
    <>
      <div className="sm:h-100 bg-card border border-border rounded-2xl p-6 hover:shadow-soft-br transition-smooth font-inter">
        <h2 className="text-lg font-bold text-foreground flex items-center gap-2 mb-6">
          <Clock className="w-5 h-5 text-primary" /> Peak Hours Analysis
        </h2>

        <div className="space-y-4">
          {peakData.map((slot) => (
            <div key={slot.time}>
              <div className="flex justify-between text-sm text-muted-foreground mb-1">
                <span>{slot.time}</span>
                <span className="font-medium">{slot.bookings} bookings</span>
              </div>

              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="progress-bar"
                  data-progress={(slot.bookings / maxBookings) * 100}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .progress-bar {
          height: 100%;
          border-radius: var(--radius);
          background-color: hsl(var(--primary));
          transition: width 0.3s ease;
          width: var(--progress, 0%);
        }
      `}</style>
    </>
  );
};

export default AnalyticsPeakHours;
