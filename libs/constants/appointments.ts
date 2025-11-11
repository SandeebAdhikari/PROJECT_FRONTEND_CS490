export const APPOINTMENT_STATUSES = [
  "booked",
  "pending",
  "confirmed",
  "completed",
  "cancelled",
] as const;

export type AppointmentStatus = (typeof APPOINTMENT_STATUSES)[number];

type StatusMeta = {
  label: string;
  badgeClass: string;
};

export const APPOINTMENT_STATUS_META: Record<AppointmentStatus, StatusMeta> = {
  booked: {
    label: "Booked",
    badgeClass: "bg-blue-100 text-blue-700",
  },
  pending: {
    label: "Pending",
    badgeClass: "bg-amber-100 text-amber-700",
  },
  confirmed: {
    label: "Confirmed",
    badgeClass: "bg-emerald-100 text-emerald-700",
  },
  completed: {
    label: "Completed",
    badgeClass: "bg-indigo-100 text-indigo-700",
  },
  cancelled: {
    label: "Cancelled",
    badgeClass: "bg-red-100 text-red-700",
  },
};

export const REVENUE_ELIGIBLE_STATUSES: AppointmentStatus[] = [
  "confirmed",
  "completed",
];

export const DEFAULT_APPOINTMENT_STATUS: AppointmentStatus = "pending";

export const normalizeAppointmentStatus = (
  status?: string | null
): AppointmentStatus => {
  if (!status) return DEFAULT_APPOINTMENT_STATUS;
  const normalized = status.trim().toLowerCase();
  if (normalized === "canceled") return "cancelled";
  if (
    (APPOINTMENT_STATUSES as readonly string[]).includes(
      normalized
    )
  ) {
    return normalized as AppointmentStatus;
  }
  return DEFAULT_APPOINTMENT_STATUS;
};

export const appointmentStatusOptions = (
  includeLegacyBooked = false
): Array<{ value: AppointmentStatus; label: string }> => {
  const statuses = APPOINTMENT_STATUSES.filter((status) =>
    includeLegacyBooked ? true : status !== "booked"
  );
  return statuses.map((status) => ({
    value: status,
    label: APPOINTMENT_STATUS_META[status].label,
  }));
};
