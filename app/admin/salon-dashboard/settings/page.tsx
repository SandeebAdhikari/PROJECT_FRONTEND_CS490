"use client";

import React, { useState, useEffect } from "react";
import { enable2FA, disable2FA, get2FAStatus } from "@/libs/api/auth";

const SettingsPage = () => {
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    load2FAStatus();
  }, []);

  const load2FAStatus = async () => {
    const status = await get2FAStatus();
    setIs2FAEnabled(status.twoFactorEnabled);
  };

  const handleToggle2FA = async () => {
    setLoading(true);
    setMessage("");
    setError("");

    if (is2FAEnabled) {
      const result = await disable2FA();
      if (!result.error) {
        setIs2FAEnabled(false);
        setMessage("2FA disabled successfully");
      } else {
        setError("Error: " + result.error);
      }
    } else {
      const result = await enable2FA("sms");
      if (!result.error) {
        setIs2FAEnabled(true);
        setMessage(
          "2FA enabled successfully! You will be asked for a code on your next login."
        );
      } else {
        setError("Error: " + result.error);
      }
    }

    setLoading(false);
  };

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold mb-2">
              Two-Factor Authentication
            </h2>
            <p className="text-gray-600 text-sm">
              Add an extra layer of security to your account
            </p>
          </div>
        </div>

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

        <div className="flex items-center justify-between py-4 border-t">
          <div>
            <p className="font-medium">SMS 2FA</p>
            <p className="text-sm text-gray-500">
              {is2FAEnabled
                ? "Enabled - You will receive verification codes via SMS"
                : "Disabled - Enable to protect your account"}
            </p>
          </div>
          <button
            onClick={handleToggle2FA}
            disabled={loading}
            className={`px-4 py-2 rounded-md font-medium ${
              is2FAEnabled
                ? "bg-red-600 hover:bg-red-700 text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white"
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
  );
};

export default SettingsPage;
