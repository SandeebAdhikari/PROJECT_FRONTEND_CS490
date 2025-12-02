"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { staffPortalLogin } from "@/libs/api/staffPortal";

type Props = {
  salonSlug: string;
};

const StaffLoginCard: React.FC<Props> = ({ salonSlug }) => {
  const [staffCode, setStaffCode] = useState("");
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!staffCode.trim() || !pin.trim()) {
      setError("Enter your staff code and PIN.");
      return;
    }

    setLoading(true);
    try {
      // Use staff portal login which stores token and returns dashboard data
      const data = await staffPortalLogin(staffCode.trim(), pin.trim());

      // Token is already stored in localStorage by staffPortalLogin
      // Store staff profile data as well
      if (typeof window !== "undefined") {
        localStorage.setItem("staffUser", JSON.stringify(data.staff));
      }

      setSuccess("Login successful! Redirecting to staff portal…");
      setStaffCode("");
      setPin("");

      // Small delay to ensure token is stored and show success message
      setTimeout(() => {
        // Verify token was stored before redirecting
        const token = localStorage.getItem("staffToken");
        if (token) {
          router.push(`/salon/${salonSlug}/staff/staff-portal`);
        } else {
          setError("Token storage failed. Please try again.");
          setSuccess("");
        }
      }, 300);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-md mx-auto rounded-2xl border border-border bg-card shadow-soft-br p-6 font-inter">
      <div className="mb-4">
        <p className="text-sm uppercase tracking-wide text-color-subtle-foreground font-semibold">
          StyGo Staff
        </p>
        <h1 className="text-2xl font-bold text-color-foreground">
          Sign in to {salonSlug}
        </h1>
        <p className="text-sm text-color-muted mt-1">
          Use your four-digit staff code and PIN to enter the handheld portal.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase text-color-subtle-foreground mb-1">
            Staff Code
          </label>
          <input
            type="text"
            inputMode="numeric"
            maxLength={4}
            className="w-full rounded-lg border border-border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-color-primary"
            placeholder="1234"
            value={staffCode}
            onChange={(e) => setStaffCode(e.target.value.replace(/\D/g, ""))}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase text-color-subtle-foreground mb-1">
            PIN
          </label>
          <input
            type="password"
            inputMode="numeric"
            maxLength={6}
            className="w-full rounded-lg border border-border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-color-primary"
            placeholder="••••••"
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
          />
        </div>

        {error && (
          <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        {success && (
          <p className="text-sm text-green-700 bg-green-100 rounded-lg px-3 py-2">
            {success}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-color-primary text-white font-semibold py-2.5 transition-smooth hover:bg-color-primary-dark disabled:opacity-50"
        >
          {loading ? "Signing in…" : "Enter Portal"}
        </button>
      </form>

      <p className="text-xs text-center text-color-muted mt-4">
        Need to set up your PIN?{" "}
        <Link
          href={`/salon/${salonSlug}/staff/sign-in-code`}
          className="text-color-primary font-semibold"
        >
          Claim your invite
        </Link>
      </p>
    </section>
  );
};

export default StaffLoginCard;
