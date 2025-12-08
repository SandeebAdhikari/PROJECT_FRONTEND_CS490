import { API_BASE_URL } from "../api/config";

/**
 * Converts a relative image path to a full backend URL
 * Handles both relative paths (/uploads/...) and full URLs (http://...)
 */
export function getImageUrl(imagePath: string | null | undefined): string {
  if (!imagePath) {
    return "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=1200&h=600&fit=crop&auto=format";
  }

  // If it's already a full URL (http:// or https://), return as is
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  // If it's a relative path starting with /, prepend API_BASE_URL
  if (imagePath.startsWith("/")) {
    return `${API_BASE_URL}${imagePath}`;
  }

  // Otherwise, assume it's a relative path and prepend API_BASE_URL with /
  return `${API_BASE_URL}/${imagePath}`;
}

