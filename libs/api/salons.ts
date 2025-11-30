import { API_ENDPOINTS, fetchConfig } from "./config";

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
export async function createSalon(
  data: CreateSalonData,
  profilePicture?: File | null
): Promise<{ salon?: Salon; message?: string; error?: string }> {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return { error: "Not authenticated" };
    }

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("address", data.address);
    formData.append("phone", data.phone);
    if (data.city) formData.append("city", data.city);
    if (data.description) formData.append("description", data.description);
    if (data.email) formData.append("email", data.email);
    if (data.website) formData.append("website", data.website);
    if (data.state) formData.append("state", data.state);
    if (data.zip) formData.append("zip", data.zip);
    if (data.country) formData.append("country", data.country);
    if (profilePicture) {
      formData.append("profile_picture", profilePicture);
    }

    const response = await fetch(API_ENDPOINTS.SALONS.CREATE, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
      return { error: result.error || "Failed to create salon" };
    }

    return result;
  } catch (error) {
    console.error("Network error:", error);
    return { error: "Network error. Please try again." };
  }
}

// Get all salons for browsing
export async function getAllSalons(): Promise<{
  salons?: Salon[];
  error?: string;
}> {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return { error: "Not authenticated" };
    }

    const response = await fetch(API_ENDPOINTS.SALONS.LIST, {
      ...fetchConfig,
      headers: {
        ...fetchConfig.headers,
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      return { error: result.error || "Failed to fetch salons" };
    }

    return { salons: result };
  } catch {
    return { error: "Network error. Please try again." };
  }
}

// Check if owner has a salon
export async function checkOwnerSalon(): Promise<{
  hasSalon: boolean;
  salon?: Salon;
  error?: string;
}> {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return { hasSalon: false, error: "Not authenticated" };
    }

    const response = await fetch(API_ENDPOINTS.SALONS.CHECK_OWNER, {
      ...fetchConfig,
      headers: {
        ...fetchConfig.headers,
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      return { hasSalon: false, error: result.error };
    }

    return result;
  } catch {
    return { hasSalon: false, error: "Network error" };
  }
}

// Get salon by ID (for settings view)
export async function getSalonById(
  salonId: number
): Promise<{ salon?: Salon; error?: string }> {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return { error: "Not authenticated" };
    }

    const response = await fetch(`${API_ENDPOINTS.SALONS.LIST}/${salonId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();

    if (!response.ok) {
      return { error: result.error || "Failed to fetch salon" };
    }

    return { salon: result };
  } catch (error) {
    console.error("Network error:", error);
    return { error: "Network error. Please try again." };
  }
}

// Update salon settings
export async function updateSalon(
  salonId: number,
  data: CreateSalonData,
  profilePicture?: File | null
): Promise<{ salon?: Salon; message?: string; error?: string }> {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return { error: "Not authenticated" };
    }

    const formData = new FormData();
    // Helper to only append non-empty values
    interface AppendIfValue {
      (key: string, value: string | number | undefined | null): void;
    }

    const appendIfValue: AppendIfValue = (key, value) => {
      if (value !== undefined && value !== null && value !== "") {
        formData.append(key, String(value));
      }
    };

    // Always send required fields if they exist and are not empty
    appendIfValue("name", data.name);
    appendIfValue("address", data.address);
    appendIfValue("phone", data.phone);
    // Optional fields
    appendIfValue("city", data.city);
    appendIfValue("state", data.state);
    appendIfValue("zip", data.zip);
    appendIfValue("country", data.country);
    appendIfValue("description", data.description);
    appendIfValue("email", data.email);
    appendIfValue("website", data.website);

    if (profilePicture) {
      formData.append("profile_picture", profilePicture);
    }

    const response = await fetch(`${API_ENDPOINTS.SALONS.LIST}/${salonId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
      return { error: result.error || "Failed to update salon" };
    }

    return result;
  } catch (error) {
    console.error("Network error:", error);
    return { error: "Network error. Please try again." };
  }
}

