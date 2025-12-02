interface DashboardStats {
  engagement: number;
  peakHours: string;
  revenue: number;
}

interface DashboardCardsProps {
  stats: DashboardStats;
}

export default function DashboardCards({ stats }: DashboardCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
        <h3 className="text-primary text-lg font-medium mb-2">User Engagement</h3>
        <p className="text-4xl font-bold text-foreground">{stats.engagement}%</p>
      </div>

      <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
        <h3 className="text-primary text-lg font-medium mb-2">Peak Hour Bookings</h3>
        <p className="text-4xl font-bold text-foreground">{stats.peakHours}</p>
      </div>

      <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
        <h3 className="text-primary text-lg font-medium mb-2">Total Revenue</h3>
        <p className="text-4xl font-bold text-foreground">
          ${stats.revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
      </div>
    </div>
  );
}
  