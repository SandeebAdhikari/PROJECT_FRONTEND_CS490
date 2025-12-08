import { API_ENDPOINTS, fetchConfig } from "./config";

export interface LoyaltySummary {
  salon_id: number;
  salon_name: string;
  points: number;
  last_earned: string | null;
  last_redeemed: string | null;
}

export interface LoyaltyPoints {
  salon_id: number;
  points: number;
  min_points_redeem: number;
  redeem_rate: number;
  can_redeem: boolean;
  estimated_discount: string;
}

export interface LoyaltyConfig {
  loyalty_enabled: boolean;
  points_per_dollar: number;
  points_per_visit: number;
  redeem_rate: number;
  min_points_redeem: number;
}

export interface SetLoyaltyConfigData {
  salon_id: number;
  loyalty_enabled?: boolean;
  points_per_dollar?: number;
  points_per_visit?: number;
  redeem_rate?: number;
  min_points_redeem?: number;
}

/**
 * Get user's loyalty summary across all salons
 */
export async function getMyLoyaltySummary(): Promise<{
  summary?: LoyaltySummary[];
  error?: string;
}> {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return { error: "Not authenticated" };
    }

    const response = await fetch(API_ENDPOINTS.LOYALTY.MY_SUMMARY, {
      ...fetchConfig,
      headers: {
        ...fetchConfig.headers,
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      return { error: result.error || "Failed to fetch loyalty summary" };
    }

    return { summary: result.summary || [] };
  } catch {
    return { error: "Network error. Please try again." };
  }
}

/**
 * Get user's points for a specific salon
 */
export async function getMyPoints(
  salonId: number | string
): Promise<{ data?: LoyaltyPoints; error?: string }> {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return { error: "Not authenticated" };
    }

    const response = await fetch(API_ENDPOINTS.LOYALTY.MY_POINTS(salonId), {
      ...fetchConfig,
      headers: {
        ...fetchConfig.headers,
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      return { error: result.error || "Failed to fetch loyalty points" };
    }

    return { data: result };
  } catch {
    return { error: "Network error. Please try again." };
  }
}

/**
 * Redeem loyalty points
 */
export async function redeemLoyaltyPoints(
  salonId: number | string,
  pointsToRedeem: number
): Promise<{ message?: string; error?: string }> {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return { error: "Not authenticated" };
    }

    const response = await fetch(API_ENDPOINTS.LOYALTY.REDEEM, {
      ...fetchConfig,
      method: "POST",
      headers: {
        ...fetchConfig.headers,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        salon_id: salonId,
        points_to_redeem: pointsToRedeem,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      return { error: result.error || "Failed to redeem points" };
    }

    return { message: result.message || "Points redeemed successfully" };
  } catch {
    return { error: "Network error. Please try again." };
  }
}

/**
 * Calculate discount from points
 */
export async function calculateDiscount(
  salonId: number | string,
  pointsToRedeem: number
): Promise<{ discount?: number; error?: string }> {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return { error: "Not authenticated" };
    }

    const response = await fetch(API_ENDPOINTS.LOYALTY.CALCULATE_DISCOUNT, {
      ...fetchConfig,
      method: "POST",
      headers: {
        ...fetchConfig.headers,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        salon_id: salonId,
        points_to_redeem: pointsToRedeem,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      return { error: result.error || "Failed to calculate discount" };
    }

    return { discount: result.discount || 0 };
  } catch {
    return { error: "Network error. Please try again." };
  }
}

/**
 * Get loyalty configuration for a salon (owner only)
 */
export async function getLoyaltyConfig(
  salonId: number | string
): Promise<{ config?: LoyaltyConfig; error?: string }> {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return { error: "Not authenticated" };
    }

    const response = await fetch(API_ENDPOINTS.LOYALTY.GET_CONFIG(salonId), {
      ...fetchConfig,
      headers: {
        ...fetchConfig.headers,
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      return { error: result.error || "Failed to fetch loyalty config" };
    }

    return { config: result };
  } catch {
    return { error: "Network error. Please try again." };
  }
}

/**
 * Set loyalty configuration for a salon (owner only)
 */
export async function setLoyaltyConfig(
  data: SetLoyaltyConfigData
): Promise<{ message?: string; error?: string }> {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return { error: "Not authenticated" };
    }

    const response = await fetch(API_ENDPOINTS.LOYALTY.CONFIG, {
      ...fetchConfig,
      method: "POST",
      headers: {
        ...fetchConfig.headers,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      return { error: result.error || "Failed to update loyalty config" };
    }

    return { message: result.message || "Loyalty configuration updated" };
  } catch {
    return { error: "Network error. Please try again." };
  }
}

