import { API_BASE_URL, fetchConfig } from "./config";

export interface StaffPortalDashboard {
  totals: {
    total: number;
    completed: number;
    confirmed: number;
    pending: number;
    cancelled: number;
    revenue_today: number;
  };
  upcoming: {
    appointment_id: number;
    scheduled_time: string;
    status: string;
    price: number;
    customer_name: string;
    customer_phone: string;
    customer_email: string;
    services: string;
    duration_minutes: number;
  } | null;
  recent_performance: {
    completed: number;
    revenue: number;
  };
  shift: {
    start: string | null;
    end: string | null;
    focus: string;
  };
}

export interface StaffPortalAppointmentBackend {
  appointment_id: number;
  scheduled_time: string;
  status: string;
  price: number;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  services: string;
  duration_minutes: number;
  notes?: string;
}

export interface StaffPortalCustomerBackend {
  user_id: number;
  full_name: string;
  phone: string;
  email: string;
  total_visits: number;
  last_visit: string;
  lifetime_value: number;
  favorite_service: string;
  notes?: string;
}

export interface StaffPortalProductBackend {
  product_id: number;
  name: string;
  brand?: string;
  price: number;
  stock: number;
  attach_rate?: number;
}

export interface StaffProfile {
  staff_id: number;
  full_name: string;
  staff_role: string;
  specialization: string;
  salon_id: number;
  salon_name: string;
  email: string;
  phone: string;
}

export interface StaffAvailability {
  availability_id?: number;
  day_of_week: string;
  start_time: string;
  end_time: string;
  is_available: boolean;
}

/**
 * Staff Portal Login
 */
