"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Eye, Pencil, Trash2 } from "lucide-react";
import AppointmentEditModal from "@/components/Dashboard/Appointments/AppointmentEditModal";
import AppointmentDetailsModal from "@/components/Dashboard/Appointments/AppointmentDetailsModal";
import { fetchWithRefresh } from "@/libs/api/fetchWithRefresh";
import { APPOINTMENT_STATUS_META } from "@/libs/constants/appointments";
export type Appointment = {
  appointment_id: number;
  customer?: string;
  customerName?: string;
  service_names?: string;
  stylist?: string;
  staff_name?: string;
  date?: string;
  time?: string;
  scheduled_time?: string;
  price: number;
  avatarUrl?: string;
  salon_id?: number;
  status?: "pending" | "confirmed" | "completed" | "cancelled";
};

interface AppointmentCardProps {
  a: Appointment;
  salonId: number;
  onUpdated?: () => void;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({
  a,
  salonId,
  onUpdated,
}) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);

  const displayName = a.customer || a.customerName || "Guest";
  const serviceLabel = a.service_names || "Multiple Services";

  const statusMeta =
    APPOINTMENT_STATUS_META[a.status || "pending"] ||
    APPOINTMENT_STATUS_META.pending;

  const handleDelete = async () => {
    if (!confirm(`Delete appointment for ${displayName}?`)) return;
    try {
      const res = await fetchWithRefresh(
        `${process.env.NEXT_PUBLIC_API_URL}/api/appointments/${a.appointment_id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      const data = await res.json();
      if (res.ok) {
        alert(" Appointment deleted successfully!");
        onUpdated?.();
      } else {
        alert(data.error || "Failed to delete appointment.");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Something went wrong while deleting appointment.");
    }
  };

  return (
    <>
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
              {serviceLabel}
              <br />
              <span className="text-gray-400 text-xs">
                with {a.stylist || a.staff_name || "Staff"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap sm:flex-nowrap items-center justify-between sm:justify-end gap-3 sm:gap-6 text-sm w-full sm:w-auto mt-2 sm:mt-0">
          <div className="text-center sm:text-right leading-tight">
            <div className="font-semibold text-gray-900">
              {a.date ||
                new Date(a.scheduled_time || "").toLocaleDateString("en-US")}
            </div>
            <div className="text-gray-500 font-medium">
              {a.time ||
                new Date(a.scheduled_time || "").toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
            </div>
          </div>
          <div className="font-semibold text-gray-900 text-base">
            ${Number(a.price).toFixed(2)}
          </div>
          <span
            className={`text-xs px-3 py-1 rounded-full font-semibold capitalize ${statusMeta.badgeClass}`}
          >
            {statusMeta.label}
          </span>
          <div className="flex items-center gap-3 text-gray-500">
            <Eye
              className="h-4 w-4 cursor-pointer hover:text-gray-900"
              onClick={() => setIsViewOpen(true)}
            />
            <Pencil
              className="h-4 w-4 cursor-pointer hover:text-gray-900"
              onClick={() => setIsEditOpen(true)}
            />
            <Trash2
              className="h-4 w-4 cursor-pointer hover:text-red-600"
              onClick={handleDelete}
            />
          </div>
        </div>
      </div>

      {isViewOpen && (
        <AppointmentDetailsModal
          isOpen={isViewOpen}
          onClose={() => setIsViewOpen(false)}
          appointmentId={a.appointment_id}
        />
      )}

      {isEditOpen && (
        <AppointmentEditModal
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          appointmentId={a.appointment_id}
          salonId={salonId}
          onUpdated={() => {
            setIsEditOpen(false);
            onUpdated?.();
          }}
        />
      )}
    </>
  );
};

export default AppointmentCard;
