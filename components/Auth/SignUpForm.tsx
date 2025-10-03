"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema, SignUpFormData } from "@/libs/auth";

import { ArrowLeft, Scissors } from "lucide-react";

export const SignUpForm: React.FC = () => {
  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { userType: "customer", agreeToTerms: false },
  });

  const onSubmit = (data: SignUpFormData) => {
    console.log("Sign-up submitted:", data);
    // TODO: integrate with backend API
  };

  const userType = form.watch("userType");

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="my-5 flex flex-col space-y-3 p-6 bg-white/50 rounded-lg shadow  w-[436px] sm:w-[672px]"
    >
      <button className="flex justify-center items-center gap-2  text-[#737373] font-inter cursor-pointer hover:text-[#171717]">
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </button>

      <div className="flex flex-col items-center ">
        <div className="flex items-center justify-center w-[48px] h-[48px] rounded-xl bg-[#19C98D]">
          <Scissors className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-2xl mt-[16px] font-bold">SalonBooker</h2>
      </div>
      <div className="mt-10 flex flex-col items-center">
        <h2 className="">Create Account</h2>
      </div>
      {/* User Type */}
      <div>
        <label className="block mb-1 font-medium">User Type</label>
        <select
          {...form.register("userType")}
          className="w-full border rounded p-2"
        >
          <option value="customer">Customer</option>
          <option value="owner">Salon Owner</option>
        </select>
      </div>

      {/* Customer Fields */}
      {userType === "customer" && (
        <>
          <div>
            <label className="block mb-1">First Name</label>
            <input
              {...form.register("firstName")}
              placeholder="First name"
              className="w-full border rounded p-2"
            />
            {form.formState.errors.firstName && (
              <p className="text-red-500 text-sm">
                {form.formState.errors.firstName.message}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-1">Last Name</label>
            <input
              {...form.register("lastName")}
              placeholder="Last name"
              className="w-full border rounded p-2"
            />
            {form.formState.errors.lastName && (
              <p className="text-red-500 text-sm">
                {form.formState.errors.lastName.message}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-1">Email</label>
            <input
              type="email"
              {...form.register("email")}
              placeholder="you@example.com"
              className="w-full border rounded p-2"
            />
            {form.formState.errors.email && (
              <p className="text-red-500 text-sm">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-1">Phone</label>
            <input
              type="tel"
              {...form.register("phone")}
              placeholder="+1 555-555-5555"
              className="w-full border rounded p-2"
            />
            {form.formState.errors.phone && (
              <p className="text-red-500 text-sm">
                {form.formState.errors.phone.message}
              </p>
            )}
          </div>
        </>
      )}

      {/* Owner Fields */}
      {userType === "owner" && (
        <>
          <div>
            <label className="block mb-1">Owner Name</label>
            <input
              {...form.register("ownerName")}
              placeholder="John Doe"
              className="w-full border rounded p-2"
            />
            {form.formState.errors.ownerName && (
              <p className="text-red-500 text-sm">
                {form.formState.errors.ownerName.message}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-1">Business Name</label>
            <input
              {...form.register("businessName")}
              placeholder="Salon Luxe"
              className="w-full border rounded p-2"
            />
            {form.formState.errors.businessName && (
              <p className="text-red-500 text-sm">
                {form.formState.errors.businessName.message}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-1">Business Email</label>
            <input
              type="email"
              {...form.register("businessEmail")}
              placeholder="salon@example.com"
              className="w-full border rounded p-2"
            />
            {form.formState.errors.businessEmail && (
              <p className="text-red-500 text-sm">
                {form.formState.errors.businessEmail.message}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-1">Business Phone</label>
            <input
              type="tel"
              {...form.register("businessPhone")}
              placeholder="+1 555-555-5555"
              className="w-full border rounded p-2"
            />
            {form.formState.errors.businessPhone && (
              <p className="text-red-500 text-sm">
                {form.formState.errors.businessPhone.message}
              </p>
            )}
          </div>
        </>
      )}

      {/* Common Fields */}
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

      <div>
        <label className="block mb-1">Confirm Password</label>
        <input
          type="password"
          {...form.register("confirmPassword")}
          placeholder="********"
          className="w-full border rounded p-2"
        />
        {form.formState.errors.confirmPassword && (
          <p className="text-red-500 text-sm">
            {form.formState.errors.confirmPassword.message}
          </p>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          {...form.register("agreeToTerms")}
          className="h-4 w-4"
        />
        <label>I agree to the Terms & Conditions</label>
      </div>
      {form.formState.errors.agreeToTerms && (
        <p className="text-red-500 text-sm">
          {form.formState.errors.agreeToTerms.message}
        </p>
      )}

      <button
        type="submit"
        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
      >
        Sign Up
      </button>
    </form>
  );
};
