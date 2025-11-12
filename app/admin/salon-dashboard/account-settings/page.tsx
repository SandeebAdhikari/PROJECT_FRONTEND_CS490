"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Dashboard/Header";
import TwoFactorCard from "@/components/Dashboard/TwoFactAuth";
import { deleteAccount } from "@/libs/api/auth";

const AccountSettingsPage = () => {
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
    <div className="font-inter space-y-6 p-6 sm:p-8">
      <Header
        title="Account Settings"
        subtitle="Manage your account security and preferences"
        showActions={false}
      />
      
      <TwoFactorCard />
      
      <div className="border border-destructive/20 bg-destructive/5 rounded-2xl p-6 mt-8">
        <h3 className="text-lg font-semibold text-destructive mb-2">Delete Account</h3>
        <p className="text-sm text-destructive/80 mb-4">
          Once you delete your account, there is no going back. Please be certain.
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
