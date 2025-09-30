"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormData } from "@/libs/auth";

export const SignInForm: React.FC = () => {
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { emailOrPhone: "", password: "" },
  });

  const onSubmit = (data: LoginFormData) => {
    console.log("Sign-in submitted:", data);
    // TODO: integrate with backend API
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="max-w-md mx-auto space-y-6 p-6 border rounded-lg shadow"
    >
      <div>
        <label className="block mb-1">Email or Phone</label>
        <input
          {...form.register("emailOrPhone")}
          placeholder="you@example.com or +1 555-555-5555"
          className="w-full border rounded p-2"
        />
        {form.formState.errors.emailOrPhone && (
          <p className="text-red-500 text-sm">
            {form.formState.errors.emailOrPhone.message}
          </p>
        )}
      </div>

      <div>
        <label className="block mb-1">Password</label>
        <input
          type="password"
          {...form.register("password")}
          placeholder="********"
          className="w-full border rounded p-2"
        />
        {form.formState.errors.password && (
          <p className="text-red-500 text-sm">
            {form.formState.errors.password.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
      >
        Sign In
      </button>
    </form>
  );
};
