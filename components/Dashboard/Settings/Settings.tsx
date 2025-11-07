"use client";

import React from "react";
import TwoFactorCard from "@/components/Dashboard/TwoFactAuth";
import Header from "../Header";
import SalonBookingSettings from "./SalonBookingSetting";
import SalonBusinessInformation from "./SalonBusinessInformation";
import SalonBusinessHours from "./SalonBusinessHours";
import SalonNotificationSettings from "./SalonNotificationSetting";
import SaveButton from "./SaveButton";

const Settings = () => {
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
        <SalonBookingSettings />
        <SalonNotificationSettings />
        <div className="flex justify-end mt-6">
          <SaveButton onClick={() => console.log("Settings saved")} />
        </div>
      </div>
    </div>
  );
};

export default Settings;
