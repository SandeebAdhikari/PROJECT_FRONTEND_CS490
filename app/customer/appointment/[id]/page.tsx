"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Calendar,
  Clock,
  DollarSign,
  User,
  Scissors,
  MapPin,
} from "lucide-react";
import { API_ENDPOINTS, fetchConfig } from "@/libs/api/config";

interface AppointmentDetails {
  appointment_id: number;
  salon_id: number;
  salon_name: string;
  staff_id: number;
  staff_name: string;
  service_id: number;
  service_name: string;
  scheduled_time: string;
  status: string;
  price: number;
  notes?: string;
  created_at: string;
}

const AppointmentConfirmationPage = () => {
  const params = useParams();
  const router = useRouter();
  const appointmentId = params.id as string;

  const [appointment, setAppointment] = useState<AppointmentDetails | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAppointmentDetails = useCallback(async () => {
    try {
      setLoading(true);
      const token =
        localStorage.getItem("token") || localStorage.getItem("authToken");

      const response = await fetch(
        `${API_ENDPOINTS.APPOINTMENTS.BOOK}/${appointmentId}`,
        {
          ...fetchConfig,
          headers: {
            ...fetchConfig.headers,
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch appointment details");
      }

      const data = await response.json();
      setAppointment(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load appointment"
      );
    } finally {
      setLoading(false);
    }
  }, [appointmentId]);

  const handleProceedToCheckout = () => {
    router.push(`/customer/checkout/${appointmentId}`);
  };

  useEffect(() => {
    if (appointmentId) {
      fetchAppointmentDetails();
    }
  }, [appointmentId, fetchAppointmentDetails]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "confirmed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-muted flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground font-semibold">
            Loading appointment details...
          </p>
        </div>
      </div>
    );
  }

  if (error || !appointment) {
    return (
      <div className="min-h-screen bg-muted flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-card border border-border rounded-2xl p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">Appointment Not Found</h2>
          <p className="text-muted-foreground mb-6">
            {error || "This appointment could not be found."}
          </p>
          <button
            onClick={() => router.push("/customer/my-profile")}
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 font-semibold transition-colors"
          >
            View My Appointments
          </button>
        </div>
      </div>
    );
  }

  const appointmentDate = new Date(appointment.scheduled_time);
  const isPending = appointment.status.toLowerCase() === "pending";

  return (
    <div className="min-h-screen bg-muted p-4 sm:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Success Header */}
        <div className="bg-card border border-border rounded-2xl p-8 sm:p-10 shadow-soft-br mb-6 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-10 h-10 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-2">Appointment Confirmed!</h1>
          <p className="text-muted-foreground text-lg">
            Your appointment has been successfully booked
          </p>
        </div>

        {/* Appointment Details Card */}
        <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-soft-br mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Appointment Details</h2>
            <span
              className={`px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(
                appointment.status
              )}`}
            >
              {appointment.status.toUpperCase()}
            </span>
          </div>

          <div className="space-y-5">
            {/* Salon Name */}
            <div className="flex items-start gap-4 pb-4 border-b border-border">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Salon</p>
                <p className="text-lg font-semibold">
                  {appointment.salon_name}
                </p>
              </div>
            </div>

            {/* Service */}
            <div className="flex items-start gap-4 pb-4 border-b border-border">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Scissors className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Service</p>
                <p className="text-lg font-semibold">
                  {appointment.service_name}
                </p>
              </div>
            </div>

            {/* Staff */}
            <div className="flex items-start gap-4 pb-4 border-b border-border">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Stylist</p>
                <p className="text-lg font-semibold">
                  {appointment.staff_name}
                </p>
              </div>
            </div>

            {/* Date */}
            <div className="flex items-start gap-4 pb-4 border-b border-border">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Date</p>
                <p className="text-lg font-semibold">
                  {appointmentDate.toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>

            {/* Time */}
            <div className="flex items-start gap-4 pb-4 border-b border-border">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Time</p>
                <p className="text-lg font-semibold">
                  {appointmentDate.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <DollarSign className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Total Price</p>
                <p className="text-2xl font-bold text-primary">
                  ${appointment.price.toFixed(2)}
                </p>
              </div>
            </div>

            {/* Notes */}
            {appointment.notes && (
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <p className="text-sm font-semibold mb-1">Notes:</p>
                <p className="text-sm text-muted-foreground">
                  {appointment.notes}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-soft-br">
          <div className="space-y-4">
            {isPending && (
              <button
                onClick={handleProceedToCheckout}
                className="w-full px-6 py-4 bg-primary text-white rounded-lg font-semibold text-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
              >
                <DollarSign className="w-5 h-5" />
                Proceed to Checkout
              </button>
            )}

            <button
              onClick={() => router.push("/customer/my-profile")}
              className="w-full px-6 py-4 border-2 border-border rounded-lg font-semibold text-lg hover:bg-muted transition-colors"
            >
              View My Appointments
            </button>

            <button
              onClick={() => router.push("/customer")}
              className="w-full px-6 py-4 border-2 border-border rounded-lg font-semibold text-lg hover:bg-muted transition-colors"
            >
              Browse More Salons
            </button>
          </div>

          {!isPending && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <span className="font-semibold">Note:</span> Payment for this
                appointment has already been processed or is not required.
              </p>
            </div>
          )}
        </div>

        {/* Appointment ID */}
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Appointment ID:{" "}
            <span className="font-mono font-semibold">
              #{appointment.appointment_id}
            </span>
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Keep this ID for your records
          </p>
        </div>
      </div>
    </div>
  );
};

export default AppointmentConfirmationPage;
