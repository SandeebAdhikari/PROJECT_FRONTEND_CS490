import { API_ENDPOINTS, fetchConfig } from "./config";

export interface Message {
  message_id: number;
  salon_id: number;
  from_user_id: number;
  to_user_id: number;
  message: string;
  read_status: boolean;
  created_at: string;
  from_user_name?: string;
  to_user_name?: string;
}

export interface Customer {
  user_id: number;
  full_name: string;
  email: string;
  phone: string;
  last_message?: string;
  last_message_time?: string;
  unread_count: number;
}

export async function sendMessage(
  salonId: number | string,
  toUserId: number | string,
  message: string
): Promise<{ message_id?: number; message?: string; error?: string }> {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return { error: "Not authenticated" };
    }

    const response = await fetch(API_ENDPOINTS.MESSAGES.SEND, {
      ...fetchConfig,
      method: "POST",
      headers: {
        ...fetchConfig.headers,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        salon_id: salonId,
        to_user_id: toUserId,
        message,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      return { error: result.error || "Failed to send message" };
    }

    return { message_id: result.message_id, message: result.message };
  } catch (error) {
    console.error("Network error:", error);
    return { error: "Network error. Please try again." };
  }
}

export async function getSalonCustomers(
  salonId: number | string
): Promise<{ customers?: Customer[]; error?: string }> {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return { error: "Not authenticated" };
    }

    const response = await fetch(API_ENDPOINTS.MESSAGES.SALON_CUSTOMERS(salonId), {
      ...fetchConfig,
      headers: {
        ...fetchConfig.headers,
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      return { error: result.error || "Failed to fetch customers" };
    }

    return { customers: result.customers || [] };
  } catch (error) {
    console.error("Network error:", error);
    return { error: "Network error. Please try again." };
  }
}

export async function getConversation(
  salonId: number | string,
  customerId: number | string
): Promise<{ messages?: Message[]; error?: string }> {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return { error: "Not authenticated" };
    }

    const response = await fetch(API_ENDPOINTS.MESSAGES.CONVERSATION(salonId, customerId), {
      ...fetchConfig,
      headers: {
        ...fetchConfig.headers,
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      return { error: result.error || "Failed to fetch conversation" };
    }

    return { messages: result.messages || [] };
  } catch (error) {
    console.error("Network error:", error);
    return { error: "Network error. Please try again." };
  }
}

