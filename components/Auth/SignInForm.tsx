"use client";

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormData } from "@/libs/auth/auth";
import { setAuthCookie } from "@/libs/auth/cookies";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { login, verify2FA, User } from "@/libs/api/auth";
import { useRouter } from "next/navigation";
import AuthHeader from "@/components/Auth/AuthHeader";

type ExtendedUser = User & {
  user_role?: string;
  user_id?: string | number;
  phone?: string;
};

const resolveUserRole = (user?: ExtendedUser): string | undefined =>
  user?.role ?? user?.user_role;

const resolveUserId = (user?: ExtendedUser): string | number | undefined =>
  user?.id ?? user?.user_id;

const SignInForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      emailOrPhone: "",
      password: "",
    },
    mode: "onSubmit",
  });

  const onSubmit = async (data: LoginFormData) => {
    console.log("➡️ onSubmit triggered with:", data);
    setError("");
    setLoading(true);
    try {
      const response = await login({
        email: data.emailOrPhone,
        password: data.password,
      });
      console.log("✅ login() resolved in SignInForm:", response);

      if (response.requires2FA) {
        setShowCodeInput(true);
        setMessage(response.message || "Verification code sent");
        setLoading(false);
        return;
      }

      if (response.error) {
        setError(response.error);
        setLoading(false);
        return;
      }

      if (response.token) {
        localStorage.setItem("token", response.token);
        setAuthCookie(response.token);

        const user = response.user as ExtendedUser | undefined;
        if (user) {
          localStorage.setItem("user", JSON.stringify(user));
        }

        const userRole = resolveUserRole(user);
        if (userRole) {
          localStorage.setItem("role", userRole);
        }

        const userId = resolveUserId(user);
        if (typeof userId === "string" || typeof userId === "number") {
          localStorage.setItem("user_id", String(userId));
        }

        const role = userRole?.toLowerCase();

        if (role === "owner" || role === "salon_owner") {
          router.push("/admin/salon-dashboard/overview");
        } else if (role === "staff") {
          router.push("/staff/dashboard");
        } else {
          router.push("/customer");
        }
      }
    } catch (err) {
      console.error("❌ Error during login:", err);
      setError("Login failed. Please try again.");
      setLoading(false);
    }
  };

  const handleCodeVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const tempToken = localStorage.getItem("tempToken");
      if (!tempToken) {
        setError("Session expired. Please login again.");
        setLoading(false);
        return;
      }

      const response = await verify2FA({
        code: verificationCode,
        tempToken: tempToken,
      });

      if (response.error) {
        setError(response.error);
        setLoading(false);
        return;
      }

      if (response.token) {
        localStorage.setItem("token", response.token);
        setAuthCookie(response.token);
        localStorage.removeItem("tempToken");

        const user = response.user as ExtendedUser | undefined;
        if (user) {
          localStorage.setItem("user", JSON.stringify(user));
        }

        const userRole = resolveUserRole(user);
        if (userRole) {
          localStorage.setItem("role", userRole);
        }

        const userId = resolveUserId(user);
        if (typeof userId === "string" || typeof userId === "number") {
          localStorage.setItem("user_id", String(userId));
        }

        const role = userRole?.toLowerCase();
        console.log("Detected role:", role);

        if (role === "owner" || role === "salon_owner") {
          console.log("Redirecting → /admin/salon-dashboard/overview");
          router.push("/admin/salon-dashboard/overview");
        } else if (role === "staff") {
          console.log("Redirecting → /staff/dashboard");
          router.push("/staff/dashboard");
        } else {
          console.log("Redirecting → /customer");
          router.push("/customer");
        }
      }
    } catch (err) {
      console.error("❌ Error during 2FA verification:", err);
      setError("Verification failed. Please try again.");
      setLoading(false);
    }
  };

  if (showCodeInput) {
    return (
      <form
        onSubmit={handleCodeVerification}
        className="my-5 flex flex-col space-y-3 p-6 bg-card rounded-lg shadow w-[436px] sm:w-[672px]"
      >
        <AuthHeader
          title="Verify Your Code"
          subtitle={message || "Enter the verification code sent to your phone"}
        />
        <div className="font-inter">
          <label className="block mb-1 font-semibold text-sm">
            Verification Code *
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="Enter 6-digit code"
              maxLength={6}
              className="w-full border border-muted rounded-lg p-2 pl-10 focus:ring-1 focus:ring-primary outline-none"
              required
            />
          </div>
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-white p-2 rounded-lg hover:bg-primary-dark font-inter cursor-pointer disabled:opacity-50"
        >
          {loading ? "Verifying..." : "Verify Code"}
        </button>
        <button
          type="button"
          onClick={() => {
            setShowCodeInput(false);
            setVerificationCode("");
            setError("");
          }}
          className="w-full text-muted-foreground p-2 rounded-lg hover:bg-muted font-inter cursor-pointer"
        >
          Back to Sign In
        </button>
      </form>
    );
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="my-5 flex flex-col space-y-3 p-6 bg-card rounded-lg shadow w-[436px] sm:w-[672px]"
    >
      <AuthHeader
        title="Welcome Back"
        subtitle="Sign in to your account to continue"
      />
      <div className="font-inter">
        <label className="block mb-1">Email or Phone</label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Controller
            name="emailOrPhone"
            control={form.control}
            defaultValue=""
            render={({ field }) => (
              <input
                {...field}
                placeholder="Enter a Email or Phone "
                className="w-full border border-muted rounded p-2 pl-10 focus:ring-1 focus:ring-primary outline-none"
              />
            )}
          />
        </div>
        {form.formState.errors.emailOrPhone && (
          <p className="text-red-500 text-sm">
            {form.formState.errors.emailOrPhone.message}
          </p>
        )}
      </div>
      <div className="font-inter">
        <label className="block mb-1 font-semibold text-sm">Password *</label>
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
                placeholder="Enter password"
                className="w-full border border-muted rounded-lg p-2 pl-10 focus:ring-1 focus:ring-primary outline-none"
              />
            )}
          />
        </div>
        {form.formState.errors.password && (
          <p className="text-red-500 text-sm">
            {String(form.formState.errors.password.message)}
          </p>
        )}
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-primary text-white p-2 rounded-lg hover:bg-primary-dark font-inter cursor-pointer disabled:opacity-50"
      >
        {loading ? "Signing in..." : "Sign In"}
      </button>
    </form>
  );
};

export default SignInForm;
