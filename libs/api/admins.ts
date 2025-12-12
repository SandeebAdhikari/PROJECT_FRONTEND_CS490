import { API_ENDPOINTS, fetchConfig } from "./config";

export interface AdminReport {
  salon_id: number;
  salon_name: string;
  total_sales: number;
}

export interface AppointmentTrend {
  hour: number;
  appointments: number;
}

export interface SalonRevenue {
  salon_id: number;
  salon_name: string;
  total_revenue: number;
}

export interface LoyaltyUsage {
  salon_id: number;
  salon_name?: string;
  total_points: number;
}

export interface SystemHealth {
  uptime_percent: number;
  avg_latency_ms: number;
  error_rate_per_min: number;
  total_errors_24h?: number;
  last_up?: string;
  last_down?: string;
  sentry_enabled?: boolean;
  incidents?: Array<{
    id?: number | string;
    title?: string;
    summary?: string;
    started_at?: string;
    resolved_at?: string | null;
    status?: string;
    severity?: string;
  }>;
  recent_errors?: Array<{
    id: number | string;
    service: string;
    message: string;
    timestamp: string;
    severity: "info" | "warn" | "error" | "critical";
  }>;
  error_trend?: Array<{ minute: string; count: number }>;
}

/**
 * Export admin reports as CSV
 */