// Get staff for a salon
export async function getSalonStaff(salonId: number | string) {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(API_ENDPOINTS.SALONS.STAFF(salonId), {
      ...fetchConfig,
      headers: {
        ...fetchConfig.headers,
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    const result = await response.json();
    if (!response.ok) return { error: result.error || "Failed to fetch staff" };

    return { staff: result };
  } catch {
    return { error: "Network error" };
  }
}

// Get services for a salon
export async function getSalonServices(salonId: number | string) {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(API_ENDPOINTS.SALONS.SERVICES(salonId), {
      ...fetchConfig,
      headers: {
        ...fetchConfig.headers,
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    const result = await response.json();
    if (!response.ok)
      return { error: result.error || "Failed to fetch services" };

    return { services: result };
  } catch {
    return { error: "Network error" };
  }
}

export interface BusinessHours {
  [key: string]: {
    enabled: boolean;
    start: string;
    end: string;
  };
}

// Get salon business hours
export async function getSalonBusinessHours(
  salonId: number | string
): Promise<{ businessHours?: BusinessHours; error?: string }> {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return { error: "Not authenticated" };
    }

    const response = await fetch(API_ENDPOINTS.SALONS.BUSINESS_HOURS(salonId), {
      ...fetchConfig,
      headers: {
        ...fetchConfig.headers,
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      return { error: result.error || "Failed to fetch business hours" };
    }

    return { businessHours: result.businessHours };
  } catch (error) {
    console.error("Network error:", error);
    return { error: "Network error. Please try again." };
  }
}

// Update salon business hours
export async function updateSalonBusinessHours(
  salonId: number | string,
  businessHours: BusinessHours
): Promise<{ message?: string; error?: string }> {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return { error: "Not authenticated" };
    }

    const response = await fetch(API_ENDPOINTS.SALONS.BUSINESS_HOURS(salonId), {
      ...fetchConfig,
      method: "PUT",
      headers: {
        ...fetchConfig.headers,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ businessHours }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Business hours update error:", {
        status: response.status,
        statusText: response.statusText,
        error: result,
      });
      return { error: result.error || "Failed to update business hours" };
    }

    return { message: result.message || "Business hours updated successfully" };
  } catch (error) {
    console.error("Network error updating business hours:", error);
    return { error: "Network error. Please try again." };
  }
}

export interface NotificationSettings {
  emailReminders: boolean;
  inAppReminders: boolean;
  reminderHoursBefore: number;
}

// Get salon notification settings
export async function getSalonNotificationSettings(
  salonId: number | string
): Promise<{ notificationSettings?: NotificationSettings; error?: string }> {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return { error: "Not authenticated" };
    }

    const response = await fetch(
      API_ENDPOINTS.SALONS.NOTIFICATION_SETTINGS(salonId),
      {
        ...fetchConfig,
        headers: {
          ...fetchConfig.headers,
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result = await response.json();

    if (!response.ok) {
      return { error: result.error || "Failed to fetch notification settings" };
    }

    return { notificationSettings: result.notificationSettings };
  } catch (error) {
    console.error("Network error:", error);
    return { error: "Network error. Please try again." };
  }
}

// Update salon notification settings
export async function updateSalonNotificationSettings(
  salonId: number | string,
  notificationSettings: NotificationSettings
): Promise<{ message?: string; error?: string }> {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return { error: "Not authenticated" };
    }

    const response = await fetch(
      API_ENDPOINTS.SALONS.NOTIFICATION_SETTINGS(salonId),
      {
        ...fetchConfig,
        method: "PUT",
        headers: {
          ...fetchConfig.headers,
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ notificationSettings }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      return {
        error: result.error || "Failed to update notification settings",
      };
    }

    return {
      message: result.message || "Notification settings updated successfully",
    };
  } catch (error) {
    console.error("Network error:", error);
    return { error: "Network error. Please try again." };
  }
}

// Get salon amenities
export async function getSalonAmenities(
  salonId: number | string
): Promise<{ amenities?: string[]; error?: string }> {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return { error: "Not authenticated" };
    }

    const response = await fetch(API_ENDPOINTS.SALONS.AMENITIES(salonId), {
      ...fetchConfig,
      headers: {
        ...fetchConfig.headers,
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      return { error: result.error || "Failed to fetch amenities" };
    }

    return { amenities: result.amenities || [] };
  } catch (error) {
    console.error("Network error:", error);
    return { error: "Network error. Please try again." };
  }
}

// Update salon amenities
export async function updateSalonAmenities(
  salonId: number | string,
  amenities: string[]
): Promise<{ message?: string; error?: string }> {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return { error: "Not authenticated" };
    }

    const response = await fetch(API_ENDPOINTS.SALONS.AMENITIES(salonId), {
      ...fetchConfig,
      method: "PUT",
      headers: {
        ...fetchConfig.headers,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ amenities }),
    });

    const result = await response.json();

    if (!response.ok) {
      return { error: result.error || "Failed to update amenities" };
    }

    return { message: result.message || "Amenities updated successfully" };
  } catch (error) {
    console.error("Network error:", error);
    return { error: "Network error. Please try again." };
  }
}

// Loyalty Settings
export interface LoyaltySettings {
  loyaltyEnabled: boolean;
  pointsPerVisit: number;
  redeemRate: number;
}

