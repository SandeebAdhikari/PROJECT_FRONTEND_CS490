"use client";

import React from "react";
import { Calendar, CheckCircle, Clock, DollarSign } from "lucide-react";
import AppointmentCard, { Appointment } from "./AppointmentCard";
import KPI from "@/components/Dashboard/KPI";
import Header from "@/components/Dashboard/Header";
import data from "@/data/data.json";

const Appointments = () => {
  const salonId = "1";
  const APPOINTMENTS = (data.appointments?.[salonId] ||
    []) as unknown as Appointment[];

  const today = "2024-11-06";
  const todays = APPOINTMENTS.filter((a) => a.date === today);
  const confirmed = APPOINTMENTS.filter((a) => a.status === "confirmed");
  const pending = APPOINTMENTS.filter((a) => a.status === "pending");
  const revenueToday = todays.reduce((sum, a) => sum + a.price, 0);

  return (
    <section className="space-y-6 font-inter">
      <Header
        title="Appointment Management"
        subtitle="Manage and track all salon appointments"
        onFilterClick={() => console.log("Filter clicked")}
        onPrimaryClick={() => console.log("New appointment clicked")}
        primaryLabel="New Appointment"
        primaryIcon={Calendar}
        showActions={true}
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 items-stretch">
        <KPI
          label="Today's Appointments"
          value={todays.length}
          Icon={Calendar}
          iconClass="text-blue-500 bg-blue-50"
        />
        <KPI
          label="Confirmed"
          value={confirmed.length}
          Icon={CheckCircle}
          iconClass="text-emerald-500 bg-emerald-50"
        />
        <KPI
          label="Pending"
          value={pending.length}
          Icon={Clock}
          iconClass="text-amber-500 bg-amber-50"
        />
        <KPI
          label="Revenue Today"
          value={`$${revenueToday}`}
          Icon={DollarSign}
          iconClass="text-purple-500 bg-purple-50"
        />
      </div>

      <div className="p-6 border border-border rounded-2xl">
        <h3 className="text-lg font-semibold mb-4">Recent Appointments</h3>
        <div className="space-y-4">
          {APPOINTMENTS.map((a) => (
            <AppointmentCard key={a.id} a={a} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Appointments;
