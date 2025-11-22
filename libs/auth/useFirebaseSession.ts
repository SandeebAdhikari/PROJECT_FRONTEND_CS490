"use client";

import { useEffect } from "react";
import { auth } from "@/libs/firebase/client";
import { setAuthCookie } from "@/libs/auth/cookies";
import { API_ENDPOINTS } from "@/libs/api/config";

export function useFirebaseSession() {
  useEffect(() => {
    // When the app first loads, it will check if Firebase already has a user saved locally
    const user = auth.currentUser;
    if (user) {
      user.getIdToken(true).then(async (idToken) => {
        const res = await fetch(
          API_ENDPOINTS.AUTH.VERIFY_FIREBASE,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${idToken}`,
            },
          }
        );

        if (res.ok) {
          const data = await res.json();
          // Refresh the backend JWT cookie for middleware
          setAuthCookie(data.token);
        }
      });
    }

    // it will set up a listener for future token refreshes/ auto-refreshes every hours
    const unsubscribe = auth.onIdTokenChanged(async (user) => {
      if (!user) return;

      const idToken = await user.getIdToken(true);
      const res = await fetch(
        API_ENDPOINTS.AUTH.VERIFY_FIREBASE,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
        }
      );

      if (res.ok) {
        const data = await res.json();
        // Update cookie again whenever Firebase refreshes token
        setAuthCookie(data.token);
      }
    });

    // Cleanup on component on unmount
    return () => unsubscribe();
  }, []);
}
