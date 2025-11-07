"use client";

import React from "react";
import { Eye, Edit, Phone, Mail } from "lucide-react";

interface CustomerCardProps {
  name: string;
  email: string;
  phone: string;
  totalVisits: number;
  totalSpent: number;
  lastVisit: string;
  favoriteStaff: string;
  membershipTier?: string;
}

const CustomerCard: React.FC<CustomerCardProps> = ({
  name = "",
  email = "",
  phone = "",
  totalVisits = 0,
  totalSpent = 0,
  lastVisit = "-",
  favoriteStaff = "-",
  membershipTier = "",
}) => {
  const initials = (name || "U N")
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="border border-border bg-white rounded-xl p-4 sm:p-5 hover:shadow-md transition-smooth flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      {/* Left — Profile Section */}
      <div className="flex items-start sm:items-center gap-4 flex-1 min-w-[250px]">
        <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center text-sm font-semibold text-gray-700">
          {initials}
        </div>

        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-base sm:text-lg">{name}</h3>
            {membershipTier === "VIP" && (
              <span className="bg-emerald-100 text-emerald-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                VIP
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500">{email}</p>
          <p className="text-sm text-gray-500">{phone}</p>
        </div>
      </div>

      {/* Middle — Stats Section */}
      <div className="grid grid-cols-2 sm:grid-cols-4 text-center lg:flex lg:items-center lg:gap-10 flex-wrap lg:flex-nowrap flex-1">
        <div>
          <p className="text-lg font-semibold">{totalVisits}</p>
          <p className="text-sm text-gray-500">Visits</p>
        </div>
        <div>
          <p className="text-lg font-semibold">${totalSpent}</p>
          <p className="text-sm text-gray-500">Total Spent</p>
        </div>
        <div>
          <p className="text-sm font-semibold">{lastVisit}</p>
          <p className="text-sm text-gray-500">Last Visit</p>
        </div>
        <div>
          <p className="text-sm font-semibold">{favoriteStaff}</p>
          <p className="text-sm text-gray-500">Favorite Staff</p>
        </div>
      </div>

      {/* Right — Actions Section */}
      <div className="flex items-center gap-3 justify-center lg:justify-end text-gray-600">
        <button
          title="View Details"
          className="p-2 rounded-md hover:bg-gray-100 transition-smooth"
        >
          <Eye className="w-4 h-4" />
        </button>
        <button
          title="Edit Customer"
          className="p-2 rounded-md hover:bg-gray-100 transition-smooth"
        >
          <Edit className="w-4 h-4" />
        </button>
        <button
          title="Call Customer"
          className="p-2 rounded-md hover:bg-gray-100 transition-smooth"
        >
          <Phone className="w-4 h-4" />
        </button>
        <button
          title="Email Customer"
          className="p-2 rounded-md hover:bg-gray-100 transition-smooth"
        >
          <Mail className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default CustomerCard;
