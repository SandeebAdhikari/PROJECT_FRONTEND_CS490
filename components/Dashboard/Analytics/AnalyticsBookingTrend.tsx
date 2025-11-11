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
import { BookingTotals, BookingTrendPoint } from "@/libs/types/analytics";

interface BookingTrendProps {
  data: {
    trend: BookingTrendPoint[];
    totals: BookingTotals;
  };
}

const AnalyticsBookingTrend: React.FC<BookingTrendProps> = ({ data }) => {
  const chartData =
    data.trend.length > 0
      ? data.trend.map((point) => ({
          day: point.label,
          bookings: point.total,
        }))
      : [{ day: "—", bookings: 0 }];

  const { total, confirmed, pending, cancelled } = data.totals;
  const confirmedPct = total ? Math.round((confirmed / total) * 100) : 0;
  const pendingPct = total ? Math.round((pending / total) * 100) : 0;
  const cancelledPct = total ? Math.round((cancelled / total) * 100) : 0;

  return (
    <div className="sm:h-100 bg-primary-foreground border border-muted  rounded-2xl p-6 hover:shadow-soft-br transition-smooth font-inter">
      <div className="flex flex-col sm:flex-row sm:justify-between mb-6">
        <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" /> Booking Trends
        </h2>
        <div className="mt-4 sm:mt-0 text-sm">
          <p className="flex justify-between">
            <span className="text-foreground">Total Bookings</span>
            <span className="font-semibold text-gray-900">
              {total.toLocaleString()}
            </span>
          </p>
          <p className="flex justify-between">
            <span className="text-foreground">Confirmed</span>
            <span className="text-green-600 font-medium">
              {confirmed.toLocaleString()} ({confirmedPct}%)
            </span>
          </p>
          <p className="flex justify-between">
            <span className="text-foreground">Pending</span>
            <span className="text-amber-500 font-medium">
              {pending.toLocaleString()} ({pendingPct}%)
            </span>
          </p>
          <p className="flex justify-between">
            <span className="text-foreground">Cancelled</span>
            <span className="text-accent-light font-medium">
              {cancelled.toLocaleString()} ({cancelledPct}%)
            </span>
          </p>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
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
