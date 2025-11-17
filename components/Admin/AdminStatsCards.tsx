"use client";
import React, { useState, useEffect } from "react";
import { DollarSign, Calendar, Users, Heart } from "lucide-react";

export default function AdminStatsCards() {
  const [stats, setStats] = useState({
    revenue: 45670,
    appointments: 342,
    engagement: 87,
    retention: 94,
  });

  useEffect(() => {
    setTimeout(() => {
      setStats({
        revenue: 53200,
        appointments: 389,
        engagement: 91,
        retention: 95,
      });
    }, 1000);
  }, []);

  const cards = [
    {
      title: "Total Revenue",
      value: `$${stats.revenue.toLocaleString()}`,
      change: "+12.5% vs last month",
      icon: <DollarSign className="text-indigo-400" />,
    },
    {
      title: "Appointments",
      value: stats.appointments,
      change: "+9.3% vs last month",
      icon: <Calendar className="text-emerald-400" />,
    },
    {
      title: "User Engagement",
      value: `${stats.engagement}%`,
      change: "+4.2% improvement",
      icon: <Users className="text-yellow-400" />,
    },
    {
      title: "Customer Retention",
      value: `${stats.retention}%`,
      change: "+2.1% vs Q1",
      icon: <Heart className="text-pink-400" />,
    },
  ];

  return (
    <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-6">
      {cards.map((card) => (
        <div
          key={card.title}
          className="bg-[#1e293b] border border-gray-700 rounded-xl p-5"
        >
          <div className="flex justify-between items-center">
            <h3 className="text-gray-400 text-sm">{card.title}</h3>
            {card.icon}
          </div>
          <p className="text-2xl font-bold mt-2">{card.value}</p>
          <p className="text-sm text-green-400 mt-1">{card.change}</p>
        </div>
      ))}
    </div>
  );
}
