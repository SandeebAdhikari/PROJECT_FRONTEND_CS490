"use client";

import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema, SignUpFormData } from "@/libs/auth/auth";

import AuthHeader from "./AuthHeader";
import AuthPassword from "./AuthPassword";
import AuthCustomer from "./AuthCustomer";
import AuthOwner from "./AuthOwner";

const SignUpForm = () => {
  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { userType: "customer", agreeToTerms: false },
  });

  const onSubmit = async (data: SignUpFormData) => {
    try {
      const payload = {
        full_name:
          data.userType === "owner"
            ? data.ownerName
            : `${data.firstName} ${data.lastName}`,
        phone:
          data.userType === "owner"
            ? data.businessPhone || ""
            : data.phone || "",
        email: data.userType === "owner" ? data.businessEmail : data.email,
        password: data.password,
        role: data.userType,
      };

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/signup`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const result = await res.json();

      if (!res.ok) {
        alert(result.error || "Failed to sign up");
        return;
      }

      // Clear any old 2FA flags so popup shows on first login
      localStorage.removeItem("2fa_setup_completed");
      localStorage.removeItem("2fa_setup_skipped");
      localStorage.removeItem("2fa_first_prompt_shown");
      localStorage.removeItem("2fa_last_prompt");

      alert("Account created successfully!");
      window.location.href = "/sign-in";
    } catch (error) {
      console.error("Signup failed:", error);
      alert("Server error. Please try again later.");
    }
  };

  const onError = (errors: any) => {
    // Validation errors are shown in the form
  };

  const userType = form.watch("userType");

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit, onError)}
      className="my-5 flex flex-col space-y-3 p-6 bg-card rounded-lg shadow w-[436px] sm:w-[672px]"
    >
      <AuthHeader
        title="Create Account"
        subtitle="Join thousands of beauty enthusiasts"
      />

      <h2 className="mb-1 font-semibold font-inter">I am a</h2>
      <div className="w-full flex gap-2 rounded-lg font-inter">
        <div
          onClick={() => form.setValue("userType", "customer")}
          className={`border w-1/2 rounded-xl p-4 cursor-pointer
      ${
        form.watch("userType") === "customer"
          ? "border-primary bg-primary/5"
          : "border-muted hover:border-faint-foreground"
      }`}
        >
          <h2 className="font-semibold">Customer</h2>
          <p className="text-muted-foreground text-sm">Book appointments</p>
        </div>

        <div
          onClick={() => form.setValue("userType", "owner")}
          className={`border w-1/2 rounded-xl p-4 cursor-pointer
      ${
        form.watch("userType") === "owner"
          ? "border-primary bg-primary/5"
          : "border-muted hover:border-faint-foreground"
      }`}
        >
          <h2 className="font-semibold">Salon Owner</h2>
          <p className="text-muted-foreground text-sm">Manage Salon</p>
        </div>
      </div>

      {userType === "customer" && <AuthCustomer form={form} />}
      {userType === "owner" && <AuthOwner form={form} />}

      <AuthPassword form={form} />

      <div className="flex items-center space-x-2 font-inter text-sm">
        <Controller
          name="agreeToTerms"
          control={form.control}
          render={({ field }) => (
            <div className="flex items-center space-x-2 font-inter text-sm">
              <input
                type="checkbox"
                id="agreeToTerms"
                checked={field.value}
                onChange={(e) => field.onChange(e.target.checked)}
                className="h-4 w-4 cursor-pointer"
              />
              <label
                htmlFor="agreeToTerms"
                className="cursor-pointer select-none"
              >
                I agree to the{" "}
                <span className="text-primary hover:underline hover:font-bold hover:cursor-pointer">
                  Terms & Conditions
                </span>{" "}
                and{" "}
                <span className="text-primary hover:underline hover:font-bold hover:cursor-pointer">
                  Privacy Policy
                </span>
              </label>
            </div>
          )}
        />
      </div>
      {form.formState.errors.agreeToTerms && (
        <p className="text-red-500 text-sm font-inter">
          {form.formState.errors.agreeToTerms.message}
        </p>
      )}

      <button
        type="submit"
        className="w-full bg-primary text-white p-2 rounded-lg hover:bg-primary-dark font-inter cursor-pointer"
      >
        Continue to Business Detail
      </button>
    </form>
  );
};

export default SignUpForm;
