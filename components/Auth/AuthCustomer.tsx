"use client";

import { User, Mail, Phone, MapPin } from "lucide-react";
import { FieldErrors, UseFormReturn } from "react-hook-form";
import { SignUpFormData } from "@/libs/auth/auth";

type AuthCustomerProps = {
  form: UseFormReturn<SignUpFormData>;
};

type CustomerFormValues = Extract<SignUpFormData, { userType: "customer" }>;

const AuthCustomer = ({ form }: AuthCustomerProps) => {
  const customerRegister =
    form.register as UseFormReturn<CustomerFormValues>["register"];
  const customerErrors = form.formState
    .errors as FieldErrors<CustomerFormValues>;

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
              {...customerRegister("firstName")}
              placeholder="First name"
              className="w-full border border-muted rounded-lg p-2 pl-10 focus:ring-1 focus:ring-primary outline-none"
            />
          </div>
          {customerErrors.firstName && (
            <p className="text-red-500 text-sm">
              {customerErrors.firstName.message}
            </p>
          )}
        </div>

        <div className="w-1/2">
          <label className="block mb-1 font-semibold text-sm">
            Last Name *
          </label>
          <input
            {...customerRegister("lastName")}
            placeholder="Last name"
            className="w-full border border-muted rounded-lg p-2 focus:ring-1 focus:ring-primary outline-none"
          />
          {customerErrors.lastName && (
            <p className="text-red-500 text-sm">
              {customerErrors.lastName.message}
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
            {...customerRegister("email")}
            placeholder="Enter your email"
            className="w-full border border-muted rounded-lg p-2 pl-10 focus:ring-1 focus:ring-primary outline-none"
          />
        </div>
        {customerErrors.email && (
          <p className="text-red-500 text-sm">{customerErrors.email.message}</p>
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
            {...customerRegister("phone")}
            placeholder="Enter your phone number"
            className="w-full border border-muted rounded-lg p-2 pl-10 focus:ring-1 focus:ring-primary outline-none"
          />
        </div>
        {customerErrors.phone && (
          <p className="text-red-500 text-sm">
            {customerErrors.phone?.message}
          </p>
        )}
      </div>

      <div className="flex gap-3">
        <div className="w-1/2">
          <label className="block mb-1 font-semibold text-sm">
            Gender (Optional)
          </label>
          <select
            {...customerRegister("gender")}
            className="w-full border border-muted rounded-lg p-2 focus:ring-1 focus:ring-primary outline-none"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="nonbinary">Non-binary</option>
            <option value="prefer_not_say">Prefer not to say</option>
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
              {...customerRegister("zipcode")}
              placeholder="12345"
              className="w-full border border-muted rounded-lg p-2 pl-10 focus:ring-1 focus:ring-primary outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthCustomer;
