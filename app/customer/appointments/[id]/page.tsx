"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  CalendarClock,
  MapPin,
  User,
  Scissors,
  Loader2,
  DollarSign,
} from "lucide-react";
import { Appointment, getAppointmentById } from "@/libs/api/appointments";

export default function AppointmentDetailsPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const appointmentId = useMemo(() => Number(params?.id), [params?.id]);

  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!appointmentId) {
        setError("Invalid appointment id");
        setLoading(false);
        return;
      }

      const { appointment, error } = await getAppointmentById(appointmentId);
      if (error) {
        setError(error);
      } else {
        setAppointment(appointment || null);
      }
      setLoading(false);
    };

    load();
  }, [appointmentId]);

  const formattedDate = useMemo(() => {
    if (!appointment?.scheduled_time) return "N/A";
    return new Date(appointment.scheduled_time).toLocaleString();
  }, [appointment?.scheduled_time]);

  const priceDisplay = useMemo(() => {
    if (typeof appointment?.price !== "number") return "—";
    return `$${appointment.price.toFixed(2)}`;
  }, [appointment?.price]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Loading appointment...</span>
        </div>
      </div>
    );
  }

  if (error || !appointment) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted px-4">
        <div className="bg-card border border-border rounded-xl shadow p-6 max-w-md w-full space-y-4">
          <p className="text-lg font-semibold text-foreground">
            Unable to load appointment
          </p>
          <p className="text-muted-foreground text-sm">{error || "Not found"}</p>
          <div className="flex gap-2">
            <button
              onClick={() => router.push("/sign-in")}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              Sign in
            </button>
            <button
              onClick={() => router.push("/customer")}
              className="px-4 py-2 bg-muted text-foreground rounded-lg border border-border hover:bg-background transition-colors"
            >
              Go to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted">
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="bg-card border border-border rounded-xl shadow p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <p className="text-sm text-muted-foreground">Appointment</p>
              <h1 className="text-2xl font-bold text-foreground">
                #{appointment.appointment_id}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Status</span>
              <span className="px-3 py-1 rounded-full text-sm font-semibold bg-primary/10 text-primary">
                {appointment.status?.toUpperCase() || "UNKNOWN"}
              </span>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <InfoRow
              icon={<CalendarClock className="w-4 h-4" />}
              label="Scheduled Time"
              value={formattedDate}
            />
            <InfoRow
              icon={<MapPin className="w-4 h-4" />}
              label="Salon"
              value={appointment.salon_name || "—"}
            />
            <InfoRow
              icon={<User className="w-4 h-4" />}
              label="Staff"
              value={appointment.staff_name || "—"}
            />
            <InfoRow
              icon={<DollarSign className="w-4 h-4" />}
              label="Total"
              value={priceDisplay}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-foreground font-semibold">
              <Scissors className="w-4 h-4" />
              <span>Services</span>
            </div>
            {appointment.services && appointment.services.length > 0 ? (
              <ul className="space-y-2">
                {appointment.services.map((service) => (
                  <li
                    key={service.service_id}
                    className="flex items-center justify-between border border-border rounded-lg p-3 bg-background"
                  >
                    <div>
                      <p className="font-medium text-foreground">
                        {service.custom_name || `Service #${service.service_id}`}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {service.duration
                          ? `${service.duration} mins`
                          : "Duration N/A"}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-foreground">
                      {typeof service.price === "number"
                        ? `$${service.price.toFixed(2)}`
                        : "—"}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">
                No services listed for this appointment.
              </p>
            )}
          </div>

          {appointment.notes && (
            <div className="space-y-2">
              <p className="text-sm font-semibold text-foreground">Notes</p>
              <p className="text-sm text-muted-foreground bg-background border border-border rounded-lg p-3">
                {appointment.notes}
              </p>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => router.push("/customer")}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              Go to Customer Home
            </button>
            <button
              onClick={() => router.push("/customer/my-profile")}
              className="px-4 py-2 bg-muted text-foreground rounded-lg border border-border hover:bg-background transition-colors"
            >
              View Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const InfoRow = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <div className="flex items-center gap-3 p-3 rounded-lg border border-border bg-background">
    <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-foreground">
      {icon}
    </div>
    <div className="flex flex-col">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  </div>
);
