"use client";

import React, { useState, useEffect } from "react";
import { Calendar, Clock, MapPin } from "lucide-react";
import { getAppointmentHistory, AppointmentHistory as AppointmentHistoryType } from "@/libs/api/history";

interface AppointmentHistoryProps {
  filter?: "upcoming" | "past";
}

const AppointmentHistory: React.FC<AppointmentHistoryProps> = ({ filter = "past" }) => {
  const [appointments, setAppointments] = useState<AppointmentHistoryType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadHistory();
    
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        loadHistory();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const loadHistory = async () => {
    setLoading(true);
    const result = await getAppointmentHistory();
    setLoading(false);

    if (result.error) {
      setError(result.error);
    } else if (result.appointments) {
      setAppointments(result.appointments);
    } else {
      setAppointments([]);
    }
  };

  const now = new Date();
  const displayedAppointments = appointments.filter((apt) => {
    const appointmentDate = new Date(apt.scheduled_time);
    return filter === "upcoming" 
      ? appointmentDate >= now 
      : appointmentDate < now;
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
        <p className="font-semibold mb-2">Error loading appointments:</p>
        <p>{error}</p>
        <button
          onClick={loadHistory}
          className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {displayedAppointments.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg font-medium">
            No {filter} appointments
          </p>
          <p className="text-gray-500 text-sm mt-2">
            {filter === "upcoming"
              ? "Book an appointment to see it here"
              : "Your past appointments will appear here"}
          </p>
          {filter === "upcoming" && (
            <button
              onClick={() => (window.location.href = "/customer")}
              className="mt-6 px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 font-semibold transition-colors"
            >
              Discover Salons
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {displayedAppointments.map((appointment) => (
          <div
            key={appointment.appointment_id}
            className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-gray-900">
                  {appointment.salon_name}
                </h3>
                <p className="text-gray-600 text-sm mt-1">
                  with {appointment.staff_name}
                </p>

                <div className="mt-3 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {new Date(appointment.scheduled_time).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>
                      {new Date(appointment.scheduled_time).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  {appointment.service_name && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="font-medium">Service:</span>
                      <span>{appointment.service_name}</span>
                    </div>
                  )}
                </div>
              </div>

              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                  appointment.status
                )}`}
              >
                {appointment.status}
              </span>
            </div>
          </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AppointmentHistory;

