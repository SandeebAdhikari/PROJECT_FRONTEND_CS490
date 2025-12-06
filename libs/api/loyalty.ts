import { API_ENDPOINTS, fetchConfig } from "./config";

export interface LoyaltyPointsSummary {
  salon_id: number;
  salon_name: string;
  points: number;
}

export interface LoyaltyPointsDetail {
  salon_id: number;
  points: number;
  min_points_redeem: number;
  redeem_rate: number;
  can_redeem: boolean;
  estimated_discount: string;
}

export interface RedeemPointsData {
  salon_id: number;
  points_to_redeem: number;
}

export interface CalculateDiscountData {
  salon_id: number;
  points_to_redeem: number;
}

export interface DiscountResult {
  discount: number;
  points_to_redeem: number;
}

/**
 * Get user's loyalty summary across all salons
 */
export async function getMyLoyaltySummary(): Promise<{
  summary?: LoyaltyPointsSummary[];
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

    return { summary: result.summary };
  } catch {
    return { error: "Network error. Please try again." };
  }
}

/**
 * Get user's points for a specific salon
 */
export async function getMyPoints(
  salonId: number | string
): Promise<{
  points?: LoyaltyPointsDetail;
  error?: string;
}> {
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
      return { error: result.error || "Failed to fetch points" };
    }

    return { points: result };
  } catch {
    return { error: "Network error. Please try again." };
  }
}

/**
 * Redeem loyalty points
 */
export async function redeemLoyaltyPoints(
  data: RedeemPointsData
): Promise<{
  message?: string;
  error?: string;
}> {
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
      body: JSON.stringify(data),
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
 * Calculate discount for loyalty points
 */
export async function calculateDiscount(
  data: CalculateDiscountData
): Promise<{
  discount?: DiscountResult;
  error?: string;
}> {
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
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      return { error: result.error || "Failed to calculate discount" };
    }

    return { discount: result };
  } catch {
    return { error: "Network error. Please try again." };
  }
}
