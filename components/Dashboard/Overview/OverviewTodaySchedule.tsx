"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Calendar, Eye, Pencil, Trash2 } from "lucide-react";
import Header from "../Header";
import Image from "next/image";
import NewAppointmentModal from "@/components/Dashboard/Appointments/NewAppointmentModal";
import AppointmentDetailsModal from "@/components/Dashboard/Appointments/AppointmentDetailsModal";
import AppointmentEditModal from "@/components/Dashboard/Appointments/AppointmentEditModal";
import { fetchWithRefresh } from "@/libs/api/fetchWithRefresh";
import useSalonId from "@/hooks/useSalonId";

interface Appointment {
  appointment_id: number;
  scheduled_time: string;
  status: "confirmed" | "pending" | "canceled" | "booked";
  price: number;
  service_name?: string;
  service_names?: string;
  customer_name: string;
  customer_avatar: string | null;
  staff_name: string;
}

const OverviewTodaySchedule = () => {
  const { salonId, loadingSalon } = useSalonId();
  const [openModal, setOpenModal] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const statusClass: Record<string, string> = {
    confirmed: "bg-emerald-100 text-emerald-700",
    booked: "bg-blue-100 text-blue-700",
    pending: "bg-amber-100 text-amber-700",
    canceled: "bg-red-100 text-red-700",
  };

  const fetchAppointments = useCallback(async () => {
    if (!salonId) return;
    try {
      setLoading(true);
      const today = new Date().toISOString().split("T")[0];
      const res = await fetchWithRefresh(
        `${process.env.NEXT_PUBLIC_API_URL}/api/appointments/salon?salon_id=${salonId}&date=${today}`,
        { credentials: "include" }
      );

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to load appointments");
      }

      const data = await res.json();
      setAppointments(data.data || []);
    } catch (err) {
      console.error("Error fetching appointments:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch appointments"
      );
    } finally {
      setLoading(false);
    }
  }, [salonId]);

  useEffect(() => {
    if (salonId) fetchAppointments();
  }, [salonId, fetchAppointments]);

  const handleDelete = async (appointmentId: number) => {
    if (!confirm("Are you sure you want to delete this appointment?")) return;
    try {
      setDeletingId(appointmentId);
      const res = await fetchWithRefresh(
        `${process.env.NEXT_PUBLIC_API_URL}/api/appointments/${appointmentId}`,
        { method: "DELETE", credentials: "include" }
      );
      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to delete appointment");
        return;
      }

      alert("🗑 Appointment deleted successfully!");
      fetchAppointments();
    } catch (err) {
      console.error("Error deleting appointment:", err);
      alert("Something went wrong while deleting the appointment.");
    } finally {
      setDeletingId(null);
    }
  };

  if (loadingSalon) {
    return (
      <p className="text-muted-foreground mt-6 text-center">
        Loading your salon data...
      </p>
    );
  }

  return (
    <section className="p-6 bg-card border border-border rounded-2xl font-inter">
      <Header
        title="Today's Schedule"
        subtitle="Manage and track all salon appointments"
        onFilterClick={() => console.log("Filter clicked")}
        onPrimaryClick={() => setOpenModal(true)}
        primaryLabel="New Appointment"
        primaryIcon={Calendar}
        showActions={true}
      />

      {loading && (
        <p className="text-muted-foreground mt-6 text-center">
          Loading appointments...
        </p>
      )}
      {error && <p className="text-red-500 mt-6 text-center">{error}</p>}

      {!loading && !error && (
        <div className="space-y-4 mt-4">
          {appointments.length === 0 ? (
            <p className="text-muted-foreground text-center py-6">
              No appointments scheduled for today.
            </p>
          ) : (
            appointments.map((a) => (
              <div
                key={a.appointment_id}
                className="flex flex-col sm:flex-row sm:items-center justify-between border border-border rounded-xl p-4 hover:shadow-sm transition-smooth"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 flex-1">
                  <div className="mb-2 sm:mb-0 text-center sm:text-left">
                    <div className="font-semibold text-foreground">
                      {new Date(a.scheduled_time).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(a.scheduled_time).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 sm:flex-1">
                    {a.customer_avatar ? (
                      <Image
                        src={a.customer_avatar}
                        alt={a.customer_name}
                        width={40}
                        height={40}
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-sm font-semibold text-muted-foreground">
                        {a.customer_name[0]}
                      </div>
                    )}

                    <div>
                      <div className="font-semibold text-foreground">
                        {a.customer_name}
                      </div>
                      <div className="flex flex-col text-sm text-muted-foreground">
                        {a.service_names
                          ? a.service_names
                          : a.service_name || "No service listed"}
                        <span>with {a.staff_name}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="hidden sm:flex items-center gap-5">
                  <div className="text-right">
                    <div className="font-semibold text-foreground">
                      ${Number(a.price).toFixed(2)}
                    </div>
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-semibold capitalize ${
                        statusClass[a.status] || "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {a.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Eye
                      className="h-4 w-4 cursor-pointer hover:text-foreground"
                      onClick={() => {
                        setSelectedAppointment(a);
                        setShowDetails(true);
                      }}
                    />
                    <Pencil
                      className="h-4 w-4 cursor-pointer hover:text-foreground"
                      onClick={() => {
                        setSelectedAppointment(a);
                        setShowEdit(true);
                      }}
                    />
                    <Trash2
                      className={`h-4 w-4 cursor-pointer hover:text-red-600 ${
                        deletingId === a.appointment_id
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                      onClick={() => handleDelete(a.appointment_id)}
                    />
                  </div>
                </div>

                <div className="flex sm:hidden flex-col items-center justify-center mt-3 border-t border-border pt-3">
                  <div className="flex items-center justify-between w-full">
                    <div className="text-sm font-semibold text-foreground">
                      ${Number(a.price).toFixed(2)}
                    </div>
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-semibold capitalize ${
                        statusClass[a.status] || "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {a.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-center gap-6 mt-3 text-muted-foreground">
                    <Eye
                      className="h-4 w-4 cursor-pointer hover:text-foreground"
                      onClick={() => {
                        setSelectedAppointment(a);
                        setShowDetails(true);
                      }}
                    />
                    <Pencil
                      className="h-4 w-4 cursor-pointer hover:text-foreground"
                      onClick={() => {
                        setSelectedAppointment(a);
                        setShowEdit(true);
                      }}
                    />
                    <Trash2
                      className={`h-4 w-4 cursor-pointer hover:text-red-600 ${
                        deletingId === a.appointment_id
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                      onClick={() => handleDelete(a.appointment_id)}
                    />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {salonId && (
        <NewAppointmentModal
          isOpen={openModal}
          onClose={() => setOpenModal(false)}
          salonId={Number(salonId)}
          onCreated={fetchAppointments}
        />
      )}

      {showDetails && selectedAppointment && (
        <AppointmentDetailsModal
          isOpen={showDetails}
          onClose={() => setShowDetails(false)}
          appointmentId={selectedAppointment.appointment_id}
        />
      )}

      {showEdit && selectedAppointment && (
        <AppointmentEditModal
          isOpen={showEdit}
          onClose={() => {
            setShowEdit(false);
            fetchAppointments();
          }}
          appointmentId={selectedAppointment.appointment_id}
          salonId={salonId!}
        />
      )}
    </section>
  );
};

export default OverviewTodaySchedule;
