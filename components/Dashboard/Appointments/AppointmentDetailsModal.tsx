"use client";
import React, { useEffect, useState } from "react";
import {
  X,
  Calendar,
  User,
  Scissors,
  Clock,
  DollarSign,
  FileText,
} from "lucide-react";
import { fetchWithRefresh } from "@/libs/api/fetchWithRefresh";

interface AppointmentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointmentId: number | null;
}

interface ServiceItem {
  service_id: number;
  custom_name: string;
  duration: number;
  price: number;
}

interface AppointmentDetails {
  appointment_id: number;
  scheduled_time: string;
  status: string;
  price: number;
  notes: string;
  customer_name: string;
  staff_name: string | null;
  salon_name: string;
  services?: ServiceItem[];
}

const AppointmentDetailsModal = ({
  isOpen,
  onClose,
  appointmentId,
}: AppointmentDetailsModalProps) => {
  const [details, setDetails] = useState<AppointmentDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [showAllServices, setShowAllServices] = useState(false);

  useEffect(() => {
    if (!isOpen || !appointmentId) return;

    const fetchDetails = async () => {
      try {
        setLoading(true);
        const res = await fetchWithRefresh(
          `${process.env.NEXT_PUBLIC_API_URL}/api/appointments/${appointmentId}`,
          { credentials: "include" }
        );
        const data = await res.json();
        if (res.ok) setDetails(data);
      } catch (err) {
        console.error("Error fetching appointment details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [isOpen, appointmentId]);

  if (!isOpen) return null;

  const truncateServices = (services: string[], limit = 1) => {
    if (services.length <= limit) return services.join(", ");
    return services.slice(0, limit).join(", ") + " ...";
  };

  const renderServices = () => {
    if (!details?.services || details.services.length === 0) return "N/A";

    const names = details.services.map((s) => s.custom_name);
    const displayText = showAllServices
      ? names.join(", ")
      : truncateServices(names);

    return (
      <span
        onClick={() => setShowAllServices(!showAllServices)}
        className="cursor-pointer hover:underline transition-smooth text-right text-foreground block"
        title={showAllServices ? "Click to collapse" : "Click to view all"}
      >
        {displayText}
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm font-inter">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto p-6 relative">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-3 right-3 p-2 rounded-full hover:bg-primary-foreground transition-smooth"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        {loading ? (
          <div className="text-center text-gray-500 py-10">Loading...</div>
        ) : details ? (
          <>
            <h2 className="text-xl font-semibold text-center mb-6 text-foreground">
              Appointment Details
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2">
                <span className="flex items-center gap-2 text-gray-600">
                  <User className="w-4 h-4 text-primary" />
                  Customer
                </span>
                <span className="font-medium text-foreground text-right">
                  {details.customer_name || "N/A"}
                </span>
              </div>

              {/* ✅ Multi-service field (clickable + smooth toggle) */}
              <div className="flex items-start justify-between pb-2">
                <span className="flex items-center gap-2 text-gray-600">
                  <Scissors className="w-4 h-4 text-primary" />
                  Service{details?.services?.length !== 1 ? "s" : ""}
                </span>
                <div className="max-w-[60%] text-sm font-medium">
                  {renderServices()}
                </div>
              </div>

              <div className="flex items-center justify-between pb-2">
                <span className="flex items-center gap-2 text-gray-600">
                  <User className="w-4 h-4 text-primary" />
                  Staff
                </span>
                <span className="font-medium text-foreground">
                  {details.staff_name || "Auto-assigned"}
                </span>
              </div>

              <div className="flex items-center justify-between pb-2">
                <span className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-4 h-4 text-primary" />
                  Date
                </span>
                <span className="font-medium text-foreground">
                  {new Date(details.scheduled_time).toLocaleDateString()}
                </span>
              </div>

              <div className="flex items-center justify-between pb-2">
                <span className="flex items-center gap-2 text-gray-600">
                  <Clock className="w-4 h-4 text-primary" />
                  Time
                </span>
                <span className="font-medium text-foreground">
                  {new Date(details.scheduled_time).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>

              <div className="flex items-center justify-between pb-2">
                <span className="flex items-center gap-2 text-gray-600">
                  <DollarSign className="w-4 h-4 text-primary" />
                  Price
                </span>
                <span className="font-medium text-foreground">
                  ${Number(details.price || 0).toFixed(2)}
                </span>
              </div>

              <div className="flex items-center justify-between pb-2">
                <span className="flex items-center gap-2 text-gray-600">
                  Status
                </span>
                <span
                  className={`px-2 py-1 rounded-lg text-xs font-semibold ${
                    details.status === "booked"
                      ? "bg-emerald-100 text-emerald-700"
                      : details.status === "cancelled"
                      ? "bg-red-100 text-red-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {details.status}
                </span>
              </div>

              {details.notes && (
                <div className="flex border-t pt-3 justify-between">
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <FileText className="w-4 h-4 text-primary" />
                    Notes
                  </div>
                  <p className="text-sm text-gray-700">{details.notes}</p>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="text-center text-gray-500 py-10">
            Appointment not found.
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentDetailsModal;
