"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormData } from "@/libs/auth/auth";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";

import AuthHeader from "@/components/Auth/AuthHeader";

const SignInForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { emailOrPhone: "", password: "" },
  });

  const onSubmit = (data: LoginFormData) => {
    console.log("Sign-in submitted:", data);
    // TODO: integrate with backend API--> later
  };

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
            className="w-full border border-muted rounded p-2 pl-10"
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
          <input
            type={showPassword ? "text" : "password"}
            {...form.register("password")}
            placeholder="Enter password"
            className="w-full border border-muted rounded-lg p-2 pl-10"
          />
        </div>
        {form.formState.errors.password && (
          <p className="text-red-500 text-sm">
            {String(form.formState.errors.password.message)}
          </p>
        )}
      </div>

      <button
        type="submit"
        className="w-full bg-primary text-white p-2 rounded-lg hover:bg-primary-dark font-inter cursor-pointer"
      >
        Sign In
      </button>
    </form>
  );
};

export default SignInForm;
