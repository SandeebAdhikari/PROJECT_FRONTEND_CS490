import { API_ENDPOINTS, fetchConfig } from './config';

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
}

export const bookAppointment = async (data: BookAppointmentData) => {
  const token = localStorage.getItem('token') || localStorage.getItem('authToken');
  
  if (!token) {
    throw new Error('Please login to book an appointment');
  }

  // Get user info from token or localStorage
  let userEmail = data.email;
  let userPhone = data.phone;
  
  if (!userEmail || !userPhone) {
    try {
      // Try to decode JWT to get user info
      const tokenParts = token.split('.');
      if (tokenParts.length === 3) {
        const payload = JSON.parse(atob(tokenParts[1]));
        userEmail = userEmail || payload.email || payload.user_email;
        userPhone = userPhone || payload.phone || payload.user_phone;
      }
    } catch (e) {
      // If JWT decode fails, try localStorage
      userEmail = userEmail || localStorage.getItem('userEmail') || '';
      userPhone = userPhone || localStorage.getItem('userPhone') || '';
    }
  }

  // Transform field names to match backend expectations
  const requestBody: any = {
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

  const response = await fetch(API_ENDPOINTS.APPOINTMENTS.BOOK, {
    ...fetchConfig,
    method: 'POST',
    headers: {
      ...fetchConfig.headers,
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to book appointment');
  }

  return response.json();
};

// get appointments for salon (owner/staff only)
export async function getSalonAppointments(salonId: number | string): Promise<{ appointments?: Appointment[]; error?: string }> {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return { error: 'Not authenticated' };
    }

    const response = await fetch(API_ENDPOINTS.APPOINTMENTS.GET_SALON(salonId), {
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

// Update appointment status (approve/deny/confirm/cancel)
export async function updateAppointmentStatus(
  appointmentId: number,
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
): Promise<{ message?: string; error?: string }> {
  try {
    const token = localStorage.getItem('token') || localStorage.getItem('authToken');
    if (!token) {
      return { error: 'Not authenticated' };
    }

    const response = await fetch(`${API_ENDPOINTS.APPOINTMENTS.UPDATE(appointmentId)}`, {
      ...fetchConfig,
      method: 'PUT',
      headers: {
        ...fetchConfig.headers,
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });

    let result;
    let responseText = '';
    try {
      responseText = await response.text();
      result = responseText ? JSON.parse(responseText) : {};
    } catch (e) {
      console.error('Failed to parse response:', e, 'Response text:', responseText);
      result = { error: `Server error (${response.status}): ${responseText || 'Empty response'}` };
    }

    if (!response.ok) {
      const errorDetails = {
        status: response.status,
        statusText: response.statusText,
        result,
        responseText,
        url: `${API_ENDPOINTS.APPOINTMENTS.UPDATE(appointmentId)}`,
      };
      console.error('Update appointment error:', errorDetails);
      
      // Return a more descriptive error
      const errorMessage = result.error || result.message || `Failed to update appointment (${response.status}${responseText ? ': ' + responseText : ''})`;
      return { error: errorMessage };
    }

    return { message: result.message || 'Appointment updated successfully' };
  } catch (error) {
    console.error('Network error:', error);
    return { error: error instanceof Error ? error.message : 'Network error. Please try again.' };
  }
}