export async function staffPortalLogin(
  staffCode: string,
  pin: string
): Promise<{
  token: string;
  staff: StaffProfile;
  dashboard: StaffPortalDashboard;
}> {
  const response = await fetch(`${API_BASE_URL}/api/staff-portal/login`, {
    ...fetchConfig,
    method: "POST",
    body: JSON.stringify({ staffCode, pin }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Login failed" }));
    throw new Error(error.error || "Login failed");
  }

  const data = await response.json();
  
  // Store token
  if (typeof window !== "undefined") {
    localStorage.setItem("staffToken", data.token);
    localStorage.setItem("staffUser", JSON.stringify(data.staff));
  }

  return data;
}

/**
 * Get Staff Profile
 */
export async function getStaffProfile(): Promise<StaffProfile> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("staffToken") : null;

  if (!token) {
    throw new Error("Not authenticated");
  }

  const response = await fetch(`${API_BASE_URL}/api/staff-portal/me`, {
    ...fetchConfig,
    headers: {
      ...fetchConfig.headers,
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Failed to fetch profile" }));
    throw new Error(error.error || "Failed to fetch profile");
  }

  const data = await response.json();
  return data.staff;
}

/**
 * Get Staff Dashboard Summary
 */
export async function getStaffDashboard(
  date?: string
): Promise<StaffPortalDashboard> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("staffToken") : null;

  if (!token) {
    throw new Error("Not authenticated");
  }

  const url = date
    ? `${API_BASE_URL}/api/staff-portal/dashboard?date=${date}`
    : `${API_BASE_URL}/api/staff-portal/dashboard`;

  const response = await fetch(url, {
    ...fetchConfig,
    headers: {
      ...fetchConfig.headers,
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Failed to fetch dashboard" }));
    throw new Error(error.error || "Failed to fetch dashboard");
  }

  return await response.json();
}

/**
 * List Staff Appointments
 */
export async function listStaffAppointments(params?: {
  status?: string;
  date?: string;
  from?: string;
  to?: string;
  range?: string;
  page?: number;
  limit?: number;
}): Promise<{
  data: StaffPortalAppointmentBackend[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasMore: boolean;
  };
}> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("staffToken") : null;

  if (!token) {
    throw new Error("Not authenticated");
  }

  const queryParams = new URLSearchParams();
  if (params?.status) queryParams.append("status", params.status);
  if (params?.date) queryParams.append("date", params.date);
  if (params?.from) queryParams.append("from", params.from);
  if (params?.to) queryParams.append("to", params.to);
  if (params?.range) queryParams.append("range", params.range);
  if (params?.page) queryParams.append("page", String(params.page));
  if (params?.limit) queryParams.append("limit", String(params.limit));

  const url = `${API_BASE_URL}/api/staff-portal/appointments${
    queryParams.toString() ? `?${queryParams.toString()}` : ""
  }`;

  const response = await fetch(url, {
    ...fetchConfig,
    headers: {
      ...fetchConfig.headers,
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Failed to fetch appointments" }));
    throw new Error(error.error || "Failed to fetch appointments");
  }

  return await response.json();
}

/**
 * Get Appointment Details
 */
export async function getStaffAppointment(
  appointmentId: number
): Promise<StaffPortalAppointmentBackend> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("staffToken") : null;

  if (!token) {
    throw new Error("Not authenticated");
  }

  const response = await fetch(
    `${API_BASE_URL}/api/staff-portal/appointments/${appointmentId}`,
    {
      ...fetchConfig,
      headers: {
        ...fetchConfig.headers,
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Failed to fetch appointment" }));
    throw new Error(error.error || "Failed to fetch appointment");
  }

  const data = await response.json();
  return data.appointment;
}

/**
 * Update Appointment Status
 */
export async function updateAppointmentStatus(
  appointmentId: number,
  status: string,
  notes?: string
): Promise<StaffPortalAppointmentBackend> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("staffToken") : null;

  if (!token) {
    throw new Error("Not authenticated");
  }

  const response = await fetch(
    `${API_BASE_URL}/api/staff-portal/appointments/${appointmentId}/status`,
    {
      ...fetchConfig,
      method: "PATCH",
      headers: {
        ...fetchConfig.headers,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status, notes }),
    }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Failed to update appointment" }));
    throw new Error(error.error || "Failed to update appointment");
  }

  const data = await response.json();
  return data.appointment;
}

/**
 * List Customers
 */
export async function listStaffCustomers(params?: {
  scope?: "staff" | "salon";
  limit?: number;
}): Promise<{
  customers: StaffPortalCustomerBackend[];
}> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("staffToken") : null;

  if (!token) {
    throw new Error("Not authenticated");
  }

  const queryParams = new URLSearchParams();
  if (params?.scope) queryParams.append("scope", params.scope);
  if (params?.limit) queryParams.append("limit", String(params.limit));

  const url = `${API_BASE_URL}/api/staff-portal/customers${
    queryParams.toString() ? `?${queryParams.toString()}` : ""
  }`;

  const response = await fetch(url, {
    ...fetchConfig,
    headers: {
      ...fetchConfig.headers,
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Failed to fetch customers" }));
    throw new Error(error.error || "Failed to fetch customers");
  }

  return await response.json();
}

/**
 * List Retail Products
 */
export async function listStaffRetail(params?: {
  limit?: number;
}): Promise<{
  products: StaffPortalProductBackend[];
}> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("staffToken") : null;

  if (!token) {
    throw new Error("Not authenticated");
  }

  const queryParams = new URLSearchParams();
  if (params?.limit) queryParams.append("limit", String(params.limit));

  const url = `${API_BASE_URL}/api/staff-portal/retail${
    queryParams.toString() ? `?${queryParams.toString()}` : ""
  }`;

  const response = await fetch(url, {
    ...fetchConfig,
    headers: {
      ...fetchConfig.headers,
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Failed to fetch products" }));
    throw new Error(error.error || "Failed to fetch products");
  }

  return await response.json();
}

/**
 * List Team Members
 */
export async function listStaffTeam(params?: {
  limit?: number;
}): Promise<{
  team: StaffProfile[];
}> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("staffToken") : null;

  if (!token) {
    throw new Error("Not authenticated");
  }

  const queryParams = new URLSearchParams();
  if (params?.limit) queryParams.append("limit", String(params.limit));

  const url = `${API_BASE_URL}/api/staff-portal/team${
    queryParams.toString() ? `?${queryParams.toString()}` : ""
  }`;

  const response = await fetch(url, {
    ...fetchConfig,
    headers: {
      ...fetchConfig.headers,
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Failed to fetch team" }));
    throw new Error(error.error || "Failed to fetch team");
  }

  return await response.json();
}

/**
 * Get Staff Availability
 */
export async function getStaffAvailability(): Promise<{
  availability: StaffAvailability[];
}> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("staffToken") : null;

  if (!token) {
    throw new Error("Not authenticated");
  }

  const response = await fetch(`${API_BASE_URL}/api/staff-portal/availability`, {
    ...fetchConfig,
    headers: {
      ...fetchConfig.headers,
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Failed to fetch availability" }));
    throw new Error(error.error || "Failed to fetch availability");
  }

  return await response.json();
}

/**
 * Update Staff Availability
 */
export async function updateStaffAvailability(
  availability: StaffAvailability[]
): Promise<{
  message: string;
  availability: StaffAvailability[];
}> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("staffToken") : null;

  if (!token) {
    throw new Error("Not authenticated");
  }

  const response = await fetch(`${API_BASE_URL}/api/staff-portal/availability`, {
    ...fetchConfig,
    method: "PUT",
    headers: {
      ...fetchConfig.headers,
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ availability }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Failed to update availability" }));
    throw new Error(error.error || "Failed to update availability");
  }

  return await response.json();
}

