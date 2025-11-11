"use client";

import React, { useState } from "react";
import TwoFactorCard from "@/components/Dashboard/TwoFactAuth";
import Header from "../Header";
import SalonBookingSettings from "./SalonBookingSetting";
import SalonBusinessInformation from "./SalonBusinessInformation";
import SalonBusinessHours from "./SalonBusinessHours";
import SalonNotificationSettings from "./SalonNotificationSetting";
import SalonServicesManagement from "./SalonServicesManagement";
import SaveButton from "./SaveButton";
import { deleteAccount } from "@/libs/api/auth";
import { useRouter } from "next/navigation";

const Settings = () => {
  const router = useRouter();
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleDeleteAccount = async () => {
    const password = prompt("Please enter your password to confirm account deletion:");
    
    if (!password) {
      return;
    }

    const confirmDelete = confirm(
      "Are you ABSOLUTELY sure? This will permanently delete your salon account, all appointments, and customer data. This action cannot be undone."
    );

    if (!confirmDelete) {
      return;
    }

    setDeleteLoading(true);

    try {
      const result = await deleteAccount(password);
      
      if (result.error) {
        alert(result.error);
        setDeleteLoading(false);
        return;
      }

      alert("Account deleted successfully. You will be redirected to the home page.");
      router.push("/");
    } catch (error) {
      alert("Failed to delete account. Please try again.");
      setDeleteLoading(false);
    }
  };
  return (
    <div className="font-inter space-y-6 ">
      <Header
        title="Settings"
        subtitle="Manage system preferences and security"
        showActions={false}
      />
      <TwoFactorCard />
      <div className="space-y-6 sm:grid sm:grid-cols-2 sm:gap-4">
        <SalonBusinessInformation />
        <SalonBusinessHours />
        <SalonServicesManagement />
        <SalonBookingSettings />
        <SalonNotificationSettings />
      </div>
      
      <div className="border border-red-200 bg-red-50 rounded-lg p-6 mt-8">
        <h3 className="text-lg font-semibold text-red-800 mb-2">Delete Account</h3>
        <p className="text-sm text-red-600 mb-4">
          Once you delete your account, there is no going back. Please be certain.
        </p>
        <button
          onClick={handleDeleteAccount}
          disabled={deleteLoading}
          className="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {deleteLoading ? "Deleting..." : "Delete Account"}
        </button>
      </div>

      <div className="flex justify-end mt-6">
        <SaveButton onClick={() => console.log("Settings saved")} />
      </div>
    </div>
  );
};

export default Settings;
