"use client";

import React, { useEffect, useState, Suspense } from "react";
import { ArrowLeft, User } from "lucide-react";
import ProfileTabs from "@/components/Customer/CustomerMyProfileTabs";

const ProfilePage = () => {
  const [email, setEmail] = useState("Loading...");
  const [, setLoading] = useState(true);

  useEffect(() => {
    // Load email using the helper declared below
    const emailFromStorage = loadUserEmail();
    if (emailFromStorage) {
      setEmail(emailFromStorage);
    } else {
      setEmail("Email not available");
    }
    setLoading(false);
  }, []);

  return (
    <div className="flex flex-col w-full min-h-screen bg-background">
      {/* Navigation Bar */}
      <div className="flex justify-between items-center p-4 sm:p-6 border-b border-border">
        <button
          onClick={() => (window.location.href = "/customer")}
          className="flex items-center gap-2 text-foreground hover:text-primary transition-colors font-inter"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Discovery</span>
        </button>
        <button
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/sign-in";
          }}
          className="px-4 py-2 bg-card border border-border text-foreground rounded-lg hover:bg-muted font-inter font-semibold transition-colors"
        >
          Logout
        </button>
      </div>

      {/* Profile Header */}
      <div className="p-4 sm:p-8 flex items-center gap-4 sm:gap-6">
        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
          <User className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
        </div>
        <div className="flex-1">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-1">
            My Profile
          </h1>
          <p className="text-muted-foreground font-inter">{email}</p>
        </div>
      </div>

      <Suspense fallback={<div className="p-8">Loading profile...</div>}>
        <ProfileTabs />
      </Suspense>
    </div>
  );
};

export default ProfilePage;
function loadUserEmail(): string | null {
  try {
    if (typeof window === "undefined") return null;

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        if (user?.email) return user.email;
      } catch {
        console.warn("Could not parse stored user");
      }
    }

    const token = localStorage.getItem("token");
    if (token) {
      try {
        const parts = token.split(".");
        if (parts.length > 1) {
          const payload = JSON.parse(atob(parts[1]));
          return payload?.email ?? null;
        }
      } catch {
        console.warn("Could not decode token");
      }
    }

    return null;
  } catch (error) {
    console.error("Error loading email:", error);
    return null;
  }
}
