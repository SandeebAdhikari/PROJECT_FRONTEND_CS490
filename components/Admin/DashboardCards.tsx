export default function DashboardCards({ stats }: { stats: any }) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#1d2333] p-6 rounded-xl shadow-lg">
          <h3 className="text-lg text-indigo-400">User Engagement</h3>
          <p className="text-3xl font-bold mt-2">{stats.engagement}%</p>
        </div>
  
        <div className="bg-[#1d2333] p-6 rounded-xl shadow-lg">
          <h3 className="text-lg text-indigo-400">Peak Hour Bookings</h3>
          <p className="text-3xl font-bold mt-2">{stats.peakHours}</p>
        </div>
  
        <div className="bg-[#1d2333] p-6 rounded-xl shadow-lg">
          <h3 className="text-lg text-indigo-400">Monthly Revenue</h3>
          <p className="text-3xl font-bold mt-2">${stats.revenue}</p>
        </div>
      </div>
    );
  }
  