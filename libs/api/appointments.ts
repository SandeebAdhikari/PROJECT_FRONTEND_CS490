import { API_ENDPOINTS, fetchConfig } from './config';

export interface BookAppointmentData {
  salon_id: number;
  staff_id?: number;
  service_id?: number;
  scheduled_time: string;
  price?: number;
  notes?: string;
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
  const token = localStorage.getItem('token') || localStorage.getItem('authToken');
  
  if (!token) {
    throw new Error('Please login to book an appointment');
  }

  const response = await fetch(API_ENDPOINTS.APPOINTMENTS.BOOK, {
    ...fetchConfig,
    method: 'POST',
    headers: {
      ...fetchConfig.headers,
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to book appointment');
  }

  return response.json();
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

    const response = await fetch(API_ENDPOINTS.APPOINTMENTS.DETAIL(id), {
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
export async function getSalonAppointments(): Promise<{ appointments?: Appointment[]; error?: string }> {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return { error: 'Not authenticated' };
    }

    const response = await fetch(`${API_ENDPOINTS.APPOINTMENTS.BOOK}/salon`, {
      ...fetchConfig,
      headers: {
        ...fetchConfig.headers,
        'Authorization': `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      return { error: result.error || 'Failed to fetch appointments' };
    }

    return { appointments: Array.isArray(result) ? result : [] };
  } catch (error) {
    return { error: 'Network error. Please try again.' };
  }
}
