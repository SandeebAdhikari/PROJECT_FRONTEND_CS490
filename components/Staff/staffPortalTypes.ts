export type StaffPortalAppointmentStatus =
  | "confirmed"
  | "checked-in"
  | "completed"
  | "cancelled";

export interface StaffPortalAppointment {
  id: number;
  client: string;
  service: string;
  status: StaffPortalAppointmentStatus;
  time: string;
  duration: number;
  price: number;
  notes?: string;
}

export interface StaffPortalCustomer {
  id: number;
  name: string;
  favoriteService: string;
  visits: number;
  lastVisit: string;
  lifetimeValue: number;
  phone?: string;
  notes?: string;
}

export interface StaffPortalProduct {
  id: number;
  name: string;
  brand: string;
  retailPrice: number;
  stock: number;
  attachRate: number;
  hero?: boolean;
}
