"use client";

import React, { useState, useEffect } from "react";
import { Calendar } from "lucide-react";
import {
  enable2FA,
  disable2FA,
  get2FAStatus,
  getProfile,
  deleteAccount,
} from "@/libs/api/auth";
import AppointmentHistory from "@/components/History/AppointmentHistory";
import { useFavorites } from "@/hooks/useFavorites";
import SalonCard from "@/components/Salon/SalonCard";
import data from "@/data/data.json";

type TabType = "upcoming" | "past" | "favorites" | "settings";

const ProfileTabs = () => {
  const [activeTab, setActiveTab] = useState<TabType>("upcoming");
  const { toggleFavorite, isFavorite, favorites } = useFavorites();

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
        {activeTab === "favorites" && (
          <FavoritesContent 
            favorites={favorites} 
            toggleFavorite={toggleFavorite}
            isFavorite={isFavorite}
          />
        )}
        {activeTab === "settings" && <SettingsContent />}
      </div>
    </div>
  );
};

const UpcomingContent = () => {
  return <AppointmentHistory filter="upcoming" />;
};

const PastBookingsContent = () => {
  return <AppointmentHistory filter="past" />;
};

interface FavoritesContentProps {
  favorites: string[];
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
}

const FavoritesContent: React.FC<FavoritesContentProps> = ({
  favorites,
  toggleFavorite,
  isFavorite,
}) => {
  const favoriteSalons = data.salons.filter((salon) =>
    favorites.includes(salon.id)
  );

  if (favoriteSalons.length === 0) {
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
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Your Favorite Salons</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {favoriteSalons.map((salon) => (
          <SalonCard
            key={salon.id}
            id={salon.id}
            name={salon.name}
            city={salon.city}
            description={salon.description}
            category={salon.category}
            rating={salon.rating}
            totalReviews={salon.totalReviews}
            priceFrom={salon.priceFrom}
            imageUrl={salon.imageUrl}
            isFavorite={isFavorite(salon.id)}
            onToggleFavorite={toggleFavorite}
          />
        ))}
      </div>
    </div>
  );
};

