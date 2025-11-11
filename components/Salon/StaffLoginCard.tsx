"use client";

import React, { useState } from "react";
import Link from "next/link";

type Props = {
  salonSlug: string;
};

const StaffLoginCard: React.FC<Props> = ({ salonSlug }) => {
  const [staffCode, setStaffCode] = useState("");
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/staff/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            staffCode: staffCode.trim(),
            pin: pin.trim(),
          }),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Invalid staff code or PIN");
      }
      setSuccess("Login successful! Staff portal access coming soon.");
      setStaffCode("");
      setPin("");
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
          <p className="text-sm text-emerald-600 bg-emerald-100 rounded-lg px-3 py-2">
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
