"use client";

import React from "react";
import Image from "next/image";
import { Eye, Pencil, Trash2 } from "lucide-react";

export type Appointment = {
  id: string;
  customer?: string;
  customerName?: string;
  service: string;
  stylist: string;
  date: string;
  time: string;
  price: number;
  status: "confirmed" | "pending" | "canceled";
  avatarUrl?: string;
};

const AppointmentCard: React.FC<{ a: Appointment }> = ({ a }) => {
  const displayName = a.customer || a.customerName || "Guest";

  const statusClasses: Record<Appointment["status"], string> = {
    confirmed: "bg-emerald-500 text-white",
    pending: "bg-amber-400 text-white",
    canceled: "bg-red-500 text-white",
  };

  return (
    <div className="w-full bg-white border border-border rounded-2xl p-4 shadow-sm hover:shadow-md transition-smooth flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div className="flex items-center gap-3">
        {a.avatarUrl ? (
          <Image
            src={a.avatarUrl}
            alt={displayName}
            width={48}
            height={48}
            className="h-12 w-12 rounded-full object-cover"
            unoptimized
          />
        ) : (
          <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center text-sm font-semibold text-gray-700">
            {displayName
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </div>
        )}

        <div>
          <div className="font-semibold text-base text-gray-900">
            {displayName}
          </div>
          <div className="text-sm text-gray-600 leading-tight">
            {a.service}
            <br />
            <span className="text-gray-400 text-xs">with {a.stylist}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap sm:flex-nowrap items-center justify-between sm:justify-end gap-3 sm:gap-6 text-sm w-full sm:w-auto mt-2 sm:mt-0">
        <div className="text-center sm:text-right leading-tight">
          <div className="font-semibold text-gray-900">{a.date}</div>
          <div className="text-gray-500 font-medium">{a.time}</div>
        </div>
        <div className="font-semibold text-gray-900 text-base">${a.price}</div>
        <span
          className={`text-xs px-3 py-1 rounded-full font-semibold capitalize ${
            statusClasses[a.status]
          }`}
        >
          {a.status}
        </span>
        <div className="flex items-center gap-3 text-gray-500">
          <Eye className="h-4 w-4 cursor-pointer hover:text-gray-900" />
          <Pencil className="h-4 w-4 cursor-pointer hover:text-gray-900" />
          <Trash2 className="h-4 w-4 cursor-pointer hover:text-red-600" />
        </div>
      </div>
    </div>
  );
};

export default AppointmentCard;
