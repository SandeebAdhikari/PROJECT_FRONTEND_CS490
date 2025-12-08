import { API_ENDPOINTS, fetchConfig } from "./config";

export interface CreateCheckoutData {
  amount: number;
  appointment_id?: number;
  type?: "appointment" | "products" | "unified";
  items?: Array<{
    product_id?: number;
    service_id?: number;
    name: string;
    quantity: number;
    price: number;
  }>;
  products?: Array<{
    product_id: number;
    name: string;
    quantity: number;
    price: number;
  }>;
  points_to_redeem?: number;
  salon_id?: number;
  cart_id?: number;
}

export interface PaymentResponse {
  success: boolean;
  message?: string;
  payment_id?: number;
  payment_link?: string;
  checkout_session_id?: string;
  points_redeemed?: number;
  discount_applied?: number;
  error?: string;
}

export interface PaymentDetails {
  payment_id: number;
  amount: number;
  payment_method: string;
  payment_status: string;
  payment_date: string;
  appointment_id?: number;
  salon_name?: string;
  service_name?: string;
  stylist_name?: string;
  scheduled_time?: string;
}

/**
 * Create checkout session for appointment or products
 */
export async function createCheckout(
  data: CreateCheckoutData
): Promise<PaymentResponse> {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return { success: false, error: "Not authenticated" };
    }

    const response = await fetch(API_ENDPOINTS.PAYMENTS.CHECKOUT, {
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
      return {
        success: false,
        error: result.error || "Failed to create checkout session",
      };
    }

    return {
      success: true,
      payment_id: result.payment_id,
      payment_link: result.payment_link,
      points_redeemed: result.points_redeemed || 0,
      discount_applied: result.discount_applied || 0,
      message: result.message,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Network error. Please try again.",
    };
  }
}

/**
 * Create unified checkout for cart (products + services)
 */
export async function createUnifiedCheckout(
  salonId: number | string,
  cartId: number | string,
  pointsToRedeem: number = 0
): Promise<PaymentResponse> {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return { success: false, error: "Not authenticated" };
    }

    const response = await fetch(API_ENDPOINTS.PAYMENTS.UNIFIED_CHECKOUT, {
      ...fetchConfig,
      method: "POST",
      headers: {
        ...fetchConfig.headers,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        salon_id: salonId,
        cart_id: cartId,
        points_to_redeem: pointsToRedeem,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.error || "Failed to create checkout session",
      };
    }

    return {
      success: true,
      payment_id: result.payment_id,
      payment_link: result.payment_link,
      points_redeemed: result.points_redeemed || 0,
      message: result.message,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Network error. Please try again.",
    };
  }
}

/**
 * Get payment details by session ID
 */
export async function getPaymentBySessionId(
  sessionId: string
): Promise<{ payment?: PaymentDetails; error?: string }> {
  try {
    const response = await fetch(
      `${API_ENDPOINTS.PAYMENTS.GET_BY_SESSION}?session_id=${sessionId}`,
      {
        ...fetchConfig,
      }
    );

    const result = await response.json();

    if (!response.ok) {
      return { error: result.error || "Failed to fetch payment details" };
    }

    return { payment: result.payment };
  } catch {
    return { error: "Network error. Please try again." };
  }
}

/**
 * Get payments for a salon (owner only)
 */
export async function getSalonPayments(
  salonId: number | string
): Promise<{ payments?: PaymentDetails[]; error?: string }> {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return { error: "Not authenticated" };
    }

    const response = await fetch(API_ENDPOINTS.PAYMENTS.SALON_PAYMENTS(salonId), {
      ...fetchConfig,
      headers: {
        ...fetchConfig.headers,
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      return { error: result.error || "Failed to fetch payments" };
    }

    return { payments: Array.isArray(result) ? result : [] };
  } catch {
    return { error: "Network error. Please try again." };
  }
}

