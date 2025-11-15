import { API_ENDPOINTS, fetchConfig } from "./config";

export interface Photo {
  photo_id: number;
  salon_id: number;
  photo_url: string;
  uploaded_at: string;
}

export async function uploadPhotos(
  salonId: number,
  photoUrls: string[]
): Promise<{ message?: string; error?: string }> {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return { error: "Not authenticated" };
    }

    const response = await fetch(API_ENDPOINTS.PHOTOS.UPLOAD, {
      ...fetchConfig,
      method: "POST",
      headers: {
        ...fetchConfig.headers,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ salon_id: salonId, photo_urls: photoUrls }),
    });

    const result = await response.json();

    if (!response.ok) {
      return { error: result.error || "Failed to upload photos" };
    }

    return result;
  } catch {
    return { error: "Network error. Please try again." };
  }
}

export async function getSalonPhotos(
  salonId: number
): Promise<{ photos?: Photo[]; error?: string }> {
  try {
    const response = await fetch(API_ENDPOINTS.PHOTOS.LIST(salonId), {
      ...fetchConfig,
    });

    const result = await response.json();

    if (!response.ok) {
      return { error: result.error || "Failed to get photos" };
    }

    return { photos: result };
  } catch {
    return { error: "Network error. Please try again." };
  }
}

export async function deletePhoto(
  photoId: number
): Promise<{ message?: string; error?: string }> {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return { error: "Not authenticated" };
    }

    const response = await fetch(API_ENDPOINTS.PHOTOS.DELETE(photoId), {
      ...fetchConfig,
      method: "DELETE",
      headers: {
        ...fetchConfig.headers,
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      return { error: result.error || "Failed to delete photo" };
    }

    return result;
  } catch {
    return { error: "Network error. Please try again." };
  }
}
