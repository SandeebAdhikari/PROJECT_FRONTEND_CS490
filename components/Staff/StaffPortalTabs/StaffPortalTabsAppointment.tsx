"use client";

import React from "react";
import { CalendarDays, Clock3, Pencil } from "lucide-react";
import { StaffPortalAppointment } from "@/components/Staff/staffPortalTypes";

interface StaffPortalTabsAppointmentProps {
  appointments: StaffPortalAppointment[];
  onCreateAppointment: () => void;
  onEditAppointment: (appointmentId: number) => void;
  onUpdateStatus?: (appointmentId: number, status: string) => Promise<void>;
}

const statusClassMap: Record<
  StaffPortalAppointment["status"],
  string
> = {
  confirmed: "bg-blue-50 text-blue-700",
  "checked-in": "bg-amber-50 text-amber-700",
  completed: "bg-emerald-50 text-emerald-700",
  cancelled: "bg-rose-50 text-rose-700",
};

const StaffPortalTabsAppointment: React.FC<
  StaffPortalTabsAppointmentProps
> = ({ appointments, onCreateAppointment, onEditAppointment, onUpdateStatus: _onUpdateStatus }) => {
  const sortedAppointments = [...appointments].sort(
    (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground">
            {sortedAppointments.length} guests scheduled
          </p>
          <h3 className="text-xl font-semibold">Appointments</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onCreateAppointment}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white"
          >
            <CalendarDays className="h-4 w-4" />
            Book guest
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {sortedAppointments.map((appt) => (
          <article
            key={appt.id}
            className="rounded-2xl border border-border bg-white px-4 py-3 shadow-soft-br"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-lg font-semibold">{appt.client}</p>
                <p className="text-sm text-muted-foreground">{appt.service}</p>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                  statusClassMap[appt.status]
                }`}
              >
                {appt.status.replace("-", " ")}
              </span>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
              <div className="inline-flex items-center gap-2 text-muted-foreground">
                <Clock3 className="h-4 w-4" />
                {new Intl.DateTimeFormat("en", {
                  hour: "numeric",
                  minute: "2-digit",
                }).format(new Date(appt.time))}
              </div>
              <p className="text-muted-foreground">
                Duration:{" "}
                <span className="font-semibold text-foreground">
                  {appt.duration} min
                </span>
              </p>
              <p className="text-muted-foreground">
                Ticket:{" "}
                <span className="font-semibold text-foreground">
                  ${appt.price}
                </span>
              </p>
              {appt.notes && (
                <p className="text-muted-foreground line-clamp-1 flex-1">
                  {appt.notes}
                </p>
              )}
              <button
                type="button"
                onClick={() => onEditAppointment(appt.id)}
                className="ml-auto inline-flex items-center gap-1 rounded-full border border-border px-3 py-1 text-xs font-semibold text-foreground hover:bg-muted/50"
              >
                <Pencil className="h-3.5 w-3.5" />
                Edit
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default StaffPortalTabsAppointment;
