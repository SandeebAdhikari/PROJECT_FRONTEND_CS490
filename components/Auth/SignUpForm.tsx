"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema, SignUpFormData } from "@/libs/auth";

import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  ArrowLeft,
  Scissors,
  Phone,
  MapPin,
  Building,
  Upload,
  Facebook,
  Chrome,
} from "lucide-react";

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
      className="my-5 flex flex-col space-y-3 p-6 bg-card rounded-lg shadow w-[436px] sm:w-[672px]"
    >
      <button className="flex justify-center items-center gap-2 text-muted-foreground font-inter cursor-pointer hover:text-foreground mb-6">
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </button>

      <div className="flex flex-col items-center">
        <div className="flex items-center justify-center w-[48px] h-[48px] rounded-xl bg-primary">
          <Scissors className="w-6 h-6 text-primary-foreground" />
        </div>
        <h2 className="text-2xl mt-[16px] font-bold text-foreground">
          SalonBooker
        </h2>
      </div>

      <div className="mt-10 flex flex-col items-center gap-2">
        <h2 className="text-2xl font-bold text-foreground">Create Account</h2>
        <p className="text-sm text-muted-foreground font-inter">
          Join thousands of beauty enthusiasts
        </p>
      </div>
      <div className="flex flex-col items-center font-inter font-bold">
        <button className="mt-4 flex gap-4 items-center justify-center shadow-medium p-3 w-full rounded-xl hover:bg-accent cursor-pointer">
          <Chrome className="w-4 h-4" />
          <span> Continue with Google</span>
        </button>
        <button className="mt-4 flex gap-4 items-center justify-center shadow-medium p-3 w-full rounded-xl hover:bg-accent cursor-pointer">
          <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.1 22C7.79 22.05 6.8 20.68 5.96 19.47C4.25 17 2.94 12.45 4.7 9.39C5.57 7.87 7.13 6.91 8.82 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z" />
          </svg>
          Continue with Apple
        </button>
        <button className="mt-4 flex gap-4 items-center justify-center shadow-medium p-3 w-full rounded-xl hover:bg-accent cursor-pointer">
          <Facebook className="w-4 h-4" />
          <span> Continue with Facebook</span>
        </button>
      </div>

      <div className="flex items-center gap-2 w-full">
        <hr className="flex-grow  border-border" />
        <span className="text-xs font-inter text-muted-foreground ">
          OR CONTINUE WITH EMAIL
        </span>
        <hr className="flex-grow border-border" />
      </div>

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

      {userType === "customer" && (
        <div className="font-inter space-y-2">
          <div className="flex gap-3">
            <div className="w-1/2">
              <label className="block mb-1 font-semibold text-sm">
                First Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <input
                  {...form.register("firstName")}
                  placeholder="First name"
                  className="w-full border border-muted rounded-lg p-2 pl-10"
                />
              </div>
              {form.formState.errors.firstName && (
                <p className="text-red-500 text-sm">
                  {form.formState.errors.firstName.message}
                </p>
              )}
            </div>

            <div className="w-1/2">
              <label className="block mb-1 font-semibold text-sm">
                Last Name *
              </label>
              <input
                {...form.register("lastName")}
                placeholder="Last name"
                className="w-full border border-muted -muted rounded-lg p-2"
              />
              {form.formState.errors.lastName && (
                <p className="text-red-500 text-sm">
                  {form.formState.errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block mb-1 font-semibold text-sm">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input
                type="email"
                {...form.register("email")}
                placeholder="Enter your email"
                className="w-full border border-muted  rounded-lg p-2 pl-10"
              />
            </div>
            {form.formState.errors.email && (
              <p className="text-red-500 text-sm">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-1 font-semibold text-sm">
              Phone Number *
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input
                type="tel"
                {...form.register("phone")}
                placeholder="Enter your phone number"
                className="w-full border border-muted  rounded-lg p-2 pl-10"
              />
            </div>
            {form.formState.errors.phone && (
              <p className="text-red-500 text-sm">
                {form.formState.errors.phone.message}
              </p>
            )}
          </div>

          <div className="flex gap-3">
            <div className="w-1/2 ">
              <label
                htmlFor="gender"
                className="block mb-1 font-semibold text-sm"
              >
                Gender (Optional)
              </label>

              <select
                id="gender"
                className="w-full border border-muted  rounded-lg p-2"
                {...form.register("gender")}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="prefer_not_to_say">Prefer not to say</option>
              </select>
            </div>
            <div className="w-1/2 ">
              <label className="block mb-1 font-semibold text-sm">
                Zip Code (Optional)
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <input
                  type="tel"
                  {...form.register("zipcode")}
                  placeholder="12345"
                  className="w-full border border-muted  rounded-lg p-2 pl-10"
                />
              </div>
              {form.formState.errors.phone && (
                <p className="text-red-500 text-sm">
                  {form.formState.errors.phone.message}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {userType === "owner" && (
        <div className="font-inter space-y-2">
          <div>
            <label className="block mb-1 font-semibold text-sm">
              Owner Name *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input
                {...form.register("ownerName")}
                placeholder="Enter owner name"
                className="w-full border border-muted  rounded-lg p-2 pl-10"
              />
            </div>
            {form.formState.errors.ownerName && (
              <p className="text-red-500 text-sm">
                {form.formState.errors.ownerName.message}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-1 font-semibold text-sm">
              Business Name *
            </label>
            <div className="relative">
              <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input
                {...form.register("businessName")}
                placeholder="Enter busineess name"
                className="w-full border border-muted  rounded-lg p-2 pl-10"
              />
            </div>
            {form.formState.errors.businessName && (
              <p className="text-red-500 text-sm">
                {form.formState.errors.businessName.message}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-1 font-semibold text-sm">
              Business Email *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input
                type="email"
                {...form.register("businessEmail")}
                placeholder="business@example.com"
                className="w-full border border-muted  rounded-lg p-2 pl-10"
              />
            </div>
            {form.formState.errors.businessEmail && (
              <p className="text-red-500 text-sm">
                {form.formState.errors.businessEmail.message}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-1 font-semibold text-sm">
              Business Phone *
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input
                type="tel"
                {...form.register("businessPhone")}
                placeholder="Enter business phone"
                className="w-full border border-muted  rounded-lg p-2 pl-10"
              />
            </div>
            {form.formState.errors.businessPhone && (
              <p className="text-red-500 text-sm">
                {form.formState.errors.businessPhone.message}
              </p>
            )}
          </div>
        </div>
      )}

      <div className="font-inter">
        <label className="block mb-1 font-semibold text-sm">Password *</label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <input
            type="password"
            {...form.register("password")}
            placeholder="Enter password"
            className="w-full border border-muted  rounded-lg p-2 pl-10"
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
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <input
            type="password"
            {...form.register("confirmPassword")}
            placeholder="Confirm password"
            className="w-full border border-muted  rounded-lg p-2 pl-10"
          />
        </div>
        {form.formState.errors.confirmPassword && (
          <p className="text-red-500 text-sm">
            {form.formState.errors.confirmPassword.message}
          </p>
        )}
      </div>

      <div className="flex items-center space-x-2 font-inter text-sm">
        <input
          type="radio"
          {...form.register("agreeToTerms")}
          className="h-4 w-4"
        />
        <label>
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
