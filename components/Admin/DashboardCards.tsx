export default function DashboardCards({ stats }: { stats: any }) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-card p-6 rounded-xl shadow-soft border border-border">
          <h3 className="text-primary text-lg">User Engagement</h3>
          <p className="text-4xl font-bold text-foreground mt-2">{stats.engagement}%</p>
        </div>
  
        <div className="bg-card p-6 rounded-xl shadow-soft border border-border">
          <h3 className="text-primary text-lg">Peak Hour Bookings</h3>
          <p className="text-4xl font-bold text-foreground mt-2">{stats.peakHours}</p>
        </div>
  
        <div className="bg-card p-6 rounded-xl shadow-soft border border-border">
          <h3 className="text-primary text-lg">Monthly Revenue</h3>
          <p className="text-4xl font-bold text-foreground mt-2">${stats.revenue}</p>
        </div>
      </div>
    );
  }
  