const SettingsContent = () => {
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  
  const [profileData, setProfileData] = useState({
    fullName: "",
    email: "",
    phone: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [notifications, setNotifications] = useState({
    emailBooking: true,
    emailReminder: true,
    emailPromotions: false,
    smsReminder: true,
  });

  const [currentPlan, setCurrentPlan] = useState("free");

  const plans = [
    {
      id: "free",
      name: "Free",
      price: 0,
      interval: "forever",
      features: [
        "Book up to 3 appointments per month",
        "Basic search and filters",
        "Email notifications",
        "Save up to 5 favorites",
      ],
      color: "border-gray-300",
    },
    {
      id: "pro",
      name: "Pro",
      price: 9.99,
      interval: "month",
      features: [
        "Unlimited appointments",
        "Priority booking",
        "Advanced search filters",
        "SMS reminders",
        "Unlimited favorites",
        "10% discount on all services",
        "Cancel anytime up to 2 hours before",
      ],
      color: "border-primary",
      popular: true,
    },
    {
      id: "premium",
      name: "Premium",
      price: 19.99,
      interval: "month",
      features: [
        "Everything in Pro",
        "VIP customer support",
        "20% discount on all services",
        "Free cancellation anytime",
        "Exclusive salon access",
        "Personal beauty consultant",
        "Birthday rewards",
      ],
      color: "border-yellow-500",
    },
  ];

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const status = await get2FAStatus();
      setIs2FAEnabled(status.twoFactorEnabled || false);

      const userData = await getProfile();
      if (userData.user) {
        setProfileData({
          fullName: userData.user.full_name || userData.user.fullName || "",
          email: userData.user.email || "",
          phone: userData.user.phone || "",
        });
      } else {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const user = JSON.parse(storedUser);
          setProfileData({
            fullName: user.full_name || user.fullName || "",
            email: user.email || "",
            phone: user.phone || "",
          });
        }
      }
    } catch (error) {
      console.error("Error loading user data:", error);
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
          setError("Error: " + result.error);
        }
      } else {
        const result = await enable2FA("sms", profileData.phone);
        if (!result.error) {
          setIs2FAEnabled(true);
          setMessage("2FA enabled successfully");
        } else {
          setError("Error: " + (result.error || "Failed to enable 2FA"));
        }
      }
    } catch (err) {
      setError("Unexpected error occurred");
    }

    setLoading(false);
    setTimeout(() => {
      setMessage("");
      setError("");
    }, 5000);
  };

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    
    // update localStorage with new profile data
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      const updatedUser = {
        ...user,
        full_name: profileData.fullName,
        phone: profileData.phone,
        email: profileData.email,
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
    
    setMessage("Profile updated successfully!");
    setTimeout(() => setMessage(""), 3000);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("Passwords do not match");
      setTimeout(() => setError(""), 3000);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      setTimeout(() => setError(""), 3000);
      return;
    }

    setMessage("Password changed successfully!");
    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setTimeout(() => setMessage(""), 3000);
  };

  const handleDeleteAccount = async () => {
    const password = prompt("Please enter your password to confirm account deletion:");
    
    if (!password) {
      return;
    }

    if (!window.confirm("Are you absolutely sure? This will permanently delete your account and all data. This action cannot be undone.")) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await deleteAccount(password);
      
      if (result.error) {
        setError(result.error);
        setTimeout(() => setError(""), 5000);
      } else {
        alert("Account deleted successfully. You will be redirected to the home page.");
        window.location.href = "/";
      }
    } catch (err) {
      setError("Failed to delete account. Please try again.");
      setTimeout(() => setError(""), 5000);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = (planId: string) => {
    if (planId === currentPlan) return;
    
    if (window.confirm(`Upgrade to ${plans.find(p => p.id === planId)?.name} plan?`)) {
      setCurrentPlan(planId);
      setMessage(`Successfully upgraded to ${plans.find(p => p.id === planId)?.name} plan!`);
      setTimeout(() => setMessage(""), 5000);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <h2 className="text-2xl font-bold mb-6">Settings</h2>

        {message && (
        <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
            {message}
          </div>
        )}
        {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

      {/* Profile Information */}
      <div className="border border-border rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Profile Information</h3>
        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Full Name</label>
            <input
              type="text"
              value={profileData.fullName}
              onChange={(e) => setProfileData({...profileData, fullName: e.target.value})}
              className="w-full px-4 py-2.5 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={profileData.email}
              onChange={(e) => setProfileData({...profileData, email: e.target.value})}
              className="w-full px-4 py-2.5 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Phone Number</label>
            <input
              type="tel"
              value={profileData.phone}
              onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
              placeholder="+1234567890"
              className="w-full px-4 py-2.5 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 font-medium transition-colors"
          >
            Update Profile
          </button>
        </form>
      </div>

      {/* Change Password */}
      <div className="border border-border rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Change Password</h3>
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Current Password</label>
            <input
              type="password"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
              className="w-full px-4 py-2.5 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">New Password</label>
            <input
              type="password"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
              className="w-full px-4 py-2.5 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Confirm New Password</label>
            <input
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
              className="w-full px-4 py-2.5 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 font-medium transition-colors"
          >
            Change Password
          </button>
        </form>
      </div>

      {/* Subscription Plans */}
      <div className="border border-border rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-2">Subscription Plan</h3>
        <p className="text-muted-foreground text-sm mb-6">
          Upgrade your plan to unlock more features and benefits
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative border-2 ${plan.color} rounded-lg p-6 ${
                currentPlan === plan.id ? "bg-primary/5" : "bg-card"
              } transition-all hover:shadow-lg`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">
                    POPULAR
                  </span>
                </div>
              )}

              {currentPlan === plan.id && (
                <div className="absolute -top-3 right-4">
                  <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    CURRENT
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h4 className="text-2xl font-bold mb-2">{plan.name}</h4>
                <div className="flex items-end justify-center gap-1">
                  <span className="text-4xl font-extrabold">
                    ${plan.price}
                  </span>
                  <span className="text-muted-foreground text-sm mb-2">
                    /{plan.interval}
                  </span>
                </div>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <svg
                      className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleUpgrade(plan.id)}
                disabled={currentPlan === plan.id}
                className={`w-full py-2.5 rounded-lg font-semibold transition-colors ${
                  currentPlan === plan.id
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : plan.popular
                    ? "bg-primary text-white hover:bg-primary/90"
                    : "bg-card border-2 border-primary text-primary hover:bg-primary/5"
                }`}
              >
                {currentPlan === plan.id ? "Current Plan" : "Upgrade"}
              </button>
            </div>
          ))}
        </div>

        {currentPlan !== "free" && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-3">
              <svg
                className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div className="text-sm">
                <p className="font-semibold text-blue-900">
                  Billing Information
                </p>
                <p className="text-blue-700 mt-1">
                  Next billing date: {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                </p>
                <button
                  onClick={() => setMessage("Payment method updated")}
                  className="text-blue-600 hover:text-blue-800 font-medium mt-2 underline"
                >
                  Update payment method
                </button>
              </div>
            </div>
          </div>
        )}
          </div>

      {/* Security - 2FA */}
      <div className="border border-border rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-2">Two-Factor Authentication</h3>
        <p className="text-muted-foreground text-sm mb-4">
          Add an extra layer of security to your account
        </p>
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
            disabled={loading || (!is2FAEnabled && !profileData.phone)}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                is2FAEnabled
                  ? "bg-red-600 hover:bg-red-700 text-white"
                : "bg-primary hover:bg-primary/90 text-white"
              } disabled:opacity-50`}
            >
            {loading ? "Loading..." : is2FAEnabled ? "Disable 2FA" : "Enable 2FA"}
            </button>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="border border-border rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Notification Preferences</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-border">
            <div>
              <p className="font-medium">Booking Confirmations</p>
              <p className="text-sm text-muted-foreground">
                Receive email confirmations for bookings
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.emailBooking}
                onChange={(e) => setNotifications({...notifications, emailBooking: e.target.checked})}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-border">
            <div>
              <p className="font-medium">Appointment Reminders</p>
              <p className="text-sm text-muted-foreground">
                Get email reminders before appointments
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.emailReminder}
                onChange={(e) => setNotifications({...notifications, emailReminder: e.target.checked})}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-border">
            <div>
              <p className="font-medium">SMS Reminders</p>
              <p className="text-sm text-muted-foreground">
                Receive text message reminders
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.smsReminder}
                onChange={(e) => setNotifications({...notifications, smsReminder: e.target.checked})}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium">Promotional Emails</p>
              <p className="text-sm text-muted-foreground">
                Receive special offers and promotions
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.emailPromotions}
                onChange={(e) => setNotifications({...notifications, emailPromotions: e.target.checked})}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Delete Account */}
      <div className="border border-red-200 bg-red-50 rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-2 text-red-800">Delete Account</h3>
        <p className="text-sm text-red-600 mb-4">
          Once you delete your account, there is no going back. Please be certain.
        </p>
        <button
          onClick={handleDeleteAccount}
          className="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors"
        >
          Delete Account
        </button>
      </div>
    </div>
  );
};

export default ProfileTabs;
