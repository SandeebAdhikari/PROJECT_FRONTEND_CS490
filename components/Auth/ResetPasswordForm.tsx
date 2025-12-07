"use client";

import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Lock, Eye, EyeOff } from "lucide-react";
import { resetPassword } from "@/libs/api/auth";
import { useRouter, useSearchParams } from "next/navigation";
import AuthHeader from "@/components/Auth/AuthHeader";
import Link from "next/link";

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

const ResetPasswordForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    mode: "onSubmit",
  });

  useEffect(() => {
    if (!token) {
      setError("Invalid or missing reset token. Please request a new password reset link.");
    }
  }, [token]);

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      setError("Invalid or missing reset token. Please request a new password reset link.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await resetPassword(token, data.password);

      if (response.error) {
        setError(response.error);
      } else {
        setSuccess(true);
        // Redirect to sign-in after 3 seconds
        setTimeout(() => {
          router.push("/sign-in");
        }, 3000);
      }
    } catch (err) {
      console.error("Reset password error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="my-5 flex flex-col space-y-3 p-6 bg-card rounded-lg shadow w-[436px] sm:w-[672px]">
        <AuthHeader
          title="Invalid Reset Link"
          subtitle="The password reset link is invalid or has expired."
        />
        <p className="text-red-500 text-sm">
          {error || "Please request a new password reset link."}
        </p>
        <Link
          href="/forgot-password"
          className="w-full bg-primary text-white p-2 rounded-lg hover:bg-primary-dark font-inter cursor-pointer text-center"
        >
          Request new reset link
        </Link>
        <div className="text-center">
          <Link
            href="/sign-in"
            className="text-sm text-muted-foreground hover:text-primary font-inter"
          >
            Back to sign in
          </Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="my-5 flex flex-col space-y-3 p-6 bg-card rounded-lg shadow w-[436px] sm:w-[672px]">
        <AuthHeader
          title="Password Reset Successful!"
          subtitle="Your password has been reset successfully."
        />
        <p className="text-green-600 text-sm">
          You can now sign in with your new password. Redirecting to sign-in page...
        </p>
        <Link
          href="/sign-in"
          className="w-full bg-primary text-white p-2 rounded-lg hover:bg-primary-dark font-inter cursor-pointer text-center"
        >
          Go to Sign In
        </Link>
      </div>
    );
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="my-5 flex flex-col space-y-3 p-6 bg-card rounded-lg shadow w-[436px] sm:w-[672px]"
    >
      <AuthHeader
        title="Reset your password"
        subtitle="Enter your new password below."
      />

      <div className="font-inter">
        <label className="block mb-1 font-semibold text-sm">
          New Password *
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          {showPassword ? (
            <EyeOff
              onClick={() => setShowPassword(false)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4 cursor-pointer"
            />
          ) : (
            <Eye
              onClick={() => setShowPassword(true)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4 cursor-pointer"
            />
          )}
          <Controller
            name="password"
            control={form.control}
            defaultValue=""
            render={({ field }) => (
              <input
                type={showPassword ? "text" : "password"}
                {...field}
                placeholder="Enter new password (min. 8 characters)"
                className="w-full border border-muted rounded-lg p-2 pl-10 focus:ring-1 focus:ring-primary outline-none"
              />
            )}
          />
        </div>
        {form.formState.errors.password && (
          <p className="text-red-500 text-sm">
            {form.formState.errors.password.message}
          </p>
        )}
      </div>

      <div className="font-inter">
        <label className="block mb-1 font-semibold text-sm">
          Confirm Password *
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          {showConfirmPassword ? (
            <EyeOff
              onClick={() => setShowConfirmPassword(false)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4 cursor-pointer"
            />
          ) : (
            <Eye
              onClick={() => setShowConfirmPassword(true)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4 cursor-pointer"
            />
          )}
          <Controller
            name="confirmPassword"
            control={form.control}
            defaultValue=""
            render={({ field }) => (
              <input
                type={showConfirmPassword ? "text" : "password"}
                {...field}
                placeholder="Confirm new password"
                className="w-full border border-muted rounded-lg p-2 pl-10 focus:ring-1 focus:ring-primary outline-none"
              />
            )}
          />
        </div>
        {form.formState.errors.confirmPassword && (
          <p className="text-red-500 text-sm">
            {form.formState.errors.confirmPassword.message}
          </p>
        )}
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-primary text-white p-2 rounded-lg hover:bg-primary-dark font-inter cursor-pointer disabled:opacity-50"
      >
        {loading ? "Resetting password..." : "Reset password"}
      </button>

      <div className="text-center">
        <Link
          href="/sign-in"
          className="text-sm text-muted-foreground hover:text-primary font-inter"
        >
          Back to sign in
        </Link>
      </div>
    </form>
  );
};

export default ResetPasswordForm;

