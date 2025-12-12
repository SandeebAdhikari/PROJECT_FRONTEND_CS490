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
        headers: {
          ...fetchConfig.headers,
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const result = await response.json();
      return { error: result.error || "Failed to get trends" };
    }

    const trends = await response.json();
    return { trends: Array.isArray(trends) ? trends : [] };
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
        headers: {
          ...fetchConfig.headers,
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const result = await response.json();
      return { error: result.error || "Failed to get revenues" };
    }

    const revenues = await response.json();
    return { revenues: Array.isArray(revenues) ? revenues : [] };
  } catch (error) {
    console.error("Get revenues error:", error);
    return { error: "Network error. Please try again." };
  }
}

export interface UserEngagement {
  activeUsers: { active_user_count: number };
  totalUsers: { total_user_count: number };
}

export interface UserDemographic {
  user_role: string;
  count: number;
}

export interface CustomerRetention {
  retained_customers: number;
}

/**
 * Get user engagement stats
 */
export async function getUserEngagement(): Promise<{ engagement?: UserEngagement; error?: string }> {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return { error: "Not authenticated" };
    }

    const response = await fetch(API_ENDPOINTS.ADMINS.USER_ENGAGEMENT, {
      ...fetchConfig,
      headers: {
        ...fetchConfig.headers,
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const result = await response.json();
      return { error: result.error || "Failed to get user engagement" };
    }

    const engagement = await response.json();
    return { engagement };
  } catch (error) {
    console.error("Get user engagement error:", error);
    return { error: "Network error. Please try again." };
  }
}

/**
 * Get user demographics
 */
export async function getUserDemographics(): Promise<{ demographics?: UserDemographic[]; error?: string }> {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return { error: "Not authenticated" };
    }

    const response = await fetch(API_ENDPOINTS.ADMINS.USER_DEMOGRAPHICS, {
      ...fetchConfig,
      headers: {
        ...fetchConfig.headers,
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const result = await response.json();
      return { error: result.error || "Failed to get demographics" };
    }

    const demographics = await response.json();
    return { demographics: Array.isArray(demographics) ? demographics : [] };
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

export interface LoyaltyUsageOverview {
  total_enrolled_users: number;
  active_users_30d: number;
  total_points_outstanding: number;
  avg_points_per_user: number;
  max_points: number;
  users_who_redeemed: number;
  recent_redeemers_30d: number;
}

export interface LoyaltySalonBreakdown {
  salon_id: number;
  salon_name: string;
  enrolled_users: number;
  total_points: number;
  avg_points_per_user: number;
  active_users_30d: number;
}

export interface LoyaltyTrend {
  date: string;
  points_activity: number;
}

export interface LoyaltyUsage {
  overview: LoyaltyUsageOverview;
  salon_breakdown: LoyaltySalonBreakdown[];
  trends: LoyaltyTrend[];
}

/**
 * Get loyalty program usage statistics
 */
export async function getLoyaltyUsage(): Promise<{ usage?: LoyaltyUsage; error?: string }> {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return { error: "Not authenticated" };
    }

    const response = await fetch(API_ENDPOINTS.ADMINS.LOYALTY_USAGE, {
      ...fetchConfig,
      headers: {
        ...fetchConfig.headers,
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const result = await response.json();
      return { error: result.error || "Failed to get loyalty usage" };
    }

    const usage = await response.json();
    return { usage };
  } catch (error) {
    console.error("Get loyalty usage error:", error);
    return { error: "Network error. Please try again." };
  }
}

export interface SystemLog {
  audit_id: number;
  salon_id: number;
  event_type: string;
  event_note: string;
  performed_by: number | null;
  created_at: string;
}

export interface SystemLogEventSummary {
  event_type: string;
  count: number;
}

export interface SystemLogErrorTrend {
  date: string;
  error_count: number;
}

export interface SystemLogsResponse {
  event_summary: SystemLogEventSummary[];
  recent_logs: SystemLog[];
  error_trends: SystemLogErrorTrend[];
}

export interface HealthCheck {
  status: string;
  latency_ms?: number;
  connected?: boolean;
  error?: string;
  table_count?: number;
  error_percentage?: number;
  total_events_1h?: number;
  error_events_1h?: number;
  scheduled_appointments?: number;
  active_users_24h?: number;
  payments_last_hour?: number;
}

export interface SystemHealth {
  status: "healthy" | "degraded" | "unhealthy" | "error";
  timestamp: string;
  checks: {
    database: HealthCheck;
    database_tables: HealthCheck;
    error_rate: HealthCheck;
    system_load: HealthCheck;
  };
}

export interface PlatformUptime {
  uptime_percentage: number;
  uptime_seconds: number;
  uptime_days: number;
  oldest_record: string;
  latest_record: string;
}

export interface PlatformReliability {
  success_rate_30d: number;
  total_events_30d: number;
  successful_events: number;
  failed_events: number;
}

export interface PlatformPerformance {
  avg_appointment_processing_time_sec: number;
  total_appointments_7d: number;
  completed_appointments_7d: number;
  cancelled_appointments_7d: number;
  completion_rate_7d: string;
}

export interface DailyActivity {
  date: string;
  total_events: number;
  successful_events: number;
  failed_events: number;
}

export interface PlatformReliabilityResponse {
  uptime: PlatformUptime;
  reliability: PlatformReliability;
  performance: PlatformPerformance;
  daily_activity: DailyActivity[];
}

/**
 * Get system logs with enhanced details
 */
export async function getSystemLogs(
  limit?: number
): Promise<{ logs?: SystemLogsResponse; error?: string }> {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return { error: "Not authenticated" };
    }

    const url = limit
      ? `${API_ENDPOINTS.ADMINS.SYSTEM_LOGS}?limit=${limit}`
      : API_ENDPOINTS.ADMINS.SYSTEM_LOGS;

    const response = await fetch(url, {
      ...fetchConfig,
      headers: {
        ...fetchConfig.headers,
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const result = await response.json();
      return { error: result.error || "Failed to get system logs" };
    }

    const logs = await response.json();
    return { logs };
  } catch (error) {
    console.error("Get system logs error:", error);
    return { error: "Network error. Please try again." };
  }
}

/**
 * Get comprehensive system health metrics
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
      const result = await response.json();
      return { error: result.error || "Failed to get system health" };
    }

    const health = await response.json();
    return { health };
  } catch (error) {
    console.error("Get system health error:", error);
    return { error: "Network error. Please try again." };
  }
}

/**
 * Get platform reliability and uptime metrics
 */
export async function getPlatformReliability(): Promise<{
  reliability?: PlatformReliabilityResponse;
  error?: string
}> {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return { error: "Not authenticated" };
    }

    const response = await fetch(API_ENDPOINTS.ADMINS.PLATFORM_RELIABILITY, {
      ...fetchConfig,
      headers: {
        ...fetchConfig.headers,
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const result = await response.json();
      return { error: result.error || "Failed to get platform reliability" };
    }

    const reliability = await response.json();
    return { reliability };
  } catch (error) {
    console.error("Get platform reliability error:", error);
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

