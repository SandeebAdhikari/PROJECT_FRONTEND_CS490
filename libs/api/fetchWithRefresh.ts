import { API_ENDPOINTS } from "./config";

export const fetchWithRefresh = async (
  url: string,
  options: RequestInit = {}
) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const res = await fetch(url, {
    ...options,
    cache: "no-store",
    credentials: "include",
    headers,
  });

  // If unauthorized, try refreshing the token once
  if (res.status === 401) {
    console.warn("⚠️ Token expired — attempting refresh...");
    try {
      const refreshRes = await fetch(
        API_ENDPOINTS.AUTH.REFRESH,
        { method: "POST", credentials: "include" }
      );

      if (refreshRes.ok) {
        const { token: newToken } = await refreshRes.json();
        if (newToken) {
          localStorage.setItem("token", newToken);

          const retryRes = await fetch(url, {
            ...options,
            cache: "no-store",
            credentials: "include",
            headers: {
              ...headers,
              Authorization: `Bearer ${newToken}`,
            },
          });

          return retryRes;
        }
      }
    } catch (err) {
      console.error("Refresh token failed:", err);
    }
  }

  return res;
};
