"use client";

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormData } from "@/libs/auth/auth";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { login, verify2FA } from "@/libs/api/auth";
import { useRouter } from "next/navigation";

import AuthHeader from "@/components/Auth/AuthHeader";

const SignInForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
    console.log("Sign-in submitted:", data);
    setError("");
    setLoading(true);

    try {
      const response = await login({
        email: data.emailOrPhone,
        password: data.password,
      });

      // Check if 2FA is required
      if (response.requires2FA) {
        setShowCodeInput(true);
        setEmail(data.emailOrPhone);
        setPassword(data.password);
        setMessage(response.message || "Verification code sent to your phone");
        setLoading(false);
        return;
      }

      // Normal login
      if (response.error) {
        setError(response.error);
        setLoading(false);
        return;
      }

      if (response.token) {
        // Successful login
        console.log("Login successful");
        
        // Redirect based on role
        if (response.user?.role === 'owner' || response.user?.role === 'salon_owner') {
          router.push("/admin/salon-dashboard/overview");
        } else {
          router.push("/customer");
        }
      }
    } catch (err) {
      setError("Login failed. Please try again.");
      setLoading(false);
    }
  };

  const handleCodeVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const tempToken = localStorage.getItem('tempToken');
      if (!tempToken) {
        setError('Session expired. Please login again.');
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
        // Successful verification and login
        console.log("2FA verification successful");
        localStorage.removeItem('tempToken'); // Clean up temp token
        
        // Redirect based on role
        if (response.user?.role === 'owner' || response.user?.role === 'salon_owner') {
          router.push("/admin/salon-dashboard/overview");
        } else {
          router.push("/customer");
        }
      }
    } catch (err) {
      setError("Verification failed. Please try again.");
      setLoading(false);
    }
  };

  // Show 2FA code input if verification is required
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

  // Normal login form
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
          <input
            {...form.register("emailOrPhone")}
            placeholder="Enter a Email or Phone "
            className="w-full border border-muted rounded p-2 pl-10 focus:ring-1 focus:ring-primary outline-none"
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
