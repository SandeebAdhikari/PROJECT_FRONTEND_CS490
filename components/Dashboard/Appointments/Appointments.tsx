"use client";
import React, { useEffect, useState } from "react";
import { Calendar, CheckCircle, Clock, DollarSign } from "lucide-react";
import AppointmentCard from "./AppointmentCard";
import KPI from "@/components/Dashboard/KPI";
import Header from "@/components/Dashboard/Header";
import NewAppointmentModal from "@/components/Dashboard/Appointments/NewAppointmentModal";
import { getSalonAppointments, Appointment } from "@/libs/api/appointments";

const Appointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isNewOpen, setIsNewOpen] = useState(false);
  const [salonId, setSalonId] = useState<string>("");

  useEffect(() => {
    // Get salon_id from localStorage (set in layout)
    const storedSalonId = localStorage.getItem("salon_id");
    if (storedSalonId) {
      setSalonId(storedSalonId);
    }
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const result = await getSalonAppointments();
      if (result.appointments) {
        setAppointments(result.appointments);
      }
    } catch (err) {
      console.error("Error fetching appointments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const today = new Date().toISOString().split("T")[0];
  const todays = appointments.filter((a) => a.scheduled_time?.startsWith(today));
  const confirmed = appointments.filter((a) => a.status === "confirmed" || a.status === "booked");
  const pending = appointments.filter((a) => a.status === "pending");
  const revenueToday = todays.reduce((sum, a) => sum + Number(a.price || 0), 0);

  if (loading && appointments.length === 0)
    return (
      <p className="text-center mt-6 text-muted-foreground">
        Loading appointments...
      </p>
    );

  return (
    <section className="space-y-6 font-inter">
      <Header
        title="Appointment Management"
        subtitle="Manage and track all salon appointments"
        onFilterClick={() => console.log("Filter clicked")}
        onPrimaryClick={() => setIsNewOpen(true)}
        primaryLabel="New Appointment"
        primaryIcon={Calendar}
        showActions
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
        {loading ? (
          <p className="text-gray-500">Loading appointments...</p>
        ) : (
          <div className="space-y-4">
            {appointments.map((a) => (
              <AppointmentCard
                key={a.appointment_id}
                salonId={salonId!}
                onUpdated={fetchAppointments}
                a={{
                  appointment_id: a.appointment_id,
                  service_names: a.service_names || "",
                  stylist: a.staff_name || "",
                  date: a.scheduled_time.split("T")[0],
                  time: a.scheduled_time.split("T")[1]?.substring(0, 5) || "",
                  status:
                    (a.status as "confirmed" | "pending" | "canceled") ||
                    "pending",
                  price: a.price,
                  customerName: a.customer_name,
                }}
              />
            ))}
          </div>
        )}
      </div>

      {salonId && (
        <NewAppointmentModal
          isOpen={isNewOpen}
          onClose={() => setIsNewOpen(false)}
          salonId={salonId}
          onCreated={() => {
            fetchAppointments();
            setIsNewOpen(false);
          }}
        />
      )}
    </section>
  );
};

export default Appointments;
