"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Eye, EyeOff, Loader2, CheckCircle2 } from "lucide-react";
import { setCustomerPassword } from "@/libs/api/auth";
import { setAuthCookie } from "@/libs/auth/cookies";

const MIN_PASSWORD_LENGTH = 8;

function SetupPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const next = searchParams.get("next") || "/customer/appointments";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isTokenMissing = useMemo(() => !token, [token]);

  useEffect(() => {
    setError("");
  }, [password, confirmPassword]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isTokenMissing) return;

    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    const result = await setCustomerPassword({ token, password });
    setLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    if (result.token) {
      setAuthCookie(result.token);
    }

    setSuccess("Password set! Redirecting you now...");
    setTimeout(() => {
      router.push(next || "/customer/appointments");
    }, 600);
  };

  if (isTokenMissing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted px-4">
        <div className="max-w-md w-full bg-card border border-border rounded-xl shadow p-6 space-y-4">
          <div className="flex items-center gap-2 text-destructive">
            <Lock className="w-5 h-5" />
            <p className="font-semibold">Invalid link</p>
          </div>
          <p className="text-muted-foreground">
            This password setup link is missing or invalid. Please use the link
            from your email or request a new one.
          </p>
          <button
            onClick={() => router.push("/sign-in")}
            className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary-dark transition-colors"
          >
            Go to Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted px-4">
      <form
        onSubmit={handleSubmit}
        className="max-w-md w-full bg-card border border-border rounded-xl shadow p-6 space-y-4"
      >
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold text-foreground">
            Set Your Password
          </h1>
          <p className="text-muted-foreground text-sm">
            Create a password to access your StyGo customer portal.
          </p>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground">
            New Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-border rounded-lg pl-10 pr-10 py-2 focus:outline-none focus:ring-1 focus:ring-primary bg-background text-foreground"
              placeholder="Enter a new password"
              required
              minLength={MIN_PASSWORD_LENGTH}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
          <p className="text-xs text-muted-foreground">
            Minimum {MIN_PASSWORD_LENGTH} characters.
          </p>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground">
            Confirm Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input
              type={showConfirm ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border border-border rounded-lg pl-10 pr-10 py-2 focus:outline-none focus:ring-1 focus:ring-primary bg-background text-foreground"
              placeholder="Re-enter your password"
              required
              minLength={MIN_PASSWORD_LENGTH}
            />
            <button
              type="button"
              onClick={() => setShowConfirm((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showConfirm ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}
        {success && (
          <div className="flex items-center gap-2 text-emerald-600 text-sm">
            <CheckCircle2 className="w-4 h-4" />
            <span>{success}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary-dark transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {loading ? "Saving..." : "Set Password"}
        </button>

        <button
          type="button"
          onClick={() => router.push("/sign-in")}
          className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Back to sign in
        </button>
      </form>
    </div>
  );
}

export default function SetupPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-muted px-4">
          <div className="max-w-md w-full bg-card border border-border rounded-xl shadow p-6 space-y-4 text-center">
            <div className="mx-auto w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      }
    >
      <SetupPasswordContent />
    </Suspense>
  );
}
