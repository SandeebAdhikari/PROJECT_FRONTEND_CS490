import React, { useEffect, useState } from "react";
import { Calendar, CheckCircle, Clock, DollarSign } from "lucide-react";
import AppointmentCard from "./AppointmentCard";
import KPI from "@/components/Dashboard/KPI";
import Header from "@/components/Dashboard/Header";
import NewAppointmentModal from "@/components/Dashboard/Appointments/NewAppointmentModal";
import { fetchWithRefresh } from "@/libs/api/fetchWithRefresh";

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
  const salonId = 1;
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [isNewOpen, setIsNewOpen] = useState(false);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await fetchWithRefresh(
        `${process.env.NEXT_PUBLIC_API_URL}/api/appointments/salon?salon_id=${salonId}`,
        { credentials: "include" }
      );
      const data = await res.json();
      if (res.ok && Array.isArray(data.data)) {
        setAppointments(data.data);
      } else {
        console.error("Failed to load appointments:", data.error);
      }
    } catch (err) {
      console.error("Error fetching appointments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [salonId]);

  const today = new Date().toISOString().split("T")[0];
  const todays = appointments.filter((a) => a.scheduled_time.startsWith(today));
  const confirmed = appointments.filter((a) => a.status === "confirmed");
  const pending = appointments.filter((a) => a.status === "pending");
  const revenueToday = todays.reduce((sum, a) => sum + Number(a.price || 0), 0);

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
                salonId={salonId}
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

      <NewAppointmentModal
        isOpen={isNewOpen}
        onClose={() => setIsNewOpen(false)}
        salonId={salonId}
        onCreated={() => {
          fetchAppointments(); // ✅ reload list after new appointment
          setIsNewOpen(false);
        }}
      />
    </section>
  );
};

export default Appointments;
