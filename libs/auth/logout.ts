"use client";

import { clearAuthCookie } from "@/libs/auth/cookies";

export function logout() {
  clearAuthCookie();

  // if there is localStorage then it will clear that as well
  localStorage.removeItem("token");
  localStorage.removeItem("authToken");
  localStorage.removeItem("user");
  localStorage.removeItem("tempToken");

  // Redirect to sign-in page
  window.location.href = "/auth/sign-in";
}

/** Usage
 * <button
        onClick={logout}
        className="text-sm font-medium text-red-500 hover:text-red-700"
      >
        Logout
      </button>
 */
