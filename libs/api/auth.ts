"use client";

// Authentication API functions
import { API_ENDPOINTS, fetchConfig } from "./config";
import { clearAuthCookie, setAuthCookie } from "@/libs/auth/cookies";

export interface SignupData {
  full_name: string;
  phone: string;
  email: string;
  password: string;
  role: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface User {
  id?: string;
  full_name?: string;
  phone?: string;
  email?: string;
  role?: string;
  [key: string]: unknown;
}

export interface AuthResponse {
  token?: string;
  user?: User;
  message?: string;
  error?: string;
  requires2FA?: boolean;
  tempToken?: string;
  method?: string;
}

export interface Verify2FAData {
  code: string;
  tempToken: string;
}

export interface TwoFAMethod {
  id?: string;
  method: "sms" | "email" | string;
  verified?: boolean;
  phoneNumber?: string;
}

export interface SetCustomerPasswordInput {
  token: string;
  password: string;
}

// Signup function
export async function signup(data: SignupData): Promise<AuthResponse> {
  try {
    const response = await fetch(API_ENDPOINTS.AUTH.SIGNUP, {
      ...fetchConfig,
      method: "POST",
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      return { error: result.error || "Signup failed" };
    }

    // Store token if received
    if (result.token) {
      localStorage.setItem("authToken", result.token);
      localStorage.setItem("token", result.token);
    }

    return result;
  } catch {
    return { error: "Network error. Please try again." };
  }
}

// Login function
export async function login(data: LoginData): Promise<AuthResponse> {
  try {
    const response = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
      ...fetchConfig,
      method: "POST",
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      return { error: result.error || "Login failed" };
    }

    if (result.token) {
      localStorage.setItem("authToken", result.token);
      localStorage.setItem("token", result.token);
      setAuthCookie(result.token);

      if (result.user) {
        localStorage.setItem("user", JSON.stringify(result.user));
      }
    } else if (result.tempToken) {
      localStorage.setItem("tempToken", result.tempToken);
    }

    const storedUser = localStorage.getItem("user");
    if (storedUser && !result.user) {
      result.user = JSON.parse(storedUser);
    }

    return result;
  } catch (error) {
    console.error("Login error:", error);
    return { error: "Network error. Please try again." };
  }
}

export async function setCustomerPassword(
  data: SetCustomerPasswordInput
): Promise<AuthResponse> {
  try {
    const response = await fetch(API_ENDPOINTS.AUTH.SET_CUSTOMER_PASSWORD, {
      ...fetchConfig,
      method: "POST",
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      return { error: result.error || "Failed to set password" };
    }

    if (result.token) {
      localStorage.setItem("token", result.token);
      localStorage.setItem("authToken", result.token);
      setAuthCookie(result.token);

      if (result.user) {
        localStorage.setItem("user", JSON.stringify(result.user));
      }
    }

    return result;
  } catch {
    return { error: "Network error. Please try again." };
  }
}

// Get user profile
export async function getProfile(token?: string): Promise<AuthResponse> {
  try {
    const t = token || localStorage.getItem("token");

    if (!t) {
      return { error: "No token available" };
    }

    const response = await fetch(API_ENDPOINTS.AUTH.ME, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${t}`,
      },
      credentials: "include",
    });

    const result = await response.json();

    if (!response.ok) {
      return { error: result.error || "Failed to get profile" };
    }

    return result;
  } catch {
    return { error: "Network error. Please try again." };
  }
}

/**
 * Verify Firebase token
 */
export async function verifyFirebaseToken(
  idToken: string
): Promise<AuthResponse> {
  try {
    const response = await fetch(API_ENDPOINTS.AUTH.VERIFY_FIREBASE, {
      ...fetchConfig,
      method: "POST",
      headers: {
        ...fetchConfig.headers,
        Authorization: `Bearer ${idToken}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      return { error: result.error || "Firebase verification failed" };
    }

    if (result.token) {
      localStorage.setItem("authToken", result.token);
      localStorage.setItem("token", result.token);
    }

    return result;
  } catch {
    return { error: "Network error. Please try again." };
  }
}

/**
 * Set user role (for new Firebase users)
 */
export async function setUserRole(data: {
  firebaseUid: string;
  email: string;
  fullName?: string;
  profilePic?: string;
  phone?: string;
  role: "customer" | "owner" | "staff";
  businessName?: string;
  businessEmail?: string;
  businessPhone?: string;
  businessWebsite?: string;
}): Promise<AuthResponse> {
  try {
    const response = await fetch(API_ENDPOINTS.AUTH.SET_ROLE, {
      ...fetchConfig,
      method: "POST",
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      return { error: result.error || "Failed to set role" };
    }

    if (result.token) {
      localStorage.setItem("authToken", result.token);
    }

    return result;
  } catch {
    return { error: "Network error. Please try again." };
  }
}

/**
 * Logout
 */
export async function logout(token?: string): Promise<void> {
  try {
    const headers: Record<string, string> = {
      ...fetchConfig.headers,
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    await fetch(API_ENDPOINTS.AUTH.LOGOUT, {
      credentials: fetchConfig.credentials,
      headers,
      method: "POST",
    });

    localStorage.removeItem("authToken");
    clearAuthCookie();
  } catch (error) {
    console.error("Logout error:", error);
    localStorage.removeItem("authToken");
    clearAuthCookie();
  }
}

/**
 * Verify 2FA code
 */
export async function verify2FA(data: Verify2FAData): Promise<AuthResponse> {
  try {
    const response = await fetch(API_ENDPOINTS.AUTH.VERIFY_2FA, {
      ...fetchConfig,
      method: "POST",
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      return { error: result.error || "2FA verification failed" };
    }

    // Store token if received
    if (result.token) {
      localStorage.setItem("authToken", result.token);
      localStorage.setItem("token", result.token);
      setAuthCookie(result.token);
    }

    return result;
  } catch {
    return { error: "Network error. Please try again." };
  }
}

/**
 * Enable 2FA
 */
export async function enable2FA(
  method: "sms" | "email" | " موفقن",
  phoneNumber?: string
): Promise<{ message?: string; error?: string }> {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return { error: "Not authenticated" };
    }

    const response = await fetch(API_ENDPOINTS.AUTH.ENABLE_2FA, {
      ...fetchConfig,
      method: "POST",
      headers: {
        ...fetchConfig.headers,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ method, phoneNumber }),
    });

    const result = await response.json();

    if (!response.ok) {
      return { error: result.error || "Failed to enable 2FA" };
    }

    return result;
  } catch {
    return { error: "Network error. Please try again." };
  }
}

/**
 * Disable 2FA
 */
export async function disable2FA(): Promise<{
  message?: string;
  error?: string;
}> {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return { error: "Not authenticated" };
    }

    const response = await fetch(API_ENDPOINTS.AUTH.DISABLE_2FA, {
      ...fetchConfig,
      method: "POST",
      headers: {
        ...fetchConfig.headers,
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      return { error: result.error || "Failed to disable 2FA" };
    }

    return result;
  } catch {
    return { error: "Network error. Please try again." };
  }
}

/**
 * Get 2FA status
 */
export async function get2FAStatus(): Promise<{
  twoFactorEnabled: boolean;
  methods: TwoFAMethod[];
  error?: string;
}> {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return { twoFactorEnabled: false, methods: [] };
    }

    const response = await fetch(API_ENDPOINTS.AUTH.STATUS_2FA, {
      ...fetchConfig,
      headers: {
        ...fetchConfig.headers,
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      return { twoFactorEnabled: false, methods: [], error: result.error };
    }

    return result;
  } catch {
    return {
      twoFactorEnabled: false,
      methods: [],
      error: "Network error. Please try again.",
    };
  }
}

export async function deleteAccount(
  password: string
): Promise<{ message?: string; error?: string }> {
  try {
    const token =
      localStorage.getItem("token") || localStorage.getItem("authToken");
    if (!token) {
      return { error: "Not authenticated" };
    }

    const response = await fetch(API_ENDPOINTS.AUTH.DELETE_ACCOUNT, {
      ...fetchConfig,
      method: "DELETE",
      headers: {
        ...fetchConfig.headers,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ password }),
    });

    const result = await response.json();

    if (!response.ok) {
      return { error: result.error || "Failed to delete account" };
    }

    localStorage.clear();
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });

    return result;
  } catch {
    return { error: "Network error" };
  }
}
