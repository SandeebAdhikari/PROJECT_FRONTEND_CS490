import { API_BASE_URL } from "../api/config";

/**
 * Converts a relative image path to a full backend URL
 * Handles both relative paths (/uploads/...) and full URLs (http://...)
 */
export function getImageUrl(imagePath: string | null | undefined): string {
  if (!imagePath) {
    return "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=1200&h=600&fit=crop&auto=format";
  }

  // If it's already a full URL
  if (imagePath.startsWith("https://")) {
    return imagePath;
  }
  
  // Convert HTTP to HTTPS for mixed content issues (but not localhost for dev)
  if (imagePath.startsWith("http://")) {
    if (imagePath.includes("localhost")) {
      return imagePath; // Keep http for local dev
    }
    return imagePath.replace("http://", "https://");
  }

  // If it's a relative path starting with /, prepend API_BASE_URL
  if (imagePath.startsWith("/")) {
    return `${API_BASE_URL}${imagePath}`;
  }

  // Otherwise, assume it's a relative path and prepend API_BASE_URL with /
  return `${API_BASE_URL}/${imagePath}`;
}

