import { API_ENDPOINTS, fetchConfig } from "./config";

export interface SubscriptionPayment {
  payment_id: number;
  plan_name: string;
  amount: number;
  currency: string;
  status: string;
  stripe_session_id: string | null;
  created_at: string;
}

export interface SubscriptionStatus {
  plan: string;
  status: string;
  started_at: string | null;
  updated_at: string | null;
}

/**
 * Create a subscription checkout session
 */
export async function createSubscriptionCheckout(planName: string): Promise<{
  checkoutUrl?: string;
  planName?: string;
  error?: string;
}> {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return { error: "Not authenticated" };
    }

    const response = await fetch(API_ENDPOINTS.SUBSCRIPTIONS.CHECKOUT, {
      ...fetchConfig,
      method: "POST",
      headers: {
        ...fetchConfig.headers,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ planName }),
    });

    const result = await response.json();

    if (!response.ok) {
      return { error: result.error || "Failed to create checkout session" };
    }

    return result;
  } catch (error) {
    console.error("Error creating checkout:", error);
    return { error: "Network error. Please try again." };
  }
}

/**
 * Get subscription payment history
 */
export async function getSubscriptionHistory(): Promise<{
  payments?: SubscriptionPayment[];
  error?: string;
}> {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return { error: "Not authenticated" };
    }

    const response = await fetch(API_ENDPOINTS.SUBSCRIPTIONS.HISTORY, {
      ...fetchConfig,
      method: "GET",
      headers: {
        ...fetchConfig.headers,
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      return { error: result.error || "Failed to fetch subscription history" };
    }

    return { payments: result.payments || [] };
  } catch (error) {
    console.error("Error fetching subscription history:", error);
    return { error: "Network error. Please try again." };
  }
}

/**
 * Get current subscription status
 */
export async function getSubscriptionStatus(): Promise<{
  subscription?: SubscriptionStatus;
  error?: string;
}> {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return { error: "Not authenticated" };
    }

    const response = await fetch(API_ENDPOINTS.SUBSCRIPTIONS.STATUS, {
      ...fetchConfig,
      method: "GET",
      headers: {
        ...fetchConfig.headers,
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      return { error: result.error || "Failed to fetch subscription status" };
    }

    return { subscription: result };
  } catch (error) {
    console.error("Error fetching subscription status:", error);
    return { error: "Network error. Please try again." };
  }
}

