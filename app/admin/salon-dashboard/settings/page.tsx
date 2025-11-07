"use client";

import React from "react";
import TwoFactorCard from "@/components/Dashboard/TwoFactAuth";

const SettingsPage = () => {
  return (
    <div className="p-6 sm:p-8 space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>
      <TwoFactorCard />
    </div>
  );
};

export default SettingsPage;
