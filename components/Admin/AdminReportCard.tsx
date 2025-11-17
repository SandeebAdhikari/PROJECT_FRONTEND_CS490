import React from "react";
import { Download } from "lucide-react";

export default function AdminReportCard() {
  return (
    <div className="bg-[#1e293b] border border-gray-700 rounded-xl p-6">
      <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
        <Download className="text-indigo-400" size={20} /> Generate Report
      </h2>
      <p className="text-gray-400">
        Export engagement, revenue, and retention metrics as CSV or PDF.
      </p>
      <button className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md">
        Export Report
      </button>
    </div>
  );
}
