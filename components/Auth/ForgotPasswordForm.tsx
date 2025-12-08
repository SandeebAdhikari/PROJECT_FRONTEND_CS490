"use client";

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail } from "lucide-react";
import { forgotPassword } from "@/libs/api/auth";
import { useRouter } from "next/navigation";
import AuthHeader from "@/components/Auth/AuthHeader";
import Link from "next/link";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

const ForgotPasswordForm = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const _router = useRouter();

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
    mode: "onSubmit",
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const response = await forgotPassword(data.email);

      if (response.error) {
        setError(response.error);
      } else {
        setMessage(
          response.message ||
            "If an account with that email exists, a password reset link has been sent."
        );
      }
    } catch (err) {
      console.error("Forgot password error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="my-5 flex flex-col space-y-3 p-6 bg-card rounded-lg shadow w-[436px] sm:w-[672px]"
    >
      <AuthHeader
        title="Forgot your password?"
        subtitle="Enter your email address and we'll send you a link to reset your password."
      />

      <div className="font-inter">
        <label className="block mb-1">Email *</label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Controller
            name="email"
            control={form.control}
            defaultValue=""
            render={({ field }) => (
              <input
                {...field}
                type="email"
                placeholder="Enter your email"
                className="w-full border border-muted rounded p-2 pl-10 focus:ring-1 focus:ring-primary outline-none"
              />
            )}
          />
        </div>
        {form.formState.errors.email && (
          <p className="text-red-500 text-sm">
            {form.formState.errors.email.message}
          </p>
        )}
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}
      {message && <p className="text-green-600 text-sm">{message}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-primary text-white p-2 rounded-lg hover:bg-primary-dark font-inter cursor-pointer disabled:opacity-50"
      >
        {loading ? "Sending..." : "Send reset link"}
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

export default ForgotPasswordForm;

