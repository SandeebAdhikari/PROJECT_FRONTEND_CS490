"use client";
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { BarChart2, PieChart as PieIcon } from "lucide-react";

const appointmentData = [
  { month: "Jan", appointments: 120 },
  { month: "Feb", appointments: 150 },
  { month: "Mar", appointments: 180 },
  { month: "Apr", appointments: 250 },
  { month: "May", appointments: 220 },
  { month: "Jun", appointments: 300 },
];

const demographicsData = [
  { name: "18–25", value: 35 },
  { name: "26–35", value: 40 },
  { name: "36–50", value: 15 },
  { name: "50+", value: 10 },
];

const COLORS = ["#6366f1", "#22c55e", "#f97316", "#eab308"];

export default function AdminCharts() {
  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Appointment Trends */}
      <div className="bg-[#1e293b] border border-gray-700 rounded-xl p-6">
        <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
          <BarChart2 className="text-indigo-400" size={20} />
          Appointment Trends
        </h2>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={appointmentData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="month" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="appointments"
              stroke="#6366f1"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* User Demographics */}
      <div className="bg-[#1e293b] border border-gray-700 rounded-xl p-6">
        <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
          <PieIcon className="text-emerald-400" size={20} />
          User Demographics
        </h2>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={demographicsData}
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label
            >
              {demographicsData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Legend />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
