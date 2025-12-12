"use client";

import React, { useState, useEffect } from "react";
import { X, Calendar, Clock, DollarSign, User, FileText } from "lucide-react";
import { getCustomerVisitHistory, CustomerVisitHistory } from "@/libs/api/users";

interface CustomerVisitHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: number;
  customerName: string;
  salonId: number;
}

const CustomerVisitHistoryModal: React.FC<CustomerVisitHistoryModalProps> = ({
  isOpen,
  onClose,
  userId,
  customerName,
  salonId,
}) => {
  const [appointments, setAppointments] = useState<CustomerVisitHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      loadVisitHistory();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, userId, salonId]);

  const loadVisitHistory = async () => {
    setLoading(true);
    setError("");

    const result = await getCustomerVisitHistory(userId, salonId);

    if (result.error) {
      setError(result.error);
    } else {
      setAppointments(result.appointments || []);
    }

    setLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      case "pending":
      case "scheduled":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "no-show":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  const calculateTotals = () => {
    const completedAppointments = appointments.filter(
      (apt) => apt.status.toLowerCase() === "completed"
    );
    const totalVisits = completedAppointments.length;
    const totalSpent = completedAppointments.reduce(
      (sum, apt) => sum + (apt.price || 0),
      0
    );
    const totalMinutes = completedAppointments.reduce(
      (sum, apt) => sum + (apt.duration_minutes || 0),
      0
    );
    return { totalVisits, totalSpent, totalMinutes };
  };

  if (!isOpen) return null;

  const totals = calculateTotals();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Visit History</h2>
            <p className="text-sm text-muted-foreground mt-1">{customerName}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 p-6 bg-muted/30 border-b border-border">
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">{totals.totalVisits}</p>
            <p className="text-sm text-muted-foreground">Completed Visits</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">
              ${totals.totalSpent.toFixed(2)}
            </p>
            <p className="text-sm text-muted-foreground">Total Spent</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">
              {Math.round(totals.totalMinutes / 60)}h
            </p>
            <p className="text-sm text-muted-foreground">Total Time</p>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
              <p className="text-muted-foreground">Loading visit history...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
              <p className="font-semibold mb-2">Error loading visit history:</p>
              <p>{error}</p>
              <button
                onClick={loadVisitHistory}
                className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : appointments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Calendar className="w-16 h-16 text-gray-300 mb-4" />
              <p className="text-lg font-medium text-gray-600">No visit history</p>
              <p className="text-sm text-gray-500 mt-2">
                This customer hasn't visited your salon yet
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {appointments.map((appointment) => {
                const appointmentDate = new Date(appointment.scheduled_time);
                const isPast = appointmentDate < new Date();

                return (
                  <div
                    key={appointment.appointment_id}
                    className={`border rounded-lg p-4 hover:shadow-md transition-shadow ${
                      isPast ? "border-gray-200" : "border-primary/30 bg-primary/5"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-foreground">
                          {appointment.service_name}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                          <User className="w-4 h-4" />
                          <span>{appointment.staff_name}</span>
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                          appointment.status
                        )}`}
                      >
                        {appointment.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>{appointmentDate.toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>
                          {appointmentDate.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>{appointment.duration_minutes} mins</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground font-semibold">
                        <DollarSign className="w-4 h-4" />
                        <span>${appointment.price.toFixed(2)}</span>
                      </div>
                    </div>

                    {appointment.notes && (
                      <div className="mt-3 pt-3 border-t border-border">
                        <div className="flex items-start gap-2 text-sm">
                          <FileText className="w-4 h-4 text-muted-foreground mt-0.5" />
                          <p className="text-muted-foreground">{appointment.notes}</p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-border">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerVisitHistoryModal;
