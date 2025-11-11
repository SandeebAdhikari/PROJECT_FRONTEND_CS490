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
import { RevenueSummary, RevenueSeriesPoint } from "@/libs/types/analytics";

interface RevenueAnalyticsProps {
  data: {
    summary: RevenueSummary;
    series: RevenueSeriesPoint[];
  };
}

const AnalyticsRevenue: React.FC<RevenueAnalyticsProps> = ({ data }) => {
  const chartData =
    data.series.length > 0
      ? data.series.map((point) => ({
          day: point.label,
          revenue: point.value,
        }))
      : [{ day: "—", revenue: 0 }];

  const { totalRevenue, avgTicket, dailyRevenue, goalProgress } = data.summary;

  return (
    <div className="bg-primary-foreground border border-muted rounded-2xl p-6 hover:shadow-soft-br transition-smooth font-inter">
      <div className="flex flex-wrap justify-between items-center gap-6 mb-6">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <span className="text-green-600 text-xl">$</span> Revenue Analytics
        </h2>

        <div className="flex flex-wrap gap-8">
          <div>
            <p className="text-gray-500 text-sm">Total Revenue</p>
            <h3 className="text-2xl font-bold text-gray-900">
              ${totalRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </h3>
            <p className="text-green-600 text-xs">Last 7 days</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Avg Transaction</p>
            <h3 className="text-2xl font-bold text-gray-900">
              ${avgTicket.toFixed(2)}
            </h3>
            <p className="text-green-600 text-xs">Per completed booking</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Daily Revenue</p>
            <h3 className="text-2xl font-bold text-gray-900">
              ${dailyRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </h3>
            <p className="text-green-600 text-xs">Most recent day</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Revenue Goal</p>
            <h3 className="text-2xl font-bold text-gray-900">
              {goalProgress.toFixed(0)}%
            </h3>
            <div
              className="w-24 h-1.5 bg-green-600 rounded-full mt-1"
              style={{ width: `${goalProgress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
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
