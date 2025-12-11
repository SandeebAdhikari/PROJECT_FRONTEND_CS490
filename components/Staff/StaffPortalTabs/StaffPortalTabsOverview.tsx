"use client";

import React from "react";
import { CalendarClock, Sparkles } from "lucide-react";
import {
  StaffPortalAppointment,
  StaffPortalCustomer,
} from "@/components/Staff/staffPortalTypes";

interface StaffPortalTabsOverviewProps {
  appointments: StaffPortalAppointment[];
  nextAppointment?: StaffPortalAppointment;
  customers: StaffPortalCustomer[];
  teamMembers: never[];
  onCreateAppointment: () => void;
  onAddStaff: () => void;
  onEditStaff: (staff: never) => void;
}

const formatTime = (value?: string) => {
  if (!value) return "--";
  // Remove Z suffix to treat as local time (database stores local time, not UTC)
  const localValue = value.endsWith('Z') ? value.slice(0, -1) : value;
  return new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(localValue));
};

const StaffPortalTabsOverview: React.FC<StaffPortalTabsOverviewProps> = ({
  appointments,
  nextAppointment,
  customers,
  teamMembers: _teamMembers,
  onCreateAppointment,
  onAddStaff: _onAddStaff,
  onEditStaff: _onEditStaff,
}) => {
  // Filter out customers with no name or invalid data
  const favoriteGuests = customers
    .filter((c) => c.name && c.id)
    .slice(0, 3);
  
  // Filter upcoming appointments (future appointments only, not cancelled/completed)
  const upcoming = [...appointments]
    .filter((appt) => {
      const apptDate = new Date(appt.time);
      const now = new Date();
      return apptDate >= now && appt.status !== "cancelled" && appt.status !== "completed";
    })
    .sort(
      (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()
    )
    .slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-3">
        <article className="rounded-2xl border border-border bg-white p-5 shadow-soft-br">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-primary/10 text-primary p-3">
              <CalendarClock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Next guest</p>
              <p className="text-lg font-semibold">
                {nextAppointment?.client || "All caught up"}
              </p>
            </div>
          </div>
          {nextAppointment && nextAppointment.client ? (
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Time</dt>
                <dd className="font-semibold">{formatTime(nextAppointment.time)}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Service</dt>
                <dd className="font-semibold">
                  {nextAppointment.service || "Service"}
                </dd>
              </div>
            </dl>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">
              No upcoming appointments scheduled
            </p>
          )}
          <button
            type="button"
            onClick={onCreateAppointment}
            className="mt-4 w-full rounded-xl bg-primary text-primary-foreground py-2.5 font-semibold hover:bg-primary/90 transition-smooth"
          >
            New appointment
          </button>
        </article>

        <article className="rounded-2xl border border-border bg-muted/20 p-5 shadow-inner">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-emerald-100 text-emerald-600 p-3">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Shift checklist</p>
              <p className="text-lg font-semibold">3 wins to focus on</p>
            </div>
          </div>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>• Review today&apos;s appointments</li>
            <li>• Check customer notes and preferences</li>
            <li>• Prepare for upcoming services</li>
          </ul>
        </article>

        <article className="rounded-2xl border border-border bg-white p-5 shadow-soft-br">
          <p className="text-sm text-muted-foreground">Favorite guests</p>
          {favoriteGuests.length === 0 ? (
            <div className="mt-4 text-center py-8">
              <p className="text-sm text-muted-foreground">No customers yet</p>
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              {favoriteGuests.map((guest) => (
                <div
                  key={guest.id}
                  className="flex items-center justify-between rounded-2xl border border-border px-4 py-3"
                >
                  <div>
                    <p className="font-semibold">{guest.name || ""}</p>
                    <p className="text-xs text-muted-foreground">
                      {guest.favoriteService || ""}
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-primary">
                    {Number(guest.visits) || 0} {Number(guest.visits) === 1 ? "visit" : "visits"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </article>
      </div>


      {upcoming.length > 0 && (
        <div className="rounded-2xl border border-border bg-muted/30 p-5">
          <p className="text-sm text-muted-foreground">Upcoming</p>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {upcoming.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-border bg-white/90 p-4"
              >
                <p className="text-xs uppercase text-muted-foreground">
                  {new Date(item.time).toLocaleDateString(undefined, {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
                <p className="mt-1 text-lg font-semibold">{item.client || ""}</p>
                <p className="text-sm text-muted-foreground">{item.service || "Service"}</p>
                <p className="mt-2 text-sm font-semibold text-primary">
                  {formatTime(item.time)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffPortalTabsOverview;
