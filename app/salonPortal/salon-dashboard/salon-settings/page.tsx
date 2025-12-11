"use client";

import React, { useRef, useState } from "react";
import Header from "@/components/Dashboard/Header";
import SalonBookingSettings from "@/components/Dashboard/Settings/SalonBookingSetting";
import SalonBusinessInformation from "@/components/Dashboard/Settings/SalonBusinessInformation";
import SalonBusinessHours from "@/components/Dashboard/Settings/SalonBusinessHours";
import SalonNotificationSettings from "@/components/Dashboard/Settings/SalonNotificationSetting";
import SalonServicesManagement from "@/components/Dashboard/Settings/SalonServicesManagement";
import SalonProductsManagement from "@/components/Dashboard/Settings/SalonProductsManagement";
import SalonAmenitiesManagement from "@/components/Dashboard/Settings/SalonAmenitiesManagement";
import SalonLoyaltySettings from "@/components/Dashboard/Settings/SalonLoyaltySettings";
import SaveButton from "@/components/Dashboard/Settings/SaveButton";

const SalonSettingsPage = () => {
  const businessInfoRef = useRef<{ save: () => Promise<void> }>(null);
  const businessHoursRef = useRef<{ save: () => Promise<void> }>(null);
  const amenitiesRef = useRef<{ save: () => Promise<void> }>(null);
  const bookingRef = useRef<{ save: () => Promise<void> }>(null);
  const notificationsRef = useRef<{ save: () => Promise<void> }>(null);
  const loyaltyRef = useRef<{ save: () => Promise<void> }>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSaveAll = async () => {
    setSaving(true);
    setMessage(null);

    try {
      const savePromises = [
        { name: "Business Information", promise: businessInfoRef.current?.save() },
        { name: "Business Hours", promise: businessHoursRef.current?.save() },
        { name: "Amenities", promise: amenitiesRef.current?.save() },
        { name: "Booking Settings", promise: bookingRef.current?.save() },
        { name: "Notification Settings", promise: notificationsRef.current?.save() },
        { name: "Loyalty Settings", promise: loyaltyRef.current?.save() },
      ].filter(item => item.promise !== undefined && item.promise !== null);

      const results = await Promise.allSettled(
        savePromises.map(item => item.promise!)
      );

      const failed = results
        .map((result, index) => ({ result, name: savePromises[index].name }))
        .filter(({ result }) => result.status === "rejected");

      if (failed.length === 0) {
        const successMsg = { 
          type: "success" as const, 
          text: "All settings saved successfully!" 
        };
        setMessage(successMsg);
        setTimeout(() => setMessage(null), 3000);
      } else {
        const failedNames = failed.map(f => f.name).join(", ");
        const errorMsg = { 
          type: "error" as const, 
          text: `Failed to save: ${failedNames}. Please check and try again.` 
        };
        setMessage(errorMsg);
        setTimeout(() => setMessage(null), 5000);
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      const errorMsg = { 
        type: "error" as const, 
        text: `Failed to save settings: ${errorMessage}` 
      };
      setMessage(errorMsg);
      setTimeout(() => setMessage(null), 5000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="font-inter space-y-6 p-6 sm:p-8">
      <Header
        title="Salon Settings"
        subtitle="Manage your salon business information and preferences"
        showActions={false}
      />

      {message && (
        <div
          className={`p-4 rounded-lg text-sm font-medium shadow-sm border ${
            message.type === "success"
              ? "bg-green-50 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
              : "bg-red-50 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800"
          } transition-all duration-300`}
        >
          <div className="flex items-center gap-2">
            {message.type === "success" ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            )}
            <span>{message.text}</span>
          </div>
        </div>
      )}

      <div className="space-y-6 sm:grid sm:grid-cols-2 sm:gap-4">
        <SalonBusinessInformation ref={businessInfoRef} suppressMessages={true} />
        <SalonBusinessHours ref={businessHoursRef} suppressMessages={true} />
        <SalonServicesManagement />
        <SalonProductsManagement />
        <SalonAmenitiesManagement ref={amenitiesRef} suppressMessages={true} />
        <SalonBookingSettings ref={bookingRef} suppressMessages={true} />
        <SalonNotificationSettings ref={notificationsRef} suppressMessages={true} />
        <SalonLoyaltySettings ref={loyaltyRef} suppressMessages={true} />
      </div>

      <div className="flex justify-end mt-6">
        <SaveButton
          onClick={handleSaveAll}
          label={saving ? "Saving..." : "Save All Settings"}
        />
      </div>
    </div>
  );
};

export default SalonSettingsPage;
