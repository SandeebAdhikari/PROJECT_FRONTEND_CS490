export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export const API_ENDPOINTS = {
  AUTH: {
    SIGNUP: `${API_BASE_URL}/api/auth/signup`,
    LOGIN: `${API_BASE_URL}/api/auth/login`,
    PROFILE: `${API_BASE_URL}/api/auth/profile`,
    VERIFY_FIREBASE: `${API_BASE_URL}/api/auth/verify-firebase`,
    SET_ROLE: `${API_BASE_URL}/api/auth/set-role`,
    ME: `${API_BASE_URL}/api/auth/me`,
    LOGOUT: `${API_BASE_URL}/api/auth/logout`,
    REFRESH: `${API_BASE_URL}/api/auth/refresh`,
    VERIFY_2FA: `${API_BASE_URL}/api/auth/verify-2fa`,
    ENABLE_2FA: `${API_BASE_URL}/api/auth/2fa/enable`,
    DISABLE_2FA: `${API_BASE_URL}/api/auth/2fa/disable`,
    STATUS_2FA: `${API_BASE_URL}/api/auth/2fa/status`,
    DELETE_ACCOUNT: `${API_BASE_URL}/api/auth/delete-account`,
          SET_CUSTOMER_PASSWORD: `${API_BASE_URL}/api/auth/customer/set-password`,
          SETUP_ADMIN: `${API_BASE_URL}/api/auth/setup-admin`,
        },
  NOTIFICATIONS: {
    LIST: `${API_BASE_URL}/api/notifications`,
    MARK_READ: (id: number) => `${API_BASE_URL}/api/notifications/${id}/read`,
    MARK_ALL_READ: `${API_BASE_URL}/api/notifications/read-all`,
  },
  PHOTOS: {
    UPLOAD: `${API_BASE_URL}/api/photos/upload`,
    LIST: (salonId: number | string) =>
      `${API_BASE_URL}/api/photos/salon/${salonId}`,
    DELETE: (id: number | string) => `${API_BASE_URL}/api/photos/${id}`,
    ADD_SALON: `${API_BASE_URL}/api/photos/salon`,
    DELETE_SALON: (photoId: number | string) =>
      `${API_BASE_URL}/api/photos/salon/${photoId}`,
  },
  HISTORY: {
    APPOINTMENTS: `${API_BASE_URL}/api/history/user`,
    EXPORT: `${API_BASE_URL}/api/history/user/export?format=csv`,
  },
  SHOP: {
    PRODUCTS: (salonId: number | string) => `${API_BASE_URL}/api/shop/products/${salonId}`,
    PRODUCT: (id: number) => `${API_BASE_URL}/api/shop/products/${id}`,
    ADD: `${API_BASE_URL}/api/shop/add-product`,
    UPDATE: (id: number) => `${API_BASE_URL}/api/shop/update-product/${id}`,
    DELETE: (id: number) => `${API_BASE_URL}/api/shop/products/${id}`,
    CART: `${API_BASE_URL}/api/shop/cart`,
    ADD_TO_CART: `${API_BASE_URL}/api/shop/add-to-cart`,
    CHECKOUT: `${API_BASE_URL}/api/shop/checkout`,
  },
  PAYMENTS: {
    CHECKOUT: `${API_BASE_URL}/api/payments/checkout`,
    SALON_PAYMENTS: (salonId: number | string) =>
      `${API_BASE_URL}/api/payments/salon/${salonId}`,
    GET_BY_SESSION: `${API_BASE_URL}/api/payments/session`,
  },
  APPOINTMENTS: {
    BOOK: `${API_BASE_URL}/api/appointments/create`,
    UPDATE: (id: number | string) => `${API_BASE_URL}/api/appointments/${id}`,
    DELETE: (id: number | string) => `${API_BASE_URL}/api/appointments/${id}`,
    GET_SALON: (salonId: number | string, date?: string) =>
      date
        ? `${API_BASE_URL}/api/appointments/salon?salon_id=${salonId}&date=${date}`
        : `${API_BASE_URL}/api/appointments/salon?salon_id=${salonId}`,
    GET_SALON_STATS: (salonId: number | string) =>
      `${API_BASE_URL}/api/appointments/salon-stats?salon_id=${salonId}`,
    GET_BY_ID: (id: number | string) =>
      `${API_BASE_URL}/api/appointments/${id}`,
  },
  BOOKINGS: {
    AVAILABLE_SLOTS: (salonId: number | string, staffId: number | string, date: string, serviceId?: number | string) => {
      const params = new URLSearchParams();
      params.append('salon_id', String(salonId));
      params.append('staff_id', String(staffId));
      params.append('date', date);
      if (serviceId) params.append('service_id', String(serviceId));
      return `${API_BASE_URL}/api/bookings/slots?${params.toString()}`;
    },
  },
  SALONS: {
    CREATE: `${API_BASE_URL}/api/salons`,
    LIST: `${API_BASE_URL}/api/salons`,
    GET_PUBLIC: (salonId: number | string) =>
      `${API_BASE_URL}/api/salons/public/${salonId}`,
    CHECK_OWNER: `${API_BASE_URL}/api/salons/check-owner`,
    STAFF: (salonId: number | string) =>
      `${API_BASE_URL}/api/staff/salon/${salonId}/staff`,
    SERVICES: (salonId: number | string) =>
      `${API_BASE_URL}/api/salons/${salonId}/services`,
    PRODUCTS: (salonId: number | string) =>
      `${API_BASE_URL}/api/salons/${salonId}/products`,
    PRODUCTS_PUBLIC: (salonId: number | string) =>
      `${API_BASE_URL}/api/salons/public/${salonId}/products`,
    CREATE_SERVICE: `${API_BASE_URL}/api/services`,
    UPDATE_SERVICE: (serviceId: number | string) =>
      `${API_BASE_URL}/api/services/${serviceId}`,
    DELETE_SERVICE: (serviceId: number | string) =>
      `${API_BASE_URL}/api/services/${serviceId}`,
    BUSINESS_HOURS: (salonId: number | string) =>
      `${API_BASE_URL}/api/salons/${salonId}/business-hours`,
    NOTIFICATION_SETTINGS: (salonId: number | string) =>
      `${API_BASE_URL}/api/salons/${salonId}/notification-settings`,
    AMENITIES: (salonId: number | string) =>
      `${API_BASE_URL}/api/salons/${salonId}/amenities`,
    BOOKING_SETTINGS: (salonId: number | string) =>
      `${API_BASE_URL}/api/salons/${salonId}/booking-settings`,
    LOYALTY_SETTINGS: (salonId: number | string) =>
      `${API_BASE_URL}/api/salons/${salonId}/loyalty-settings`,
    SLOT_SETTINGS: (salonId: number | string) =>
      `${API_BASE_URL}/api/salons/${salonId}/slot-settings`,
    REVIEW_SETTINGS: (salonId: number | string) =>
      `${API_BASE_URL}/api/salons/${salonId}/review-settings`,
    OPERATING_POLICIES: (salonId: number | string) =>
      `${API_BASE_URL}/api/salons/${salonId}/operating-policies`,
    GET_BUSINESS_HOURS_PUBLIC: (salonId: number | string) =>
      `${API_BASE_URL}/api/salons/public/${salonId}/business-hours`,
    GET_BOOKING_POLICY_PUBLIC: (salonId: number | string) =>
      `${API_BASE_URL}/api/salons/public/${salonId}/booking-policy`,
    SERVICES_PUBLIC: (salonId: number | string) =>
      `${API_BASE_URL}/api/salons/public/${salonId}/services`,
  },
  MESSAGES: {
    SEND: `${API_BASE_URL}/api/messages`,
    SALON_MESSAGES: (salonId: number | string) =>
      `${API_BASE_URL}/api/messages/salon/${salonId}`,
    SALON_CUSTOMERS: (salonId: number | string) =>
      `${API_BASE_URL}/api/messages/salon/${salonId}/customers`,
    CONVERSATION: (salonId: number | string, customerId: number | string) =>
      `${API_BASE_URL}/api/messages/salon/${salonId}/conversation/${customerId}`,
  },
  ACCOUNT: {
    SETTINGS: `${API_BASE_URL}/api/account/settings`,
    PASSWORD: `${API_BASE_URL}/api/account/password`,
    SUBSCRIPTION_PLANS: `${API_BASE_URL}/api/account/subscription/plans`,
    SUBSCRIPTION: `${API_BASE_URL}/api/account/subscription`,
    DELETE: `${API_BASE_URL}/api/account`,
  },
  STAFF: {
    LOGIN: `${API_BASE_URL}/api/staff/login`,
    SET_PIN: `${API_BASE_URL}/api/staff/set-pin`,
    GET_SALON_STAFF: (salonId: number | string) =>
      `${API_BASE_URL}/api/staff/salon/${salonId}/staff`,
    GET_BY_ID: (id: number | string) => `${API_BASE_URL}/api/staff/staff/${id}`,
    UPDATE: (id: number | string) => `${API_BASE_URL}/api/staff/staff/${id}`,
    CREATE: `${API_BASE_URL}/api/staff/staff`,
    ROLES: (salonId?: number | string) =>
      salonId
        ? `${API_BASE_URL}/api/staff/staff_roles?salon_id=${salonId}`
        : `${API_BASE_URL}/api/staff/staff_roles`,
  },
  USERS: {
    SALON_CUSTOMERS: (salonId?: number | string, search?: string) => {
      const params = new URLSearchParams();
      if (salonId) params.append("salon_id", String(salonId));
      if (search) params.append("search", search);
      return `${API_BASE_URL}/api/users/salon-customers${
        params.toString() ? "?" + params.toString() : ""
      }`;
    },
    SALON_CUSTOMERS_STATS: (salonId: number | string) =>
      `${API_BASE_URL}/api/users/salon-customers/stats?salon_id=${salonId}`,
    SALON_CUSTOMERS_DIRECTORY: (salonId: number | string) =>
      `${API_BASE_URL}/api/users/salon-customers/directory?salon_id=${salonId}`,
  },
  ANALYTICS: {
    OVERVIEW: (salonId: number | string, params?: string) =>
      params
        ? `${API_BASE_URL}/api/analytics/overview?${params}`
        : `${API_BASE_URL}/api/analytics/overview?salonId=${salonId}`,
    DASHBOARD: (salonId: number | string) =>
      `${API_BASE_URL}/api/analytics/dashboard?salonId=${salonId}`,
    REVENUE_SERIES: (params: string) =>
      `${API_BASE_URL}/api/analytics/revenue-series?${params}`,
    SERVICE_DISTRIBUTION: (params: string) =>
      `${API_BASE_URL}/api/analytics/service-distribution?${params}`,
  },
  REVIEWS: {
    ADD: `${API_BASE_URL}/api/reviews/add`,
    RESPOND: (id: number) => `${API_BASE_URL}/api/reviews/respond/${id}`,
    GET_SALON_REVIEWS: (salonId: number | string) =>
      `${API_BASE_URL}/api/reviews/salon/${salonId}`,
    UPDATE: (id: number | string) => `${API_BASE_URL}/api/reviews/${id}`,
    DELETE: (id: number | string) => `${API_BASE_URL}/api/reviews/${id}`,
  },
  SUBSCRIPTIONS: {
    CHECKOUT: `${API_BASE_URL}/api/subscriptions/checkout`,
    HISTORY: `${API_BASE_URL}/api/subscriptions/history`,
    STATUS: `${API_BASE_URL}/api/subscriptions/status`,
  },
  HEALTH: `${API_BASE_URL}/health`,
  ADMINS: {
    USER_ENGAGEMENT: `${API_BASE_URL}/api/admins/user-engagement`,
    APPOINTMENT_TRENDS: (startDate?: string, endDate?: string) => {
      const params = new URLSearchParams();
      if (startDate) params.append("start_date", startDate);
      if (endDate) params.append("end_date", endDate);
      return `${API_BASE_URL}/api/admins/appointment-trends${params.toString() ? "?" + params.toString() : ""}`;
    },
    SALON_REVENUES: (startDate?: string, endDate?: string) => {
      const params = new URLSearchParams();
      if (startDate) params.append("start_date", startDate);
      if (endDate) params.append("end_date", endDate);
      return `${API_BASE_URL}/api/admins/salon-revenues${params.toString() ? "?" + params.toString() : ""}`;
    },
    LOYALTY_USAGE: `${API_BASE_URL}/api/admins/loyalty-usage`,
    USER_DEMOGRAPHICS: `${API_BASE_URL}/api/admins/user-demographics`,
    CUSTOMER_RETENTION: `${API_BASE_URL}/api/admins/customer-retention`,
    REPORTS: (startDate?: string, endDate?: string, format?: string) => {
      const params = new URLSearchParams();
      if (startDate) params.append("start_date", startDate);
      if (endDate) params.append("end_date", endDate);
      if (format) params.append("format", format);
      return `${API_BASE_URL}/api/admins/reports${params.toString() ? "?" + params.toString() : ""}`;
    },
    SYSTEM_LOGS: `${API_BASE_URL}/api/admins/system-logs`,
    PENDING_SALONS: `${API_BASE_URL}/api/admins/pending-salons`,
    VERIFY_SALON: (salonId: number | string) => `${API_BASE_URL}/api/admins/verify/${salonId}`,
  },
};

export const fetchConfig = {
  credentials: "include" as const,
  headers: {
    "Content-Type": "application/json",
  },
};
