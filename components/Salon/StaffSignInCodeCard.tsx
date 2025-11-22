"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { API_ENDPOINTS } from "@/libs/api/config";

type Props = {
  salonSlug: string;
};

const PIN_LENGTH = 6;

const StaffSignInCodeCard: React.FC<Props> = ({ salonSlug }) => {
  const params = useSearchParams();
  const queryToken = params.get("token") || "";

  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [token, setToken] = useState(queryToken);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    setToken(queryToken);
  }, [queryToken]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!token.trim()) {
      setError("Token missing. Open the email link again or paste the token.");
      return;
    }

    if (pin.length !== PIN_LENGTH || confirmPin.length !== PIN_LENGTH) {
      setError(`PIN must be exactly ${PIN_LENGTH} digits.`);
      return;
    }

    if (pin !== confirmPin) {
      setError("PIN confirmation does not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        API_ENDPOINTS.STAFF.SET_PIN,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: token.trim(), pin }),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Failed to set PIN");
      }
      setSuccess("PIN saved! You can now log in with your staff code.");
      setPin("");
      setConfirmPin("");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to complete PIN setup"
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePinChange = (setter: (value: string) => void) => (value: string) =>
    setter(value.replace(/\D/g, "").slice(0, PIN_LENGTH));

  return (
    <section className="max-w-md mx-auto rounded-2xl border border-border bg-card shadow-soft-br p-6 font-inter">
      <div className="mb-4">
        <p className="text-sm uppercase tracking-wide text-subtle-foreground font-semibold">
          StyGo Staff
        </p>
        <h1 className="text-2xl font-bold text-foreground">
          Activate your staff PIN
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          We emailed you a secure link from stygo.notification@gmail.com. Enter
          a new {PIN_LENGTH}-digit PIN to unlock your portal access.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase text-subtle-foreground mb-1">
            Invitation Token
          </label>
          <input
            type="text"
            className="w-full rounded-lg border border-border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Paste token from your email"
            value={token}
            onChange={(e) => setToken(e.target.value.trim())}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold uppercase text-subtle-foreground mb-1">
              Create PIN
            </label>
            <input
              type="password"
              inputMode="numeric"
              maxLength={PIN_LENGTH}
              className="w-full rounded-lg border border-border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="••••••"
              value={pin}
              onChange={(e) => handlePinChange(setPin)(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase text-subtle-foreground mb-1">
              Confirm PIN
            </label>
            <input
              type="password"
              inputMode="numeric"
              maxLength={PIN_LENGTH}
              className="w-full rounded-lg border border-border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="••••••"
              value={confirmPin}
              onChange={(e) => handlePinChange(setConfirmPin)(e.target.value)}
            />
          </div>
        </div>

        {error && (
          <p className="text-sm text-destructive-foreground bg-destructive/10 rounded-lg px-3 py-2">
            {error}
          </p>
        )}
        {success && (
          <p className="text-sm text-primary-foreground bg-primary/20 rounded-lg px-3 py-2">
            {success}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-primary text-primary-foreground font-semibold py-2.5 transition-smooth hover:bg-primary-dark disabled:opacity-50"
        >
          {loading ? "Saving PIN…" : "Save PIN"}
        </button>
      </form>

      <p className="text-xs text-center text-muted-foreground mt-4">
        Already have a PIN?{" "}
        <Link
          href={`/salon/${salonSlug}/staff/login`}
          className="text-primary font-semibold"
        >
          Go back to login
        </Link>
      </p>
    </section>
  );
};

export default StaffSignInCodeCard;
