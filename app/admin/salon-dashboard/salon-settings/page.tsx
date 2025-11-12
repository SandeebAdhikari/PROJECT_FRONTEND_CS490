"use client";

import React from "react";
import Header from "@/components/Dashboard/Header";
import SalonBookingSettings from "@/components/Dashboard/Settings/SalonBookingSetting";
import SalonBusinessInformation from "@/components/Dashboard/Settings/SalonBusinessInformation";
import SalonBusinessHours from "@/components/Dashboard/Settings/SalonBusinessHours";
import SalonNotificationSettings from "@/components/Dashboard/Settings/SalonNotificationSetting";
import SalonServicesManagement from "@/components/Dashboard/Settings/SalonServicesManagement";
import SaveButton from "@/components/Dashboard/Settings/SaveButton";

const SalonSettingsPage = () => {
  return (
    <div className="font-inter space-y-6 p-6 sm:p-8">
      <Header
        title="Salon Settings"
        subtitle="Manage your salon business information and preferences"
        showActions={false}
      />
      <div className="space-y-6 sm:grid sm:grid-cols-2 sm:gap-4">
        <SalonBusinessInformation />
        <SalonBusinessHours />
        <SalonServicesManagement />
        <SalonBookingSettings />
        <SalonNotificationSettings />
      </div>

      <div className="flex justify-end mt-6">
        <SaveButton onClick={() => console.log("Settings saved")} />
      </div>
    </div>
  );
};

export default SalonSettingsPage;
