"use client";
import React, { useEffect, useState, useCallback } from "react";
import { Calendar, CheckCircle, Clock, DollarSign } from "lucide-react";
import AppointmentCard from "./AppointmentCard";
import KPI from "@/components/Dashboard/KPI";
import Header from "@/components/Dashboard/Header";
import NewAppointmentModal from "@/components/Dashboard/Appointments/NewAppointmentModal";
import { fetchWithRefresh } from "@/libs/api/fetchWithRefresh";
import useSalonId from "@/hooks/useSalonId";

interface Appointment {
  appointment_id: number;
  scheduled_time: string;
  status: string;
  price: number;
  notes?: string;
  customer_name?: string;
  staff_name?: string;
  service_names?: string;
}

const Appointments = () => {
  const { salonId, loadingSalon } = useSalonId();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [stats, setStats] = useState({
    todays_appointments: 0,
    confirmed: 0,
    pending: 0,
    revenue_today: 0,
  });

  const [loading, setLoading] = useState(false);
  const [isNewOpen, setIsNewOpen] = useState(false);

  const fetchAppointments = useCallback(async () => {
    if (!salonId) return;
    setLoading(true);
    try {
      const res = await fetchWithRefresh(
        `${process.env.NEXT_PUBLIC_API_URL}/api/appointments/salon?salon_id=${salonId}`,
        { credentials: "include" }
      );
      const data = await res.json();
      if (res.ok && Array.isArray(data.data)) setAppointments(data.data);
      else console.error("Failed to load appointments:", data.error);
    } catch (err) {
      console.error("Error fetching appointments:", err);
    } finally {
      setLoading(false);
    }
  }, [salonId]);

  const fetchStats = useCallback(async () => {
    if (!salonId) return;
    try {
      const res = await fetchWithRefresh(
        `${process.env.NEXT_PUBLIC_API_URL}/api/appointments/salon-stats?salon_id=${salonId}`,
        { credentials: "include" }
      );
      const data = await res.json();
      if (res.ok) setStats(data);
      else console.error("Failed to load stats:", data.error);
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  }, [salonId]);

  useEffect(() => {
    if (salonId) fetchAppointments();
    fetchStats();
  }, [salonId, fetchAppointments, fetchStats]);

  if (loadingSalon)
    return (
      <p className="text-center mt-6 text-muted-foreground">
        Loading salon data...
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
          value={stats.todays_appointments}
          Icon={Calendar}
          iconClass="text-blue-500 bg-blue-50"
        />
        <KPI
          label="Confirmed"
          value={stats.confirmed}
          Icon={CheckCircle}
          iconClass="text-emerald-500 bg-emerald-50"
        />
        <KPI
          label="Pending"
          value={stats.pending}
          Icon={Clock}
          iconClass="text-amber-500 bg-amber-50"
        />
        <KPI
          label="Revenue Today"
          value={`$${stats.revenue_today}`}
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
