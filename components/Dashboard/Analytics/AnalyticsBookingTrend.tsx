"use client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { Calendar } from "lucide-react";

const data = [
  { day: "Mon", bookings: 12 },
  { day: "Tue", bookings: 8 },
  { day: "Wed", bookings: 24 },
  { day: "Thu", bookings: 18 },
  { day: "Fri", bookings: 20 },
  { day: "Sat", bookings: 16 },
  { day: "Sun", bookings: 18 },
];

const AnalyticsBookingTrend = () => {
  return (
    <div className="sm:h-100 bg-primary-foreground border border-muted  rounded-2xl p-6 hover:shadow-soft-br transition-smooth font-inter">
      <div className="flex flex-col sm:flex-row sm:justify-between mb-6">
        <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" /> Booking Trends
        </h2>
        <div className="mt-4 sm:mt-0 text-sm">
          <p className="flex justify-between">
            <span className="text-foreground">Total Bookings</span>
            <span className="font-semibold text-gray-900">342</span>
          </p>
          <p className="flex justify-between">
            <span className="text-foreground">Confirmed</span>
            <span className="text-green-600 font-medium">298 (87%)</span>
          </p>
          <p className="flex justify-between">
            <span className="text-foreground">Pending</span>
            <span className="text-amber-500 font-medium">32 (9%)</span>
          </p>
          <p className="flex justify-between">
            <span className="text-foreground">Cancelled</span>
            <span className="text-accent-light font-medium">12 (4%)</span>
          </p>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="day" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} />
            <Tooltip />
            <Bar
              dataKey="bookings"
              fill="hsl(var(--primary))"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AnalyticsBookingTrend;
