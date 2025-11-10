import { API_ENDPOINTS, fetchConfig } from './config';

export interface AppointmentHistory {
  appointment_id: number;
  salon_id: number;
  salon_name: string;
  staff_id: number;
  staff_name: string;
  service_id: number;
  service_name: string;
  scheduled_time: string;
  status: string;
  created_at: string;
}

export async function getAppointmentHistory(): Promise<{ appointments?: AppointmentHistory[]; error?: string }> {
  try {
    const token = localStorage.getItem('token') || localStorage.getItem('authToken');
    if (!token) {
      return { error: 'Not authenticated. Please login.' };
    }

    const response = await fetch(API_ENDPOINTS.HISTORY.APPOINTMENTS, {
      ...fetchConfig,
      headers: {
        ...fetchConfig.headers,
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const result = await response.json();
      return { error: result.error || 'Failed to get appointment history' };
    }

    const result = await response.json();

    if (Array.isArray(result)) {
      return { appointments: result };
    } else if (result.appointments && Array.isArray(result.appointments)) {
      return { appointments: result.appointments };
    } else {
      return { appointments: [] };
    }
  } catch (error) {
    console.error('History API error:', error);
    return { error: 'Network error. Please try again.' };
  }
}

