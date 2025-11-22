import { API_ENDPOINTS, fetchConfig } from "./config";

export interface AddReviewData {
  appointment_id?: number | null;
  salon_id: number;
  staff_id?: number | null;
  rating: number;
  comment: string;
}

export interface Review {
  review_id: number;
  appointment_id: number;
  user_id: number;
  salon_id: number;
  staff_id: number;
  rating: number;
  comment: string;
  response?: string;
  is_visible: boolean;
  is_flagged: boolean;
  created_at: string;
}

export async function addReview(
  data: AddReviewData
): Promise<{ review_id?: number; message?: string; error?: string }> {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return { error: "Not authenticated" };
    }

    const response = await fetch(API_ENDPOINTS.REVIEWS.ADD, {
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
      return { error: result.error || "Failed to add review" };
    }

    return result;
  } catch {
    return { error: "Network error. Please try again." };
  }
}

export async function respondToReview(
  reviewId: number,
  response: string
): Promise<{ message?: string; error?: string }> {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return { error: "Not authenticated" };
    }

    const res = await fetch(API_ENDPOINTS.REVIEWS.RESPOND(reviewId), {
      ...fetchConfig,
      method: "PUT",
      headers: {
        ...fetchConfig.headers,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ response }),
    });

    const result = await res.json();

    if (!res.ok) {
      return { error: result.error || "Failed to respond to review" };
    }

    return result;
  } catch {
    return { error: "Network error. Please try again." };
  }
}
