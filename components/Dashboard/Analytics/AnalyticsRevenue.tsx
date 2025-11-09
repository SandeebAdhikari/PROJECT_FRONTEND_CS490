"use client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { day: "Mon", revenue: 2400 },
  { day: "Tue", revenue: 2000 },
  { day: "Wed", revenue: 9800 },
  { day: "Thu", revenue: 4800 },
  { day: "Fri", revenue: 5200 },
  { day: "Sat", revenue: 4600 },
  { day: "Sun", revenue: 5000 },
];

const AnalyticsRevenue = () => {
  return (
    <div className="bg-primary-foreground border border-muted rounded-2xl p-6 hover:shadow-soft-br transition-smooth font-inter">
      <div className="flex flex-wrap justify-between items-center gap-6 mb-6">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <span className="text-green-600 text-xl">$</span> Revenue Analytics
        </h2>

        <div className="flex flex-wrap gap-8">
          <div>
            <p className="text-gray-500 text-sm">Total Revenue</p>
            <h3 className="text-2xl font-bold text-gray-900">$45,670</h3>
            <p className="text-green-600 text-xs">+23.5% vs last period</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Avg Transaction</p>
            <h3 className="text-2xl font-bold text-gray-900">$133</h3>
            <p className="text-green-600 text-xs">+5.2% vs last period</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Daily Revenue</p>
            <h3 className="text-2xl font-bold text-gray-900">$6,524</h3>
            <p className="text-green-600 text-xs">+12.1% vs yesterday</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Revenue Goal</p>
            <h3 className="text-2xl font-bold text-gray-900">91%</h3>
            <div className="w-24 h-1.5 bg-green-600 rounded-full mt-1" />
          </div>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="day" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#16a34a"
              fill="#16a34a"
              fillOpacity={0.15}
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AnalyticsRevenue;
