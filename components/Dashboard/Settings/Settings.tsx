"use client";

import React from "react";
import TwoFactorCard from "@/components/Dashboard/TwoFactAuth";
import Header from "../Header";

const Settings = () => {
  return (
    <div className="space-y-6 font-inter">
      <Header
        title="Settings"
        subtitle="Manage system preferences and security"
        showActions={false}
      />

      <TwoFactorCard />
    </div>
  );
};

export default Settings;
