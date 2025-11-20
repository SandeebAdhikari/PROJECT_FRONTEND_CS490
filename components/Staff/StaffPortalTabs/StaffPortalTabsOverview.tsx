"use client";

import React from "react";
import { CalendarClock, Sparkles, Users } from "lucide-react";
import { StaffMember } from "@/components/Dashboard/Staff/Staffcard";
import {
  StaffPortalAppointment,
  StaffPortalCustomer,
} from "@/components/Staff/staffPortalTypes";

interface StaffPortalTabsOverviewProps {
  appointments: StaffPortalAppointment[];
  nextAppointment?: StaffPortalAppointment;
  customers: StaffPortalCustomer[];
  teamMembers: StaffMember[];
  onCreateAppointment: () => void;
  onAddStaff: () => void;
  onEditStaff: (staff: StaffMember) => void;
}

const formatTime = (value?: string) => {
  if (!value) return "--";
  return new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
};

const StaffPortalTabsOverview: React.FC<StaffPortalTabsOverviewProps> = ({
  appointments,
  nextAppointment,
  customers,
  teamMembers,
  onCreateAppointment,
  onAddStaff,
  onEditStaff,
}) => {
  const favoriteGuests = customers.slice(0, 3);
  const upcoming = [...appointments]
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
                {nextAppointment?.client ?? "All caught up"}
              </p>
            </div>
          </div>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Time</dt>
              <dd className="font-semibold">{formatTime(nextAppointment?.time)}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Service</dt>
              <dd className="font-semibold">
                {nextAppointment?.service ?? "Review tomorrow's list"}
              </dd>
            </div>
          </dl>
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
            <li>• Offer hydration add-on to color guests</li>
            <li>• Capture before / after for Tessa&apos;s refresh</li>
            <li>• Rebook Marina + send calm skin routine</li>
          </ul>
          <button
            type="button"
            onClick={onAddStaff}
            className="mt-5 inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm font-semibold text-foreground hover:bg-white transition-smooth"
          >
            <Users className="h-4 w-4" />
            Loop in support stylist
          </button>
        </article>

        <article className="rounded-2xl border border-border bg-white p-5 shadow-soft-br">
          <p className="text-sm text-muted-foreground">Favorite guests</p>
          <div className="mt-4 space-y-3">
            {favoriteGuests.map((guest) => (
              <div
                key={guest.id}
                className="flex items-center justify-between rounded-2xl border border-border px-4 py-3"
              >
                <div>
                  <p className="font-semibold">{guest.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {guest.favoriteService}
                  </p>
                </div>
                <span className="text-xs font-semibold text-primary">
                  {guest.visits} visits
                </span>
              </div>
            ))}
          </div>
        </article>
      </div>

      <div className="rounded-2xl border border-border bg-white p-5 shadow-soft-br">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm text-muted-foreground">Team roster</p>
            <h3 className="text-xl font-semibold">
              Support ready to jump in
            </h3>
          </div>
          <button
            type="button"
            onClick={onAddStaff}
            className="rounded-full border border-border px-4 py-2 text-sm font-semibold hover:bg-muted/40 transition-smooth"
          >
            Add teammate
          </button>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {teamMembers.map((member) => (
            <div
              key={member.staff_id}
              className="rounded-2xl border border-border px-4 py-3"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">{member.full_name}</p>
                  <p className="text-xs text-muted-foreground">
                    {member.staff_role}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onEditStaff(member)}
                  className="text-sm font-semibold text-primary hover:text-primary/80"
                >
                  edit
                </button>
              </div>
              <div className="mt-3 flex items-center gap-4 text-sm">
                <p className="text-muted-foreground">
                  Eff.{" "}
                  <span className="font-semibold text-foreground">
                    {member.efficiency_percentage || 0}%
                  </span>
                </p>
                <p className="text-muted-foreground">
                  Reviews{" "}
                  <span className="font-semibold text-foreground">
                    {member.review_count || 0}
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

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
              <p className="mt-1 text-lg font-semibold">{item.client}</p>
              <p className="text-sm text-muted-foreground">{item.service}</p>
              <p className="mt-2 text-sm font-semibold text-primary">
                {formatTime(item.time)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StaffPortalTabsOverview;
