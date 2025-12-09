import { API_ENDPOINTS, API_BASE_URL } from "./config";

export interface ServicePhoto {
  photo_id: number;
  appointment_id: number | null;
  user_id: number;
  salon_id?: number;
  salon_name?: string;
  staff_id?: number;
  service_id?: number;
  photo_type: "before" | "after";
  photo_url: string;
  created_at: string;
}

export interface PhotoUploadData {
  appointment_id: number;
  photo_type: "before" | "after";
  photo: File;
  staff_id?: number;
  service_id?: number;
}

// Add a before/after photo to an appointment
export const uploadAppointmentPhoto = async (
  data: PhotoUploadData
): Promise<{ success: boolean; photo_id?: number; error?: string }> => {
  try {
    const token = localStorage.getItem("token") || localStorage.getItem("authToken");
    if (!token) {
      return { success: false, error: "Authentication required" };
    }

    const formData = new FormData();
    formData.append("photo", data.photo);
    formData.append("appointment_id", data.appointment_id.toString());
    formData.append("photo_type", data.photo_type);
    
    if (data.staff_id) {
      formData.append("staff_id", data.staff_id.toString());
    }
    if (data.service_id) {
      formData.append("service_id", data.service_id.toString());
    }

    const response = await fetch(`${API_BASE_URL}/api/photos/add`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
      credentials: "include",
    });

    const result = await response.json();

    if (!response.ok) {
      return { success: false, error: result.error || "Failed to upload photo" };
    }

    return { success: true, photo_id: result.photo_id };
  } catch (error) {
    console.error("Error uploading photo:", error);
    return { success: false, error: "Network error. Please try again." };
  }
};

// Get all photos for a specific appointment
export const getAppointmentPhotos = async (
  appointmentId: number
): Promise<{ photos?: ServicePhoto[]; error?: string }> => {
  try {
    const token = localStorage.getItem("token") || localStorage.getItem("authToken");
    if (!token) {
      return { error: "Authentication required" };
    }

    const response = await fetch(`${API_BASE_URL}/api/photos/${appointmentId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    });

    const result = await response.json();

    if (!response.ok) {
      return { error: result.error || "Failed to fetch photos" };
    }

    return { photos: result.photos || [] };
  } catch (error) {
    console.error("Error fetching photos:", error);
    return { error: "Network error. Please try again." };
  }
};

// Get all photos for a user (customer's photo gallery)
export const getUserPhotos = async (userId?: number, salonId?: number): Promise<{
  photos?: ServicePhoto[];
  error?: string;
}> => {
  try {
    const token = localStorage.getItem("token") || localStorage.getItem("authToken") || localStorage.getItem("staffToken");
    if (!token) {
      return { error: "Authentication required" };
    }

    // If userId is provided, use it; otherwise get from token
    let targetUserId = userId;
    if (!targetUserId) {
      const tokenParts = token.split(".");
      if (tokenParts.length !== 3) {
        return { error: "Invalid token" };
      }

      const payload = JSON.parse(atob(tokenParts[1]));
      targetUserId = payload.user_id || payload.id;

      if (!targetUserId) {
        return { error: "User ID not found" };
      }
    }

    let url = `${API_BASE_URL}/api/photos/user/${targetUserId}`;
    if (salonId) {
      url += `?salon_id=${salonId}`;
    }

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    });

    const result = await response.json();

    if (!response.ok) {
      return { error: result.error || "Failed to fetch photos" };
    }

    return { photos: result.photos || [] };
  } catch (error) {
    console.error("Error fetching user photos:", error);
    return { error: "Network error. Please try again." };
  }
};

// Helper to get full image URL
export const getPhotoUrl = (photoUrl: string): string => {
  if (photoUrl.startsWith("http")) {
    return photoUrl;
  }
  return `${API_BASE_URL}${photoUrl}`;
};