export async function getSalonLoyaltySettings(
  salonId: number | string
): Promise<{ loyaltySettings?: LoyaltySettings; error?: string }> {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return { error: "Not authenticated" };
    }

    const response = await fetch(
      API_ENDPOINTS.SALONS.LOYALTY_SETTINGS(salonId),
      {
        ...fetchConfig,
        headers: {
          ...fetchConfig.headers,
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result = await response.json();

    if (!response.ok) {
      return { error: result.error || "Failed to fetch loyalty settings" };
    }

    return { loyaltySettings: result };
  } catch (error) {
    console.error("Network error:", error);
    return { error: "Network error. Please try again." };
  }
}

export async function updateSalonLoyaltySettings(
  salonId: number | string,
  settings: LoyaltySettings
): Promise<{ message?: string; error?: string }> {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return { error: "Not authenticated" };
    }

    const response = await fetch(
      API_ENDPOINTS.SALONS.LOYALTY_SETTINGS(salonId),
      {
        ...fetchConfig,
        method: "PUT",
        headers: {
          ...fetchConfig.headers,
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(settings),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      return { error: result.error || "Failed to update loyalty settings" };
    }

    return {
      message: result.message || "Loyalty settings updated successfully",
    };
  } catch (error) {
    console.error("Network error:", error);
    return { error: "Network error. Please try again." };
  }
}

// Slot Settings
export interface SlotSettings {
  slotDuration: number;
  bufferTime: number;
  minAdvanceBookingHours: number;
}

export async function getSalonSlotSettings(
  salonId: number | string
): Promise<{ slotSettings?: SlotSettings; error?: string }> {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return { error: "Not authenticated" };
    }

    const response = await fetch(API_ENDPOINTS.SALONS.SLOT_SETTINGS(salonId), {
      ...fetchConfig,
      headers: {
        ...fetchConfig.headers,
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      return { error: result.error || "Failed to fetch slot settings" };
    }

    return { slotSettings: result };
  } catch (error) {
    console.error("Network error:", error);
    return { error: "Network error. Please try again." };
  }
}

export async function updateSalonSlotSettings(
  salonId: number | string,
  settings: SlotSettings
): Promise<{ message?: string; error?: string }> {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return { error: "Not authenticated" };
    }

    const response = await fetch(API_ENDPOINTS.SALONS.SLOT_SETTINGS(salonId), {
      ...fetchConfig,
      method: "PUT",
      headers: {
        ...fetchConfig.headers,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(settings),
    });

    const result = await response.json();

    if (!response.ok) {
      return { error: result.error || "Failed to update slot settings" };
    }

    return { message: result.message || "Slot settings updated successfully" };
  } catch (error) {
    console.error("Network error:", error);
    return { error: "Network error. Please try again." };
  }
}

// Review Settings
export interface ReviewSettings {
  autoRequestReviews: boolean;
  reviewRequestTiming: number;
  publicReviewsEnabled: boolean;
}

export async function getSalonReviewSettings(
  salonId: number | string
): Promise<{ reviewSettings?: ReviewSettings; error?: string }> {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return { error: "Not authenticated" };
    }

    const response = await fetch(
      API_ENDPOINTS.SALONS.REVIEW_SETTINGS(salonId),
      {
        ...fetchConfig,
        headers: {
          ...fetchConfig.headers,
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result = await response.json();

    if (!response.ok) {
      return { error: result.error || "Failed to fetch review settings" };
    }

    return { reviewSettings: result };
  } catch (error) {
    console.error("Network error:", error);
    return { error: "Network error. Please try again." };
  }
}

export async function updateSalonReviewSettings(
  salonId: number | string,
  settings: ReviewSettings
): Promise<{ message?: string; error?: string }> {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return { error: "Not authenticated" };
    }

    const response = await fetch(
      API_ENDPOINTS.SALONS.REVIEW_SETTINGS(salonId),
      {
        ...fetchConfig,
        method: "PUT",
        headers: {
          ...fetchConfig.headers,
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(settings),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      return { error: result.error || "Failed to update review settings" };
    }

    return {
      message: result.message || "Review settings updated successfully",
    };
  } catch (error) {
    console.error("Network error:", error);
    return { error: "Network error. Please try again." };
  }
}

// Operating Policies
export interface OperatingPolicies {
  refundPolicy: string;
  lateArrivalPolicy: string;
  noShowPolicy: string;
}

export async function getSalonOperatingPolicies(
  salonId: number | string
): Promise<{ policies?: OperatingPolicies; error?: string }> {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return { error: "Not authenticated" };
    }

    const response = await fetch(
      API_ENDPOINTS.SALONS.OPERATING_POLICIES(salonId),
      {
        ...fetchConfig,
        headers: {
          ...fetchConfig.headers,
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result = await response.json();

    if (!response.ok) {
      return { error: result.error || "Failed to fetch operating policies" };
    }

    return { policies: result };
  } catch (error) {
    console.error("Network error:", error);
    return { error: "Network error. Please try again." };
  }
}

export async function updateSalonOperatingPolicies(
  salonId: number | string,
  policies: OperatingPolicies
): Promise<{ message?: string; error?: string }> {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return { error: "Not authenticated" };
    }

    const response = await fetch(
      API_ENDPOINTS.SALONS.OPERATING_POLICIES(salonId),
      {
        ...fetchConfig,
        method: "PUT",
        headers: {
          ...fetchConfig.headers,
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(policies),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      return { error: result.error || "Failed to update operating policies" };
    }

    return {
      message: result.message || "Operating policies updated successfully",
    };
  } catch (error) {
    console.error("Network error:", error);
    return { error: "Network error. Please try again." };
  }
}
