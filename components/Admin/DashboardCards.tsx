export default function DashboardCards({ stats }: { stats: any }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

      {/* Card 1 */}
      <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 flex flex-col">
        <div className="flex justify-between items-start">
          <h3 className="text-black-500 font-semibold">User Engagement</h3>
          <span className="text-gray-400 text-sm">6 May - 7 May</span>
        </div>

        <p className="text-3xl font-bold text-gray-800 mt-2">
          {stats.engagement}%
        </p>

      </div>

      {/* Card 2 */}
      <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 flex flex-col">
        <div className="flex justify-between items-start">
          <h3 className="text-black-500 font-semibold">Peak Hour Bookings</h3>
          <span className="text-gray-400 text-sm">6 May - 7 May</span>
        </div>

        <p className="text-3xl font-bold text-gray-800 mt-2">
          {stats.peakHours}
        </p>

      </div>

      {/* Card 3 */}
      <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 flex flex-col">
        <div className="flex justify-between items-start">
          <h3 className="text-black-500 font-semibold">Monthly Revenue</h3>
          <span className="text-gray-400 text-sm">6 May - 7 May</span>
        </div>

        <p className="text-3xl font-bold text-gray-800 mt-2">
          ${stats.revenue}
        </p>


      </div>

    </div>
  );
}
