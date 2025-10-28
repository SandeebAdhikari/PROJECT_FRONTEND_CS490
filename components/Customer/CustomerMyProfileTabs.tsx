"use client";

import React, { useState, useEffect } from "react";
import { Calendar } from "lucide-react";
import {
  enable2FA,
  disable2FA,
  get2FAStatus,
  getProfile,
} from "@/libs/api/auth";

type TabType = "upcoming" | "past" | "favorites" | "settings";

const ProfileTabs = () => {
  const [activeTab, setActiveTab] = useState<TabType>("upcoming");

  const tabs = [
    { id: "upcoming", label: "Upcoming" },
    { id: "past", label: "Past Bookings" },
    { id: "favorites", label: "Favorites" },
    { id: "settings", label: "Settings" },
  ];

  return (
    <div className="p-4 sm:p-8">
      <div className="flex justify-between gap-1 p-1 bg-muted rounded-lg mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabType)}
            className={`flex-1 px-4 py-2 rounded-lg font-inter font-medium text-center transition-colors ${
              activeTab === tab.id
                ? "bg-background text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-card rounded-lg shadow border border-border p-8 sm:p-12">
        {activeTab === "upcoming" && <UpcomingContent />}
        {activeTab === "past" && <PastBookingsContent />}
        {activeTab === "favorites" && <FavoritesContent />}
        {activeTab === "settings" && <SettingsContent />}
      </div>
    </div>
  );
};

const UpcomingContent = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 sm:py-20">
      <Calendar className="w-16 h-16 sm:w-20 sm:h-20 text-muted-foreground mb-4" />
      <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
        No Upcoming Appointments
      </h3>
      <p className="text-muted-foreground font-inter mb-6 text-center">
        Book your next appointment now!
      </p>
      <button
        onClick={() => (window.location.href = "/customer")}
        className="px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark font-inter font-semibold transition-colors"
      >
        Discover Salons
      </button>
    </div>
  );
};

const PastBookingsContent = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 sm:py-20">
      <Calendar className="w-16 h-16 sm:w-20 sm:h-20 text-muted-foreground mb-4" />
      <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
        No Past Bookings
      </h3>
      <p className="text-muted-foreground font-inter mb-6 text-center">
        Your booking history will appear here.
      </p>
      <button
        onClick={() => (window.location.href = "/customer")}
        className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark font-inter font-semibold transition-colors"
      >
        Discover Salons
      </button>
    </div>
  );
};

const FavoritesContent = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 sm:py-20">
      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-muted rounded-full flex items-center justify-center mb-4">
        <svg
          className="w-8 h-8 text-muted-foreground"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      </div>
      <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
        No Favorites Yet
      </h3>
      <p className="text-muted-foreground font-inter mb-6 text-center">
        Start saving your favorite salons!
      </p>
      <button
        onClick={() => (window.location.href = "/customer")}
        className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark font-inter font-semibold transition-colors"
      >
        Discover Salons
      </button>
    </div>
  );
};

const SettingsContent = () => {
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  useEffect(() => {
    load2FAStatus();
  }, []);

  const load2FAStatus = async () => {
    try {
      const status = await get2FAStatus();
      if (status.error) {
        console.log("2FA status check failed:", status.error);
        setIs2FAEnabled(false);
      } else {
        setIs2FAEnabled(status.twoFactorEnabled);
      }

      // Load user's current phone number from API
      const userData = await getProfile();
      if (userData.user && userData.user.phone) {
        setPhoneNumber(userData.user.phone);
      } else {
        // Fallback to localStorage if API fails
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const user = JSON.parse(storedUser);
          if (user.phone) {
            setPhoneNumber(user.phone);
          }
        }
      }
    } catch (error) {
      console.error("Error loading 2FA status:", error);
      setIs2FAEnabled(false);
    }
  };

  const handleToggle2FA = async () => {
    setLoading(true);
    setMessage("");
    setError("");

    try {
      if (is2FAEnabled) {
        const result = await disable2FA();
        if (!result.error) {
          setIs2FAEnabled(false);
          setMessage("2FA disabled successfully");
        } else {
          console.error("Disable 2FA error:", result);
          setError("Error: " + result.error);
        }
      } else {
        const result = await enable2FA("sms", phoneNumber);
        console.log("Enable 2FA result:", result);
        if (!result.error) {
          setIs2FAEnabled(true);
          setMessage(
            "2FA enabled! You will be asked for a code on your next login."
          );
        } else {
          console.error("Enable 2FA error:", result);
          setError("Error: " + (result.error || "Failed to enable 2FA"));
        }
      }
    } catch (err) {
      console.error("Toggle 2FA error:", err);
      setError("Unexpected error: " + err);
    }

    setLoading(false);
  };

  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-bold mb-6">Settings</h2>

      <div className="border border-border rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-2">
          Two-Factor Authentication
        </h3>
        <p className="text-muted-foreground text-sm mb-4">
          Add an extra layer of security to your account
        </p>

        {message && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            {message}
          </div>
        )}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+1234567890"
              className="w-full px-3 py-2 border border-border rounded-md bg-card text-foreground"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Phone number used for 2FA SMS verification
            </p>
          </div>

          <div className="flex items-center justify-between py-4 border-t border-border">
            <div>
              <p className="font-medium">SMS 2FA</p>
              <p className="text-sm text-muted-foreground">
                {is2FAEnabled
                  ? "Enabled - You will receive verification codes via SMS"
                  : "Disabled - Enable to protect your account"}
              </p>
            </div>
            <button
              onClick={handleToggle2FA}
              disabled={loading || (!is2FAEnabled && !phoneNumber)}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                is2FAEnabled
                  ? "bg-red-600 hover:bg-red-700 text-white"
                  : "bg-primary hover:bg-primary-dark text-white"
              } disabled:opacity-50`}
            >
              {loading
                ? "Loading..."
                : is2FAEnabled
                ? "Disable 2FA"
                : "Enable 2FA"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileTabs;
