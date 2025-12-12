import { API_ENDPOINTS, fetchConfig } from './config';

export interface CustomerVisitHistory {
  appointment_id: number;
  scheduled_time: string;
  status: string;
  service_name: string;
  staff_name: string;
  duration_minutes: number;
  price: number;
  notes?: string;
  created_at: string;
}

/**
 * Get visit history for a specific customer at a salon
 */
export async function getCustomerVisitHistory(
  userId: number | string,
  salonId: number | string
): Promise<{ appointments?: CustomerVisitHistory[]; error?: string }> {
  try {
    const token = localStorage.getItem('token') || localStorage.getItem('authToken');
    if (!token) {
      return { error: 'Not authenticated. Please login.' };
    }

    const response = await fetch(
      API_ENDPOINTS.USERS.CUSTOMER_VISIT_HISTORY(userId, salonId),
      {
        ...fetchConfig,
        headers: {
          ...fetchConfig.headers,
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const result = await response.json();
      return { error: result.error || 'Failed to get customer visit history' };
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
    console.error('Customer visit history API error:', error);
    return { error: 'Network error. Please try again.' };
  }
}
