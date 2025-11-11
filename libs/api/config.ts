export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export const API_ENDPOINTS = {
  AUTH: {
    SIGNUP: `${API_BASE_URL}/api/auth/signup`,
    LOGIN: `${API_BASE_URL}/api/auth/login`,
    PROFILE: `${API_BASE_URL}/api/auth/profile`,
    VERIFY_FIREBASE: `${API_BASE_URL}/api/auth/verify-firebase`,
    SET_ROLE: `${API_BASE_URL}/api/auth/set-role`,
    ME: `${API_BASE_URL}/api/auth/me`,
    LOGOUT: `${API_BASE_URL}/api/auth/logout`,
    VERIFY_2FA: `${API_BASE_URL}/api/auth/verify-2fa`,
    ENABLE_2FA: `${API_BASE_URL}/api/auth/2fa/enable`,
    DISABLE_2FA: `${API_BASE_URL}/api/auth/2fa/disable`,
    STATUS_2FA: `${API_BASE_URL}/api/auth/2fa/status`,
    DELETE_ACCOUNT: `${API_BASE_URL}/api/auth/delete-account`,
  },
  REVIEWS: {
    ADD: `${API_BASE_URL}/api/reviews/add`,
    RESPOND: (id: number) => `${API_BASE_URL}/api/reviews/respond/${id}`,
  },
  NOTIFICATIONS: {
    LIST: `${API_BASE_URL}/api/notifications`,
    MARK_READ: (id: number) => `${API_BASE_URL}/api/notifications/${id}/read`,
    MARK_ALL_READ: `${API_BASE_URL}/api/notifications/read-all`,
  },
  PHOTOS: {
    UPLOAD: `${API_BASE_URL}/api/photos/upload`,
    LIST: (salonId: number) => `${API_BASE_URL}/api/photos/salon/${salonId}`,
    DELETE: (id: number) => `${API_BASE_URL}/api/photos/${id}`,
  },
  HISTORY: {
    APPOINTMENTS: `${API_BASE_URL}/api/history/user`,
  },
  SHOP: {
    PRODUCTS: `${API_BASE_URL}/api/shop/products`,
    PRODUCT: (id: number) => `${API_BASE_URL}/api/shop/products/${id}`,
    ADD: `${API_BASE_URL}/api/shop/products`,
    UPDATE: (id: number) => `${API_BASE_URL}/api/shop/products/${id}`,
    DELETE: (id: number) => `${API_BASE_URL}/api/shop/products/${id}`,
  },
  APPOINTMENTS: {
    BOOK: `${API_BASE_URL}/api/appointments`,
  },
  SALONS: {
    CREATE: `${API_BASE_URL}/api/salons`,
    LIST: `${API_BASE_URL}/api/salons`,
    CHECK_OWNER: `${API_BASE_URL}/api/salons/check-owner`,
  },
  HEALTH: `${API_BASE_URL}/health`,
};

export const fetchConfig = {
  credentials: 'include' as const,
  headers: {
    'Content-Type': 'application/json',
  },
};

