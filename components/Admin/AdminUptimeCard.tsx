import React from "react";
import { Activity } from "lucide-react";

export default function AdminUptimeCard() {
  return (
    <div className="bg-[#1e293b] border border-gray-700 rounded-xl p-6">
      <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
        <Activity className="text-green-400" size={20} /> Platform Uptime
      </h2>
      <p className="text-4xl font-bold">99.8%</p>
      <p className="text-gray-400 mt-2">
        Server reliability over the past 30 days
      </p>
    </div>
  );
}
