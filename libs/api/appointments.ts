import { API_ENDPOINTS, fetchConfig } from './config';

export interface BookAppointmentData {
  salon_id: number;
  staff_id?: number;
  service_id?: number;
  scheduled_time: string;
  price?: number;
  notes?: string;
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

