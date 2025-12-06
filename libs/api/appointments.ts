"use client";

import { API_ENDPOINTS, fetchConfig } from "./config";

export interface BookAppointmentData {
  salon_id: number;
  staff_id?: number;
  service_id?: number;
  scheduled_time: string;
  price?: number;
  notes?: string;
  email?: string;
  phone?: string;
}

export interface Appointment {
  appointment_id?: number;
  salon_id?: number;
  staff_id?: number;
  service_id?: number;
  user_id?: number;
  scheduled_time?: string;
  price?: number;
  status?: string;
  notes?: string;
  customer_name?: string;
  service_name?: string;
  staff_name?: string;
  services?: {
    service_id?: number;
    custom_name?: string;
    duration?: number;
    price?: number;
  }[];
  salon_name?: string;
}

export const bookAppointment = async (data: BookAppointmentData) => {
  const token =
    localStorage.getItem("token") || localStorage.getItem("authToken");

  // Get user info from token or localStorage
  let userEmail = data.email;
  let userPhone = data.phone;

  if (token && (!userEmail || !userPhone)) {
    try {
      // Try to decode JWT to get user info
      const tokenParts = token.split(".");
      if (tokenParts.length === 3) {
        const payload = JSON.parse(atob(tokenParts[1]));
        userEmail = userEmail || payload.email || payload.user_email;
        userPhone = userPhone || payload.phone || payload.user_phone;
      }
    } catch {
      // If JWT decode fails, try localStorage
      userEmail = userEmail || localStorage.getItem("userEmail") || "";
      userPhone = userPhone || localStorage.getItem("userPhone") || "";
    }
  }

  // Public endpoint requires email or phone
  if (!userEmail && !userPhone) {
    throw new Error("Email or phone number is required to book an appointment");
  }

  // Transform field names to match backend expectations
  const requestBody: {
    salonId: number;
    staffId?: number;
    serviceId?: number;
    scheduledTime: string;
    price?: number;
    notes?: string;
    email?: string;
    phone?: string;
    firstName?: string;
    lastName?: string;
  } = {
    salonId: data.salon_id,
    staffId: data.staff_id,
    serviceId: data.service_id,
    scheduledTime: data.scheduled_time,
    price: data.price,
    notes: data.notes,
  };

  // Add email and phone if available
  if (userEmail) requestBody.email = userEmail;
  if (userPhone) requestBody.phone = userPhone;

  // Use public booking endpoint
  const response = await fetch(API_ENDPOINTS.PUBLIC.BOOKINGS, {
    ...fetchConfig,
    method: "POST",
    headers: {
      ...fetchConfig.headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(requestBody),
  });

  console.log("📊 Response status:", response.status, response.statusText);

  if (!response.ok) {
    let error;
    try {
      error = await response.json();
    } catch {
      error = { error: await response.text() };
    }
    console.error("❌ Booking failed:", {
      status: response.status,
      statusText: response.statusText,
      error: error,
    });
    throw new Error(
      error.error ||
        error.message ||
        `Failed to book appointment (${response.status})`
    );
  }

  const result = await response.json();
  console.log("✅ Booking successful:", result);
  return result;
};

export const getAppointmentById = async (
  id: number | string
): Promise<{ appointment?: Appointment; error?: string }> => {
  try {
    const token =
      localStorage.getItem("token") || localStorage.getItem("authToken");
    if (!token) {
      return { error: "Please login to view appointments" };
    }

    const response = await fetch(API_ENDPOINTS.APPOINTMENTS.GET_BY_ID(id), {
      ...fetchConfig,
      headers: {
        ...fetchConfig.headers,
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      return { error: result.error || "Failed to load appointment" };
    }

    return { appointment: result };
  } catch (error) {
    console.error("getAppointmentById error", error);
    return { error: "Network error. Please try again." };
  }
};

// get appointments for salon (owner/staff only)
export async function getSalonAppointments(
  salonId: number | string
): Promise<{ appointments?: Appointment[]; error?: string }> {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return { error: "Not authenticated" };
    }

    const response = await fetch(
      API_ENDPOINTS.APPOINTMENTS.GET_SALON(salonId),
      {
        ...fetchConfig,
        headers: {
          ...fetchConfig.headers,
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result = await response.json();

    if (!response.ok) {
      return { error: result.error || "Failed to fetch appointments" };
    }

    return { appointments: Array.isArray(result) ? result : [] };
  } catch {
    return { error: "Network error. Please try again." };
  }
}

// Update appointment status (approve/deny/confirm/cancel)
export async function updateAppointmentStatus(
  appointmentId: number,
  status: "pending" | "confirmed" | "cancelled" | "completed"
): Promise<{ message?: string; error?: string }> {
  try {
    const token =
      localStorage.getItem("token") || localStorage.getItem("authToken");
    if (!token) {
      return { error: "Not authenticated" };
    }

    const response = await fetch(
      `${API_ENDPOINTS.APPOINTMENTS.UPDATE(appointmentId)}`,
      {
        ...fetchConfig,
        method: "PUT",
        headers: {
          ...fetchConfig.headers,
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      }
    );

    let result;
    let responseText = "";
    try {
      responseText = await response.text();
      result = responseText ? JSON.parse(responseText) : {};
    } catch {
      console.error(
        "Failed to parse response:",
        "Response text:",
        responseText
      );
      result = {
        error: `Server error (${response.status}): ${
          responseText || "Empty response"
        }`,
      };
    }

    if (!response.ok) {
      const errorDetails = {
        status: response.status,
        statusText: response.statusText,
        result,
        responseText,
        url: `${API_ENDPOINTS.APPOINTMENTS.UPDATE(appointmentId)}`,
      };
      console.error("Update appointment error:", errorDetails);

      // Return a more descriptive error
      const errorMessage =
        result.error ||
        result.message ||
        `Failed to update appointment (${response.status}${
          responseText ? ": " + responseText : ""
        })`;
      return { error: errorMessage };
    }

    return { message: result.message || "Appointment updated successfully" };
  } catch (error) {
    console.error("Network error:", error);
    return {
      error:
        error instanceof Error
          ? error.message
          : "Network error. Please try again.",
    };
  }
}
