"use client";

import { Target } from "lucide-react";

const serviceData = [
  { service: "Women's Haircut", revenue: 2925, bookings: 45, avg: 65 },
  { service: "Men's Haircut", revenue: 1800, bookings: 40, avg: 45 },
  { service: "Full Color", revenue: 4900, bookings: 35, avg: 140 },
  { service: "Highlights", revenue: 3600, bookings: 30, avg: 120 },
  { service: "Beard Trim", revenue: 625, bookings: 25, avg: 25 },
  {
    service: "Deep Conditioning Treatment",
    revenue: 1100,
    bookings: 20,
    avg: 55,
  },
];

const AnalyticsServiceRevenue = () => {
  const maxRevenue = Math.max(...serviceData.map((d) => d.revenue));
  return (
    <div className="bg-primary-foreground border border-muted rounded-2xl p-6 hover:shadow-soft-br transition-smooth font-inter">
      <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-6">
        <Target className="w-5 h-5 text-primary-light" />
        Service Revenue Breakdown
      </h2>

      <div className="space-y-5">
        {serviceData.map((srv) => (
          <div key={srv.service}>
            <div className="flex justify-between text-sm text-gray-900 mb-1">
              <span className="font-medium">{srv.service}</span>
              <span className="font-semibold">
                ${srv.revenue.toLocaleString()}
              </span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-1">
              <div
                className={`h-full bg-green-500 rounded-full transition-all w-[${Math.round(
                  (srv.revenue / maxRevenue) * 100
                )}%]`}
              ></div>
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>{srv.bookings} bookings</span>
              <span>${srv.avg}/service</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnalyticsServiceRevenue;
