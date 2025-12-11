import { API_BASE_URL } from "../api/config";

/**
 * Converts a relative image path to a full backend URL
 * Handles both relative paths (/uploads/...) and full URLs (http://...)
 */
export function getImageUrl(imagePath: string | null | undefined): string {
  if (!imagePath) {
    return "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=1200&h=600&fit=crop&auto=format";
  }

  // Serve known Next.js public assets directly instead of proxying through the API (prevents localhost:4000 404s)
  if (
    imagePath.startsWith("/salons/") ||
    imagePath.startsWith("/icons/") ||
    imagePath.startsWith("/images/")
  ) {
    return imagePath;
  }

  // Support paths without a leading slash for public assets (e.g., "salons/1.png")
  if (
    imagePath.startsWith("salons/") ||
    imagePath.startsWith("icons/") ||
    imagePath.startsWith("images/")
  ) {
    return `/${imagePath}`;
  }

  // If it's already a full URL (http:// or https://), return as is (with a small tweak for Unsplash params)
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    if (
      imagePath.includes("images.unsplash.com") &&
      !imagePath.includes("auto=format")
    ) {
      const separator = imagePath.includes("?") ? "&" : "?";
      return `${imagePath}${separator}auto=format`;
    }
    return imagePath;
  }

  // If it's a relative path starting with /, prepend API_BASE_URL
  if (imagePath.startsWith("/")) {
    return `${API_BASE_URL}${imagePath}`;
  }

  // Otherwise, assume it's a relative path and prepend API_BASE_URL with /
  return `${API_BASE_URL}/${imagePath}`;
}
