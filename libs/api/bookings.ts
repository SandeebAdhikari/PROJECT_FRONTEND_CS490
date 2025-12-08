import { fetchConfig } from "./config";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export interface BarberSchedule {
  appointment_id: number;
  status: string;
  scheduled_time: string;
  service_name: string | null;
  customer_name: string | null;
}

export interface BlockSlotRequest {
  start_datetime: string;
  end_datetime: string;
  reason?: string;
}

export interface BlockedTimeSlot {
  timeoff_id: number;
  staff_id: number;
  start_datetime: string;
  end_datetime: string;
  reason: string | null;
  status: string;
  created_at: string;
}

/**
 * Reschedule an appointment
 */
export async function rescheduleAppointment(
  appointmentId: number | string,
  newScheduledTime: string
): Promise<{ message?: string; error?: string }> {
  try {
    const token = localStorage.getItem("token") || localStorage.getItem("authToken");
    if (!token) {
      return { error: "Not authenticated" };
    }

    const response = await fetch(
      `${API_BASE_URL}/api/bookings/reschedule/${appointmentId}`,
      {
        ...fetchConfig,
        method: "PUT",
        headers: {
          ...fetchConfig.headers,
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ new_scheduled_time: newScheduledTime }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return { error: data.error || "Failed to reschedule appointment" };
    }

    return { message: data.message || "Appointment rescheduled successfully" };
  } catch (error) {
    console.error("Reschedule appointment error:", error);
    return { error: error instanceof Error ? error.message : "Failed to reschedule appointment" };
  }
}

/**
 * Cancel an appointment
 */
export async function cancelAppointment(
  appointmentId: number | string
): Promise<{ message?: string; error?: string }> {
  try {
    const token = localStorage.getItem("token") || localStorage.getItem("authToken");
    if (!token) {
      return { error: "Not authenticated" };
    }

    const response = await fetch(
      `${API_BASE_URL}/api/bookings/cancel/${appointmentId}`,
      {
        ...fetchConfig,
        method: "DELETE",
        headers: {
          ...fetchConfig.headers,
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return { error: data.error || "Failed to cancel appointment" };
    }

    return { message: data.message || "Appointment cancelled successfully" };
  } catch (error) {
    console.error("Cancel appointment error:", error);
    return { error: error instanceof Error ? error.message : "Failed to cancel appointment" };
  }
}

/**
 * Get barber's daily schedule
 */
export async function getBarberSchedule(): Promise<{
  schedule?: BarberSchedule[];
  error?: string;
}> {
  try {
    const token = localStorage.getItem("staffToken") || localStorage.getItem("token") || localStorage.getItem("authToken");
    if (!token) {
      return { error: "Not authenticated" };
    }

    const response = await fetch(
      `${API_BASE_URL}/api/bookings/barber/schedule`,
      {
        ...fetchConfig,
        method: "GET",
        headers: {
          ...fetchConfig.headers,
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return { error: data.error || "Failed to fetch schedule" };
    }

    return { schedule: data.schedule || [] };
  } catch (error) {
    console.error("Get barber schedule error:", error);
    return {
      error: error instanceof Error ? error.message : "Failed to fetch schedule",
    };
  }
}

/**
 * Block a time slot (barber only)
 */
export async function blockTimeSlot(
  request: BlockSlotRequest
): Promise<{ message?: string; error?: string }> {
  try {
    const token = localStorage.getItem("staffToken") || localStorage.getItem("token") || localStorage.getItem("authToken");
    if (!token) {
      return { error: "Not authenticated" };
    }

    const response = await fetch(
      `${API_BASE_URL}/api/bookings/barber/block-slot`,
      {
        ...fetchConfig,
        method: "POST",
        headers: {
          ...fetchConfig.headers,
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(request),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return { error: data.error || "Failed to block time slot" };
    }

    return { message: data.message || "Time slot blocked successfully" };
  } catch (error) {
    console.error("Block time slot error:", error);
    return { error: error instanceof Error ? error.message : "Failed to block time slot" };
  }
}

/**
 * Get blocked time slots for the current barber
 */
export async function getBlockedTimeSlots(): Promise<{
  blockedSlots?: BlockedTimeSlot[];
  error?: string;
}> {
  try {
    const token = localStorage.getItem("staffToken") || localStorage.getItem("token") || localStorage.getItem("authToken");
    if (!token) {
      return { error: "Not authenticated" };
    }

    const response = await fetch(
      `${API_BASE_URL}/api/bookings/barber/blocked-slots`,
      {
        ...fetchConfig,
        method: "GET",
        headers: {
          ...fetchConfig.headers,
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return { error: data.error || "Failed to fetch blocked slots" };
    }

    return { blockedSlots: data.blockedSlots || [] };
  } catch (error) {
    console.error("Get blocked time slots error:", error);
    return {
      error: error instanceof Error ? error.message : "Failed to fetch blocked slots",
    };
  }
}

/**
 * Update a blocked time slot
 */
export async function updateBlockedTimeSlot(
  timeoffId: number | string,
  request: BlockSlotRequest
): Promise<{ message?: string; error?: string }> {
  try {
    const token = localStorage.getItem("staffToken") || localStorage.getItem("token") || localStorage.getItem("authToken");
    if (!token) {
      return { error: "Not authenticated" };
    }

    const response = await fetch(
      `${API_BASE_URL}/api/bookings/barber/blocked-slots/${timeoffId}`,
      {
        ...fetchConfig,
        method: "PUT",
        headers: {
          ...fetchConfig.headers,
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(request),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return { error: data.error || "Failed to update blocked slot" };
    }

    return { message: data.message || "Time slot updated successfully" };
  } catch (error) {
    console.error("Update blocked time slot error:", error);
    return { error: error instanceof Error ? error.message : "Failed to update blocked slot" };
  }
}

/**
 * Delete a blocked time slot
 */
export async function deleteBlockedTimeSlot(
  timeoffId: number | string
): Promise<{ message?: string; error?: string }> {
  try {
    const token = localStorage.getItem("staffToken") || localStorage.getItem("token") || localStorage.getItem("authToken");
    if (!token) {
      return { error: "Not authenticated" };
    }

    const response = await fetch(
      `${API_BASE_URL}/api/bookings/barber/blocked-slots/${timeoffId}`,
      {
        ...fetchConfig,
        method: "DELETE",
        headers: {
          ...fetchConfig.headers,
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return { error: data.error || "Failed to delete blocked slot" };
    }

    return { message: data.message || "Time slot deleted successfully" };
  } catch (error) {
    console.error("Delete blocked time slot error:", error);
    return { error: error instanceof Error ? error.message : "Failed to delete blocked slot" };
  }
}

