import { API_ENDPOINTS, fetchConfig } from './config';

export interface Salon {
  salon_id?: number;
  owner_id?: number;
  name: string;
  address: string;
  phone: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  description?: string;
  email?: string;
  website?: string;
  profile_picture?: string;
  status?: string;
  created_at?: string;
}

export interface CreateSalonData {
  name: string;
  address: string;
  phone: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  description?: string;
  email?: string;
  website?: string;
}

// Create a new salon
export async function createSalon(data: CreateSalonData, profilePicture?: File | null): Promise<{ salon?: Salon; message?: string; error?: string }> {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return { error: 'Not authenticated' };
    }

    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('address', data.address);
    formData.append('phone', data.phone);
    if (data.city) formData.append('city', data.city);
    if (data.description) formData.append('description', data.description);
    if (data.email) formData.append('email', data.email);
    if (data.website) formData.append('website', data.website);
    if (data.state) formData.append('state', data.state);
    if (data.zip) formData.append('zip', data.zip);
    if (data.country) formData.append('country', data.country);
    if (profilePicture) {
      formData.append('profile_picture', profilePicture);
    }

    const response = await fetch(API_ENDPOINTS.SALONS.CREATE, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
      return { error: result.error || 'Failed to create salon' };
    }

    return result;
  } catch (error) {
    console.error('Network error:', error);
    return { error: 'Network error. Please try again.' };
  }
}

// Get all salons for browsing
export async function getAllSalons(): Promise<{ salons?: Salon[]; error?: string }> {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return { error: 'Not authenticated' };
    }

    const response = await fetch(API_ENDPOINTS.SALONS.LIST, {
      ...fetchConfig,
      headers: {
        ...fetchConfig.headers,
        'Authorization': `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      return { error: result.error || 'Failed to fetch salons' };
    }

    return { salons: result };
  } catch (error) {
    return { error: 'Network error. Please try again.' };
  }
}

// Check if owner has a salon
export async function checkOwnerSalon(): Promise<{ hasSalon: boolean; salon?: Salon; error?: string }> {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return { hasSalon: false, error: 'Not authenticated' };
    }

    const response = await fetch(API_ENDPOINTS.SALONS.CHECK_OWNER, {
      ...fetchConfig,
      headers: {
        ...fetchConfig.headers,
        'Authorization': `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      return { hasSalon: false, error: result.error };
    }

    return result;
  } catch (error) {
    return { hasSalon: false, error: 'Network error' };
  }
}

// Get salon by ID (for settings view)
export async function getSalonById(salonId: number): Promise<{ salon?: Salon; error?: string }> {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return { error: 'Not authenticated' };
    }

    const response = await fetch(`${API_ENDPOINTS.SALONS.LIST}/${salonId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();

    if (!response.ok) {
      return { error: result.error || 'Failed to fetch salon' };
    }

    return { salon: result };
  } catch (error) {
    console.error('Network error:', error);
    return { error: 'Network error. Please try again.' };
  }
}

// Update salon settings
export async function updateSalon(salonId: number, data: CreateSalonData, profilePicture?: File | null): Promise<{ salon?: Salon; message?: string; error?: string }> {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return { error: 'Not authenticated' };
    }

    const formData = new FormData();
    if (data.name) formData.append('name', data.name);
    if (data.address) formData.append('address', data.address);
    if (data.phone) formData.append('phone', data.phone);
    if (data.city) formData.append('city', data.city);
    if (data.state) formData.append('state', data.state);
    if (data.zip) formData.append('zip', data.zip);
    if (data.country) formData.append('country', data.country);
    if (data.description) formData.append('description', data.description);
    if (data.email) formData.append('email', data.email);
    if (data.website) formData.append('website', data.website);
    if (profilePicture) {
      formData.append('profile_picture', profilePicture);
    }

    const response = await fetch(`${API_ENDPOINTS.SALONS.LIST}/${salonId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
      return { error: result.error || 'Failed to update salon' };
    }

    return result;
  } catch (error) {
    console.error('Network error:', error);
    return { error: 'Network error. Please try again.' };
  }
}
