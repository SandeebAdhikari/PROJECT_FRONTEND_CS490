"use client";

import React, { useState } from "react";
import { Calendar, Eye, Pencil, MoreVertical } from "lucide-react";
import Header from "../Header";
import Image from "next/image";
import data from "@/data/data.json";
import NewAppointmentModal from "@/components/Dashboard/Appointments/NewAppointmentModal";

const TodaySchedule = () => {
  const [openModal, setOpenModal] = useState(false);
  const salonId = "1";
  const SCHEDULE = data.schedule?.[salonId] || [];

  const statusClass = {
    confirmed: "bg-emerald-100 text-emerald-700",
    pending: "bg-amber-100 text-amber-700",
  };

  return (
    <section className="p-6 bg-white border border-border rounded-2xl font-inter">
      <Header
        title="Today's Schedule"
        subtitle="Manage and track all salon appointments"
        onFilterClick={() => console.log("Filter clicked")}
        onPrimaryClick={() => setOpenModal(true)}
        primaryLabel="New Appointment"
        primaryIcon={Calendar}
        showActions={true}
      />

      <div className="space-y-4 mt-4">
        {SCHEDULE.map((a) => (
          <div
            key={a.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between border border-border rounded-xl p-4 hover:shadow-sm transition-smooth"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 flex-1">
              <div className="mb-2 sm:mb-0 text-center sm:text-left">
                <div className="font-semibold text-foreground">{a.time}</div>
                <div className="text-sm text-muted-foreground">
                  {a.duration}
                </div>
              </div>

              <div className="flex items-center gap-3 sm:flex-1">
                {a.avatarUrl ? (
                  <Image
                    src={a.avatarUrl}
                    alt={a.name}
                    width={40}
                    height={40}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold text-gray-700">
                    {a.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                )}

                <div>
                  <div className="font-semibold">{a.name}</div>
                  <div className="flex flex-col text-sm text-muted-foreground">
                    {a.service} <span>with {a.stylist}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-5">
              <div className="text-right">
                <div className="font-semibold">${a.price}</div>
                <span
                  className={`text-xs px-2.5 py-1 rounded-full font-semibold capitalize ${
                    statusClass[a.status as keyof typeof statusClass]
                  }`}
                >
                  {a.status}
                </span>
              </div>

              <div className="flex items-center gap-3 text-gray-500">
                <Eye className="h-4 w-4 cursor-pointer hover:text-gray-900" />
                <Pencil className="h-4 w-4 cursor-pointer hover:text-gray-900" />
                <MoreVertical className="h-4 w-4 cursor-pointer hover:text-gray-900" />
              </div>
            </div>

            <div className="flex sm:hidden flex-col items-center justify-center mt-3 border-t border-border pt-3">
              <div className="flex items-center justify-between w-full">
                <div className="text-sm font-semibold">${a.price}</div>
                <span
                  className={`text-xs px-2.5 py-1 rounded-full font-semibold capitalize ${
                    statusClass[a.status as keyof typeof statusClass]
                  }`}
                >
                  {a.status}
                </span>
              </div>

              <div className="flex items-center justify-center gap-6 mt-3 text-gray-500">
                <Eye className="h-4 w-4 cursor-pointer hover:text-gray-900" />
                <Pencil className="h-4 w-4 cursor-pointer hover:text-gray-900" />
                <MoreVertical className="h-4 w-4 cursor-pointer hover:text-gray-900" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <NewAppointmentModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        salonId={Number(salonId)}
      />
    </section>
  );
};

export default TodaySchedule;
