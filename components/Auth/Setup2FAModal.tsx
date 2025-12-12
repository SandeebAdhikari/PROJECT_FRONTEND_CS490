"use client";

import React, { useState, useEffect } from "react";
import { Shield, X } from "lucide-react";
import { enable2FA } from "@/libs/api/auth";
import { getAccountSettings } from "@/libs/api/account";

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
  const [loadingPhone, setLoadingPhone] = useState(false);
  const [error, setError] = useState("");
  const [smsOptIn, setSmsOptIn] = useState(false); 

  // Use userPhone prop if provided
  useEffect(() => {
    if (userPhone) {
      setPhoneNumber(userPhone);
    }
  }, [userPhone]);

  // Fetch phone number from account settings when modal opens (if not provided via props)
  useEffect(() => {
    if (isOpen && !phoneNumber && !userPhone) {
      setLoadingPhone(true);
      getAccountSettings()
        .then((result) => {
          if (result.account?.phone) {
            setPhoneNumber(result.account.phone);
          } else {
            // Fallback to localStorage
            try {
              const storedUser = localStorage.getItem("user");
              if (storedUser) {
                const user = JSON.parse(storedUser);
                if (user.phone) {
                  setPhoneNumber(user.phone);
                }
              }
            } catch (err) {
              console.error("Error loading phone from localStorage:", err);
            }
          }
        })
        .catch((err) => {
          console.error("Error loading phone from account settings:", err);
          // Fallback to localStorage
          try {
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
              const user = JSON.parse(storedUser);
              if (user.phone) {
                setPhoneNumber(user.phone);
              }
            }
          } catch (e) {
            console.error("Error loading phone from localStorage:", e);
          }
        })
        .finally(() => {
          setLoadingPhone(false);
        });
    }
  }, [isOpen, phoneNumber, userPhone]);

  if (!isOpen) return null;

  const handleEnable2FA = async () => {
    if (!phoneNumber) {
      setError("Please enter your phone number");
      return;
    }

    if (!smsOptIn) {
      setError("You must agree to receive SMS messages to enable 2FA");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await enable2FA("sms", phoneNumber);
      if (!result.error) {
        alert(
          "2FA enabled successfully! You'll receive a verification code on your next login."
        );
        localStorage.setItem("2fa_setup_completed", "true");
        onClose();
      } else {
        setError(result.error);
      }
    } catch (err) {
      console.error("2FA setup error:", err);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full p-4 sm:p-6 lg:p-8 animate-in fade-in zoom-in duration-300">
        {/* Close button */}
        <button
          onClick={handleSkip}
          className="absolute top-3 right-3 p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        <div className="grid gap-4 lg:grid-cols-2 lg:gap-6">
          {/* Left column */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-primary/10 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold">
                  Secure Your Account
                </h2>
                <p className="text-gray-600 text-sm">
                  Enable Two-Factor Authentication for an extra layer of
                  security.
                </p>
              </div>
            </div>

            {/* Benefits */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
              <h3 className="font-semibold text-sm mb-3 text-blue-900">
                Why enable 2FA?
              </h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li className="flex items-start gap-2">
                  <svg
                    className="w-5 h-5 text-blue-600 shrink-0 mt-0.5"
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
                    className="w-5 h-5 text-blue-600 shrink-0 mt-0.5"
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
                    className="w-5 h-5 text-blue-600 shrink-0 mt-0.5"
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
          </div>

          {/* Right column */}
          <div className="space-y-4">
            {/* Phone input */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={loadingPhone ? "Loading..." : phoneNumber}
                disabled={loadingPhone}
                readOnly
                placeholder="Enter your phone number"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-700 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-1">
                {phoneNumber
                  ? "Using phone number from your profile. You can change it in Settings."
                  : "No phone number found. Please add one in Account Settings."}
              </p>
            </div>

            {/* SMS Opt-in Checkbox and Disclosure - Required for ClickSend TFN compliance */}
            <div className="p-3 sm:p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={smsOptIn}
                  onChange={(e) => setSmsOptIn(e.target.checked)}
                  className="mt-1 w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <div className="flex-1 text-sm text-gray-700 space-y-2">
                  <p>
                    By providing your phone number and enabling 2FA, you agree
                    to receive SMS messages from <strong>StyGo</strong> for
                    two-factor authentication codes, security alerts, and
                    account notifications.
                  </p>
                  <p className="text-xs text-gray-600">
                    <strong>Message frequency:</strong> Message frequency
                    varies. You may receive 1-5 messages per month for
                    authentication and security purposes.
                  </p>
                  <p className="text-xs text-gray-600">
                    <strong>Message and data rates may apply.</strong> Text{" "}
                    <strong>HELP</strong> for help, <strong>STOP</strong> to
                    unsubscribe.
                  </p>
                  <p className="text-xs text-gray-600">
                    <a
                      href="/terms"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      View our Terms & Conditions
                    </a>{" "}
                    and{" "}
                    <a
                      href="/privacy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Privacy Policy
                    </a>
                    .
                  </p>
                </div>
              </label>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
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
                disabled={loading || !phoneNumber || !smsOptIn}
                className="flex-1 px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Enabling..." : "Enable 2FA"}
              </button>
            </div>

            {/* Additional info */}
            <p className="text-center text-xs text-gray-500">
              You can enable or disable this later in Settings
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Setup2FAModal;
