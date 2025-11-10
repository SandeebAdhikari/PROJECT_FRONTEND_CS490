"use client";

import React, { useState } from "react";
import { Shield, X } from "lucide-react";
import { enable2FA } from "@/libs/api/auth";

interface Setup2FAModalProps {
  isOpen: boolean;
  onClose: () => void;
  userPhone?: string;
}

const Setup2FAModal: React.FC<Setup2FAModalProps> = ({
  isOpen,
  onClose,
  userPhone = "",
}) => {
  const [phoneNumber, setPhoneNumber] = useState(userPhone);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleEnable2FA = async () => {
    if (!phoneNumber) {
      setError("Please enter your phone number");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await enable2FA("sms", phoneNumber);
      if (!result.error) {
        alert("2FA enabled successfully! You'll receive a verification code on your next login.");
        localStorage.setItem("2fa_setup_completed", "true");
        onClose();
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError("Failed to enable 2FA. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    localStorage.setItem("2fa_setup_skipped", "true");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 animate-in fade-in zoom-in duration-300">
        {/* Close button */}
        <button
          onClick={handleSkip}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Shield className="w-8 h-8 text-primary" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center mb-2">
          Secure Your Account
        </h2>
        <p className="text-center text-gray-600 text-sm mb-6">
          Enable Two-Factor Authentication to add an extra layer of security to your account
        </p>

        {/* Benefits */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-sm mb-3 text-blue-900">
            Why enable 2FA?
          </h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start gap-2">
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
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>Protect your appointments and personal data</span>
            </li>
            <li className="flex items-start gap-2">
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
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>Prevent unauthorized access to your account</span>
            </li>
            <li className="flex items-start gap-2">
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
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>Quick verification via SMS</span>
            </li>
          </ul>
        </div>

        {/* Phone input */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            value={phoneNumber}
            disabled
            className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-700 cursor-not-allowed"
          />
          <p className="text-xs text-gray-500 mt-1">
            Using phone number from your profile. You can change it in Settings.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
            {error}
          </div>
        )}

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleSkip}
            className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            Skip for Now
          </button>
          <button
            onClick={handleEnable2FA}
            disabled={loading || !phoneNumber}
            className="flex-1 px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Enabling..." : "Enable 2FA"}
          </button>
        </div>

        {/* Additional info */}
        <p className="text-center text-xs text-gray-500 mt-4">
          You can enable or disable this later in Settings
        </p>
      </div>
    </div>
  );
};

export default Setup2FAModal;

