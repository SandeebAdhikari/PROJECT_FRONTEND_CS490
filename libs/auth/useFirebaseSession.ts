"use client";

import { useEffect } from "react";
import { auth } from "@/libs/firebase/client";

export function useFirebaseSession() {
  useEffect(() => {
    // When the app first loads, it will check if Firebase already has a user saved locally
    const user = auth.currentUser;
    if (user) {
      user.getIdToken(true).then(async (idToken) => {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify-firebase`,
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
          document.cookie = `token=${data.token}; Path=/; Max-Age=3600; SameSite=None; Secure; Domain=.webershub.com`;
        }
      });
    }

    // it will set up a listener for future token refreshes/ auto-refreshes every hours
    const unsubscribe = auth.onIdTokenChanged(async (user) => {
      if (!user) return;

      const idToken = await user.getIdToken(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify-firebase`,
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
        document.cookie = `token=${data.token}; Path=/; Max-Age=3600; SameSite=None; Secure; Domain=.webershub.com`;
      }
    });

    // Cleanup on component on unmount
    return () => unsubscribe();
  }, []);
}