export async function exportAdminReports(
  startDate?: string,
  endDate?: string
): Promise<{ success?: boolean; error?: string }> {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return { error: "Not authenticated" };
    }

    const params = new URLSearchParams();
    if (startDate) params.append("start_date", startDate);
    if (endDate) params.append("end_date", endDate);
    params.append("format", "csv");

    const response = await fetch(
      `${API_ENDPOINTS.ADMINS.REPORTS(startDate, endDate, "csv")}`,
      {
        ...fetchConfig,
        headers: {
          ...fetchConfig.headers,
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const result = await response.json();
      return { error: result.error || "Failed to export reports" };
    }

    // Get the CSV blob
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `admin-reports-${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    return { success: true };
  } catch (error) {
    console.error("Export reports error:", error);
    return { error: "Network error. Please try again." };
  }
}

/**
 * Get admin reports with optional date filters
 */
export async function getAdminReports(
  startDate?: string,
  endDate?: string
): Promise<{ reports?: AdminReport[]; error?: string }> {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return { error: "Not authenticated" };
    }

    const response = await fetch(
      API_ENDPOINTS.ADMINS.REPORTS(startDate, endDate),
      {
        ...fetchConfig,
        headers: {
          ...fetchConfig.headers,
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const result = await response.json();
      return { error: result.error || "Failed to get reports" };
    }

    const reports = await response.json();
    return { reports: Array.isArray(reports) ? reports : [] };
  } catch (error) {
    console.error("Get reports error:", error);
    return { error: "Network error. Please try again." };
  }
}

/**
 * Get appointment trends with optional date filters
 */
export async function getAppointmentTrends(
  startDate?: string,
  endDate?: string
): Promise<{ trends?: AppointmentTrend[]; error?: string }> {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return { error: "Not authenticated" };
    }

    const response = await fetch(
      API_ENDPOINTS.ADMINS.APPOINTMENT_TRENDS(startDate, endDate),
      {
        ...fetchConfig,
        cache: "no-store",
        headers: {
          ...fetchConfig.headers,
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok && response.status !== 304) {
      const result = await response.json().catch(() => ({}));
      return { error: result.error || "Failed to get trends" };
    }

    const data = response.status === 304 ? [] : await response.json();
    const trends = Array.isArray(data) ? data : (data.trends || []);
    return { trends };
  } catch (error) {
    console.error("Get trends error:", error);
    return { error: "Network error. Please try again." };
  }
}

/**
 * Get salon revenues with optional date filters
 */
export async function getSalonRevenues(
  startDate?: string,
  endDate?: string
): Promise<{ revenues?: SalonRevenue[]; error?: string }> {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return { error: "Not authenticated" };
    }

    const response = await fetch(
      API_ENDPOINTS.ADMINS.SALON_REVENUES(startDate, endDate),
      {
        ...fetchConfig,
        cache: "no-store",
        headers: {
          ...fetchConfig.headers,
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok && response.status !== 304) {
      const result = await response.json().catch(() => ({}));
      return { error: result.error || "Failed to get revenues" };
    }

    const data = response.status === 304 ? [] : await response.json();
    const revenues = Array.isArray(data) ? data : (data.revenues || []);
    return { revenues };
  } catch (error) {
    console.error("Get revenues error:", error);
    return { error: "Network error. Please try again." };
  }
}

export interface EngagementResponse {
  customers: {
    dau_7d: number;
    mau_30d: number;
    total_users: number;
    bookings_7d: number;
    bookings_30d: number;
    completion_rate_30d: number;
    repeat_customers_90d: number;
    reviews_30d: number;
    messages_30d: number;
    inactive_60d: number;
  };
  owners: {
    active_owners_30d: number;
    active_salons_30d: number;
    total_salons: number;
    owner_created_appointments_30d: number;
    staff_logins_30d: number;
  };
}

export interface UserDemographicBucket {
  bucket: string;
  count: number;
}

export interface CustomerRetention {
  retained_customers: number;
}

/**
 * Get user engagement stats
 */
export async function getUserEngagement(): Promise<{ engagement?: EngagementResponse; error?: string }> {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return { error: "Not authenticated" };
    }

    const response = await fetch(API_ENDPOINTS.ADMINS.USER_ENGAGEMENT, {
      ...fetchConfig,
      cache: "no-store",
      headers: {
        ...fetchConfig.headers,
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok && response.status !== 304) {
      const result = await response.json().catch(() => ({}));
      return { error: result.error || "Failed to get user engagement" };
    }

    const data = response.status === 304 ? {} : await response.json();
    const engagement = (data as any).engagement || data;
    return { engagement: engagement as EngagementResponse };
  } catch (error) {
    console.error("Get user engagement error:", error);
    return { error: "Network error. Please try again." };
  }
}

/**
 * Get user demographics
 */
export interface DemographicsResponse {
  gender: UserDemographicBucket[];
  age: UserDemographicBucket[];
}

export async function getLoyaltyUsage(): Promise<{ usage?: LoyaltyUsage[]; error?: string }> {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return { error: "Not authenticated" };
    }

    const response = await fetch(API_ENDPOINTS.ADMINS.LOYALTY_USAGE, {
      ...fetchConfig,
      cache: "no-store",
      headers: {
        ...fetchConfig.headers,
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok && response.status !== 304) {
      const result = await response.json().catch(() => ({}));
      return { error: result.error || "Failed to get loyalty usage" };
    }

    const data = response.status === 304 ? [] : await response.json();
    const usage = Array.isArray(data) ? data : (data.usage || []);
    return { usage };
  } catch (error) {
    console.error("Get loyalty usage error:", error);
    return { error: "Network error. Please try again." };
  }
}

export async function getUserDemographics(): Promise<{ demographics?: DemographicsResponse; error?: string }> {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return { error: "Not authenticated" };
    }

    const response = await fetch(API_ENDPOINTS.ADMINS.USER_DEMOGRAPHICS, {
      ...fetchConfig,
      cache: "no-store",
      headers: {
        ...fetchConfig.headers,
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok && response.status !== 304) {
      const result = await response.json().catch(() => ({}));
      return { error: result.error || "Failed to get demographics" };
    }

    const data = response.status === 304 ? {} : await response.json();
    const demographics = (data as any).demographics || data;
    return { demographics: demographics as DemographicsResponse };
  } catch (error) {
    console.error("Get demographics error:", error);
    return { error: "Network error. Please try again." };
  }
}

/**
 * Get customer retention
 */
export async function getCustomerRetention(): Promise<{ retention?: CustomerRetention; error?: string }> {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return { error: "Not authenticated" };
    }

    const response = await fetch(API_ENDPOINTS.ADMINS.CUSTOMER_RETENTION, {
      ...fetchConfig,
      headers: {
        ...fetchConfig.headers,
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const result = await response.json();
      return { error: result.error || "Failed to get retention" };
    }

    const retention = await response.json();
    return { retention };
  } catch (error) {
    console.error("Get retention error:", error);
    return { error: "Network error. Please try again." };
  }
}

export interface PendingSalon {
  salon_id: number;
  name: string;
  salon_name: string;
  address: string;
  city: string;
  state: string;
  phone: string;
  email: string;
  description: string;
  approved: string;
  status: string;
  created_at: string;
  owner_name: string;
  owner_email: string;
}

/**
 * Get pending salon registrations
 */
export async function getPendingSalons(): Promise<{ salons?: PendingSalon[]; count?: number; error?: string }> {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return { error: "Not authenticated" };
    }

    const response = await fetch(API_ENDPOINTS.ADMINS.PENDING_SALONS, {
      ...fetchConfig,
      headers: {
        ...fetchConfig.headers,
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const result = await response.json();
      return { error: result.error || "Failed to get pending salons" };
    }

    const data = await response.json();
    return { salons: data.salons || [], count: data.count || 0 };
  } catch (error) {
    console.error("Get pending salons error:", error);
    return { error: "Network error. Please try again." };
  }
}

/**
 * Verify salon registration (approve/reject)
 */
export async function verifySalon(
  salonId: number | string,
  approved: "approved" | "rejected" | "pending"
): Promise<{ success?: boolean; salon?: Record<string, unknown>; message?: string; error?: string }> {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return { error: "Not authenticated" };
    }

    const response = await fetch(API_ENDPOINTS.ADMINS.VERIFY_SALON(salonId), {
      ...fetchConfig,
      method: "POST",
      headers: {
        ...fetchConfig.headers,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ approved }),
    });

    if (!response.ok) {
      const result = await response.json();
      return { error: result.error || "Failed to verify salon" };
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Verify salon error:", error);
    return { error: "Network error. Please try again." };
  }
}

/**
 * Get platform system health (uptime/errors)
 */
export async function getSystemHealth(): Promise<{ health?: SystemHealth; error?: string }> {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return { error: "Not authenticated" };
    }

    const response = await fetch(API_ENDPOINTS.ADMINS.SYSTEM_HEALTH, {
      ...fetchConfig,
      headers: {
        ...fetchConfig.headers,
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const result = await response.json().catch(() => ({}));
      return { error: result.error || "Failed to fetch system health" };
    }

    const data = await response.json();
    return { health: data };
  } catch (error) {
    console.error("Get system health error:", error);
    return { error: "Network error. Please try again." };
  }
}
