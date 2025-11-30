import { API_ENDPOINTS, fetchConfig } from "./config";

export interface AccountSettings {
  user_id: string;
  full_name: string;
  email: string;
  phone: string;
  profile_pic: string | null;
  subscription_plan: string;
  created_at: string;
  updated_at: string;
}

export interface UpdateAccountData {
  full_name?: string;
  email?: string;
  phone?: string;
}

export interface ChangePasswordData {
  current_password: string;
  new_password: string;
}

export interface SubscriptionPlan {
  plan_id: string;
  plan_name: string;
  price: number;
  features?: string[];
}

export interface CurrentSubscription {
  plan: string;
}

export interface UpdateSubscriptionData {
  plan: string;
}

/**
 * Get account settings
 */
export async function getAccountSettings(): Promise<{
  account?: AccountSettings;
  error?: string;
}> {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return { error: "Not authenticated" };
    }

    const response = await fetch(API_ENDPOINTS.ACCOUNT.SETTINGS, {
      ...fetchConfig,
      headers: {
        ...fetchConfig.headers,
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      return { error: result.error || "Failed to fetch account settings" };
    }

    return { account: result };
  } catch {
    return { error: "Network error. Please try again." };
  }
}

/**
 * Update account settings
 */
export async function updateAccountSettings(
  data: UpdateAccountData
): Promise<{
  account?: AccountSettings;
  message?: string;
  error?: string;
}> {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return { error: "Not authenticated" };
    }

    const response = await fetch(API_ENDPOINTS.ACCOUNT.SETTINGS, {
      ...fetchConfig,
      method: "PUT",
      headers: {
        ...fetchConfig.headers,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      return { error: result.error || "Failed to update account settings" };
    }

    return result;
  } catch (error) {
    console.error("Network error:", error);
    return { error: "Network error. Please try again." };
  }
}

/**
 * Change password
 */
export async function changePassword(
  data: ChangePasswordData
): Promise<{
  message?: string;
  error?: string;
}> {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return { error: "Not authenticated" };
    }

    const response = await fetch(API_ENDPOINTS.ACCOUNT.PASSWORD, {
      ...fetchConfig,
      method: "PUT",
      headers: {
        ...fetchConfig.headers,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      return { error: result.error || "Failed to change password" };
    }

    return result;
  } catch {
    return { error: "Network error. Please try again." };
  }
}

/**
 * Get available subscription plans
 */
export async function getSubscriptionPlans(): Promise<{
  plans?: SubscriptionPlan[];
  error?: string;
}> {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return { error: "Not authenticated" };
    }

    const response = await fetch(API_ENDPOINTS.ACCOUNT.SUBSCRIPTION_PLANS, {
      ...fetchConfig,
      headers: {
        ...fetchConfig.headers,
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      return { error: result.error || "Failed to fetch subscription plans" };
    }

    return result;
  } catch {
    return { error: "Network error. Please try again." };
  }
}

/**
 * Get current subscription
 */
export async function getCurrentSubscription(): Promise<{
  subscription?: CurrentSubscription;
  error?: string;
}> {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return { error: "Not authenticated" };
    }

    const response = await fetch(API_ENDPOINTS.ACCOUNT.SUBSCRIPTION, {
      ...fetchConfig,
      headers: {
        ...fetchConfig.headers,
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      return { error: result.error || "Failed to fetch subscription" };
    }

    return { subscription: result };
  } catch {
    return { error: "Network error. Please try again." };
  }
}

/**
 * Update subscription plan
 */
export async function updateSubscription(
  data: UpdateSubscriptionData
): Promise<{
  message?: string;
  subscription?: CurrentSubscription;
  error?: string;
}> {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return { error: "Not authenticated" };
    }

    const response = await fetch(API_ENDPOINTS.ACCOUNT.SUBSCRIPTION, {
      ...fetchConfig,
      method: "PUT",
      headers: {
        ...fetchConfig.headers,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      return { error: result.error || "Failed to update subscription" };
    }

    return result;
  } catch {
    return { error: "Network error. Please try again." };
  }
}

/**
 * Delete account
 */
export async function deleteAccount(): Promise<{
  message?: string;
  error?: string;
}> {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return { error: "Not authenticated" };
    }

    const response = await fetch(API_ENDPOINTS.ACCOUNT.DELETE, {
      ...fetchConfig,
      method: "DELETE",
      headers: {
        ...fetchConfig.headers,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ confirm: true }),
    });

    const result = await response.json();

    if (!response.ok) {
      return { error: result.error || "Failed to delete account" };
    }

    // Clear local storage
    localStorage.clear();
    if (typeof document !== "undefined") {
      document.cookie.split(";").forEach((c) => {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(
            /=.*/,
            "=;expires=" + new Date().toUTCString() + ";path=/"
          );
      });
    }

    return result;
  } catch {
    return { error: "Network error. Please try again." };
  }
}

