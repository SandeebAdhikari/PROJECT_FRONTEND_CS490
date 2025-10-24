"use client";

import { User, Mail, Phone, MapPin } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { SignUpFormData } from "@/libs/auth/auth";

type AuthCustomerProps = {
  form: UseFormReturn<SignUpFormData>;
};

const AuthCustomer = ({ form }: AuthCustomerProps) => {
  return (
    <div className="font-inter space-y-2">
      <div className="flex gap-3">
        <div className="w-1/2">
          <label className="block mb-1 font-semibold text-sm">
            First Name *
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
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
            className="w-full border border-muted rounded-lg p-2"
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
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <input
            type="email"
            {...form.register("email")}
            placeholder="Enter your email"
            className="w-full border border-muted rounded-lg p-2 pl-10"
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
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <input
            type="tel"
            {...form.register("phone")}
            placeholder="Enter your phone number"
            className="w-full border border-muted rounded-lg p-2 pl-10"
          />
        </div>
        {form.formState.errors.phone && (
          <p className="text-red-500 text-sm">
            {form.formState.errors.phone.message}
          </p>
        )}
      </div>

      <div className="flex gap-3">
        <div className="w-1/2">
          <label className="block mb-1 font-semibold text-sm">
            Gender (Optional)
          </label>
          <select
            {...form.register("gender")}
            className="w-full border border-muted rounded-lg p-2"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="prefer_not_to_say">Prefer not to say</option>
          </select>
        </div>
        <div className="w-1/2">
          <label className="block mb-1 font-semibold text-sm">
            Zip Code (Optional)
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input
              type="tel"
              {...form.register("zipcode")}
              placeholder="12345"
              className="w-full border border-muted rounded-lg p-2 pl-10"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthCustomer;
