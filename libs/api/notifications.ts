import { API_ENDPOINTS, fetchConfig } from "./config";

export interface Notification {
  notification_id: number;
  user_id: number;
  type: string;
  message: string;
  read_status: boolean;
  created_at: string;
}

// get all notifications
export async function getNotifications(): Promise<{
  notifications?: Notification[];
  error?: string;
}> {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return { error: "Not authenticated" };
    }

    const response = await fetch(API_ENDPOINTS.NOTIFICATIONS.LIST, {
      ...fetchConfig,
      headers: {
        ...fetchConfig.headers,
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorResult = await response
        .json()
        .catch(() => ({ error: `HTTP ${response.status}` }));
      console.error("Failed to fetch notifications:", {
        status: response.status,
        statusText: response.statusText,
        error: errorResult,
      });
      return { error: errorResult.error || "Failed to get notifications" };
    }

    const result = await response.json();
    console.log("Notifications fetched:", result);

    // Handle both array and object with notifications property
    const notifications = Array.isArray(result)
      ? result
      : result.notifications || [];
    return { notifications };
  } catch {
    return { error: "Network error. Please try again." };
  }
}

// mark one notification as read
export async function markNotificationRead(
  notificationId: number
): Promise<{ message?: string; error?: string }> {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return { error: "Not authenticated" };
    }

    const response = await fetch(
      API_ENDPOINTS.NOTIFICATIONS.MARK_READ(notificationId),
      {
        ...fetchConfig,
        method: "PUT",
        headers: {
          ...fetchConfig.headers,
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result = await response.json();

    if (!response.ok) {
      return { error: result.error || "Failed to mark notification as read" };
    }

    return result;
  } catch {
    return { error: "Network error. Please try again." };
  }
}

// mark all notifications as read
export async function markAllNotificationsRead(): Promise<{
  message?: string;
  error?: string;
}> {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return { error: "Not authenticated" };
    }

    const response = await fetch(API_ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ, {
      ...fetchConfig,
      method: "PUT",
      headers: {
        ...fetchConfig.headers,
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        error: result.error || "Failed to mark all notifications as read",
      };
    }

    return result;
  } catch {
    return { error: "Network error. Please try again." };
  }
}

export interface LoyalCustomer {
  user_id: number;
  name: string;
  email: string;
  visits: number;
  total_spent: number;
  last_visit: string | null;
}

// Get loyal customers for a salon
export async function getLoyalCustomers(
  salonId: number,
  minVisits?: number,
  minSpent?: number
): Promise<{ customers?: LoyalCustomer[]; error?: string }> {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return { error: "Not authenticated" };
    }

    const response = await fetch(API_ENDPOINTS.NOTIFICATIONS.LOYAL_CUSTOMERS, {
      ...fetchConfig,
      method: "POST",
      headers: {
        ...fetchConfig.headers,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        salon_id: salonId,
        min_visits: minVisits,
        min_spent: minSpent,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      return { error: result.error || "Failed to get loyal customers" };
    }

    return { customers: result.customers || [] };
  } catch {
    return { error: "Network error. Please try again." };
  }
}

// Send promotional offer to customers
export async function sendPromotionToCustomers(
  salonId: number,
  userIds: number[],
  message: string
): Promise<{ message?: string; notification_count?: number; error?: string }> {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return { error: "Not authenticated" };
    }

    const response = await fetch(API_ENDPOINTS.NOTIFICATIONS.SEND_PROMOTION, {
      ...fetchConfig,
      method: "POST",
      headers: {
        ...fetchConfig.headers,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        salon_id: salonId,
        user_ids: userIds,
        message: message.trim(),
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      return { error: result.error || "Failed to send promotional offer" };
    }

    return result;
  } catch {
    return { error: "Network error. Please try again." };
  }
}
