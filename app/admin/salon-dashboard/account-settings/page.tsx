"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Dashboard/Header";
import TwoFactorCard from "@/components/Dashboard/TwoFactAuth";
import {
  getAccountSettings,
  updateAccountSettings,
  changePassword,
  getSubscriptionPlans,
  getCurrentSubscription,
  updateSubscription,
  deleteAccount as deleteAccountAPI,
} from "@/libs/api/account";
// import { createSubscriptionCheckout } from "@/libs/api/subscriptions"; // Disabled until payment implementation
import type {
  AccountSettings,
  ChangePasswordData,
  SubscriptionPlan,
} from "@/libs/api/account";

const AccountSettingsPage = () => {
  const router = useRouter();
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [account, setAccount] = useState<AccountSettings | null>(null);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [currentPlan, setCurrentPlan] = useState<string>("free");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Profile form state
  const [profileData, setProfileData] = useState({
    full_name: "",
    email: "",
    phone: "",
  });
  const [profileLoading, setProfileLoading] = useState(false);

  // Password form state
  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Subscription state
  const [subscriptionLoading, setSubscriptionLoading] = useState(false);

  useEffect(() => {
    loadAccountData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadAccountData = async () => {
    setLoading(true);
    setError("");
    try {
      const [accountResult, plansResult, subscriptionResult] = await Promise.all([
        getAccountSettings(),
        getSubscriptionPlans(),
        getCurrentSubscription(),
      ]);

      // Handle account data (fetched from database - signup data)
      if (accountResult.error) {
        setError(accountResult.error);
      } else if (accountResult.account) {
        setAccount(accountResult.account);
        // Pre-fill form with data from signup (stored in database)
        setProfileData({
          full_name: accountResult.account.full_name || "",
          email: accountResult.account.email || "",
          phone: accountResult.account.phone || "",
        });
      } else {
        setError("Failed to load account data");
      }

      // Handle subscription plans
      if (plansResult.plans) {
        setPlans(plansResult.plans);
      } else if (plansResult.error) {
        console.error("Error loading plans:", plansResult.error);
      }

      // Handle current subscription
      if (subscriptionResult.subscription) {
        setCurrentPlan(subscriptionResult.subscription.plan || "free");
      } else if (subscriptionResult.error) {
        console.error("Error loading subscription:", subscriptionResult.error);
        // Default to free if subscription fetch fails
        setCurrentPlan("free");
      }
    } catch (err) {
      console.error("Error loading account data:", err);
      setError("Failed to load account settings. Please refresh the page.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileLoading(true);
    setMessage("");
    setError("");

    try {
      const result = await updateAccountSettings(profileData);

      if (result.error) {
        setError(result.error);
      } else {
        setMessage(result.message || "Profile updated successfully");
        if (result.account) {
          setAccount(result.account);
        }
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (err) {
      setError("Failed to update profile");
    } finally {
      setProfileLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordLoading(true);
    setMessage("");
    setError("");

    if (passwordData.new_password !== passwordData.confirm_password) {
      setError("Passwords do not match");
      setPasswordLoading(false);
      return;
    }

    if (passwordData.new_password.length < 8) {
      setError("Password must be at least 8 characters long");
      setPasswordLoading(false);
      return;
    }

    try {
      const result = await changePassword({
        current_password: passwordData.current_password,
        new_password: passwordData.new_password,
      });

      if (result.error) {
        setError(result.error);
      } else {
        setMessage(result.message || "Password changed successfully");
        setPasswordData({
          current_password: "",
          new_password: "",
          confirm_password: "",
        });
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (err) {
      setError("Failed to change password");
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleUpdateSubscription = async (planId: string) => {
    if (planId === currentPlan) return;

    const selectedPlan = plans.find((p) => p.plan_id === planId);
    if (!selectedPlan) {
      setError("Invalid plan selected");
      return;
    }

    // Payment implementation disabled - allow direct plan changes for now
    if (selectedPlan.price > 0) {
      const confirmChange = confirm(
        `Note: Payment processing is not yet implemented. You can switch to ${selectedPlan.plan_name} plan, but payment will need to be set up later. Continue?`
      );
      if (!confirmChange) {
        return;
      }
    }

    setSubscriptionLoading(true);
    setMessage("");
    setError("");

    try {
      const result = await updateSubscription({ plan: planId });

      if (result.error) {
        // If backend says to use checkout, show message instead
        if (result.error.includes("checkout")) {
          setError("Payment processing is not yet implemented. Please contact support to upgrade your plan.");
        } else {
          setError(result.error);
        }
      } else {
        setCurrentPlan(planId);
        setMessage(result.message || `Successfully switched to ${selectedPlan.plan_name} plan`);
        // Reload account data to get updated subscription
        await loadAccountData();
        setTimeout(() => setMessage(""), 5000);
      }
    } catch (err) {
      setError("Failed to update subscription. Please try again.");
    } finally {
      setSubscriptionLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = confirm(
      "Are you ABSOLUTELY sure? This will permanently delete your salon account, all appointments, and customer data. This action cannot be undone."
    );

    if (!confirmDelete) {
      return;
    }

    setDeleteLoading(true);

    try {
      const result = await deleteAccountAPI();

      if (result.error) {
        alert(result.error);
        setDeleteLoading(false);
        return;
      }

      alert(
        "Account deleted successfully. You will be redirected to the home page."
      );
      router.push("/");
    } catch {
      alert("Failed to delete account. Please try again.");
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="font-inter space-y-6 p-6 sm:p-8">
        <Header
          title="Account Settings"
          subtitle="Manage your account security and preferences"
          showActions={false}
        />
        <div className="bg-card border border-border rounded-2xl p-6">
          <p className="text-muted-foreground">Loading account settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="font-inter space-y-6 p-6 sm:p-8">
      <Header
        title="Account Settings"
        subtitle="Manage your account security and preferences"
        showActions={false}
      />

      {message && (
        <div className="p-3 rounded-lg bg-secondary text-foreground">
          {message}
        </div>
      )}

      {error && (
        <div className="p-3 rounded-lg bg-destructive/10 text-destructive">
          {error}
        </div>
      )}

      {/* Profile Information */}
      <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
        <h2 className="text-lg font-bold">Profile Information</h2>
        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Full Name</label>
            <input
              type="text"
              value={profileData.full_name}
              onChange={(e) =>
                setProfileData({ ...profileData, full_name: e.target.value })
              }
              className="w-full mt-1 rounded-lg border border-border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              value={profileData.email}
              onChange={(e) =>
                setProfileData({ ...profileData, email: e.target.value })
              }
              className="w-full mt-1 rounded-lg border border-border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Phone</label>
            <input
              type="tel"
              value={profileData.phone}
              onChange={(e) =>
                setProfileData({ ...profileData, phone: e.target.value })
              }
              className="w-full mt-1 rounded-lg border border-border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <button
            type="submit"
            disabled={profileLoading}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary-dark transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {profileLoading ? "Saving..." : "Update Profile"}
          </button>
        </form>
      </div>

      {/* Change Password */}
      <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
        <h2 className="text-lg font-bold">Change Password</h2>
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Current Password</label>
            <input
              type="password"
              value={passwordData.current_password}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  current_password: e.target.value,
                })
              }
              className="w-full mt-1 rounded-lg border border-border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">New Password</label>
            <input
              type="password"
              value={passwordData.new_password}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  new_password: e.target.value,
                })
              }
              className="w-full mt-1 rounded-lg border border-border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Confirm New Password</label>
            <input
              type="password"
              value={passwordData.confirm_password}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  confirm_password: e.target.value,
                })
              }
              className="w-full mt-1 rounded-lg border border-border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <button
            type="submit"
            disabled={passwordLoading}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary-dark transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {passwordLoading ? "Changing..." : "Change Password"}
          </button>
        </form>
      </div>

      {/* Subscription */}
      <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
        <h2 className="text-lg font-bold">Subscription Plan</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map((plan) => (
            <div
              key={plan.plan_id}
              className={`border-2 rounded-lg p-5 ${
                currentPlan === plan.plan_id
                  ? "border-primary bg-primary/5 shadow-lg"
                  : "border-border hover:border-primary/50 transition-smooth"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xl font-bold">{plan.plan_name}</h3>
                <div className="text-right">
                  <span className="text-3xl font-bold">${plan.price}</span>
                  {plan.price > 0 && (
                    <span className="text-sm text-muted-foreground block">/month</span>
                  )}
                </div>
              </div>
              
              {currentPlan === plan.plan_id && (
                <span className="inline-block mb-3 text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full">
                  Current Plan
                </span>
              )}

              {plan.features && plan.features.length > 0 && (
                <ul className="space-y-2 mb-4 min-h-[200px]">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start text-sm">
                      <span className="text-primary mr-2">✓</span>
                      <span className="text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              )}

              <button
                onClick={() => handleUpdateSubscription(plan.plan_id)}
                disabled={subscriptionLoading || currentPlan === plan.plan_id}
                className={`w-full py-2.5 rounded-lg font-medium transition-smooth ${
                  currentPlan === plan.plan_id
                    ? "bg-muted text-muted-foreground cursor-not-allowed"
                    : "bg-primary text-primary-foreground hover:bg-primary-dark"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {subscriptionLoading
                  ? "Updating..."
                  : currentPlan === plan.plan_id
                  ? "Current Plan"
                  : plan.price === 0
                  ? "Continue with Free"
                  : `Switch to ${plan.plan_name}`}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Two-Factor Authentication */}
      <TwoFactorCard />

      {/* Delete Account */}
      <div className="border border-destructive/20 bg-destructive/5 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-destructive mb-2">
          Delete Account
        </h3>
        <p className="text-sm text-destructive/80 mb-4">
          Once you delete your account, there is no going back. Please be
          certain.
        </p>
        <button
          onClick={handleDeleteAccount}
          disabled={deleteLoading}
          className="px-6 py-2.5 bg-destructive text-white rounded-lg hover:opacity-90 font-medium transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {deleteLoading ? "Deleting..." : "Delete Account"}
        </button>
      </div>
    </div>
  );
};

export default AccountSettingsPage;
