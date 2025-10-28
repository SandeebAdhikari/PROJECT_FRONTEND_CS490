/**
 * API Configuration
 * Central configuration for backend API base URL
 */

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    SIGNUP: `${API_BASE_URL}/api/auth/signup`,
    LOGIN: `${API_BASE_URL}/api/auth/login`,
    PROFILE: `${API_BASE_URL}/api/auth/profile`,
    VERIFY_FIREBASE: `${API_BASE_URL}/api/auth/verify-firebase`,
    SET_ROLE: `${API_BASE_URL}/api/auth/set-role`,
    ME: `${API_BASE_URL}/api/auth/me`,
    LOGOUT: `${API_BASE_URL}/api/auth/logout`,
    // 2FA endpoints
    VERIFY_2FA: `${API_BASE_URL}/api/auth/verify-2fa`,
    ENABLE_2FA: `${API_BASE_URL}/api/auth/2fa/enable`,
    DISABLE_2FA: `${API_BASE_URL}/api/auth/2fa/disable`,
    STATUS_2FA: `${API_BASE_URL}/api/auth/2fa/status`,
  },
  // Health check
  HEALTH: `${API_BASE_URL}/health`,
};

// Fetch configuration with credentials support
export const fetchConfig = {
  credentials: 'include' as const,
  headers: {
    'Content-Type': 'application/json',
  },
};

