"use client";

import React, { useEffect, useState } from "react";
import { User, Mail, Phone, Building, Globe, MapPin } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { SignUpFormData } from "@/libs/auth/auth";

type AuthOwnerProps = {
  form: UseFormReturn<SignUpFormData>;
};

const AuthOwner = ({ form }: AuthOwnerProps) => {
  const [showLocationFields, setShowLocationFields] = useState(false);

  const businessAddress = form.watch("businessAddress");
  const businessCity = form.watch("businessCity");
  const businessState = form.watch("businessState");
  const businessZip = form.watch("businessZip");
  const businessCountry = form.watch("businessCountry");

  useEffect(() => {
    if (
      businessAddress ||
      businessCity ||
      businessState ||
      businessZip ||
      businessCountry
    ) {
      setShowLocationFields(true);
    }
  }, [businessAddress, businessCity, businessState, businessZip, businessCountry]);

  return (
    <div className="font-inter space-y-2">
      <div>
        <label className="block mb-1 font-semibold text-sm">Owner Name *</label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <input
            {...form.register("ownerName")}
            placeholder="Enter owner name"
            className="w-full border border-muted rounded-lg p-2 pl-10 focus:ring-1 focus:ring-primary outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block mb-1 font-semibold text-sm">
          Business Name *
        </label>
        <div className="relative">
          <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <input
            {...form.register("businessName")}
            placeholder="Enter business name"
            className="w-full border border-muted rounded-lg p-2 pl-10 focus:ring-1 focus:ring-primary outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block mb-1 font-semibold text-sm">
          Business Address *
        </label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <input
            {...form.register("businessAddress")}
            onFocus={() => setShowLocationFields(true)}
            placeholder="123 Main Street"
            className="w-full border border-muted rounded-lg p-2 pl-10 focus:ring-1 focus:ring-primary outline-none"
          />
        </div>
      </div>

      {showLocationFields && (
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="block mb-1 font-semibold text-sm">
              City *
            </label>
            <input
              {...form.register("businessCity")}
              placeholder="City"
              className="w-full border border-muted rounded-lg p-2 focus:ring-1 focus:ring-primary outline-none"
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold text-sm">
              State / Region *
            </label>
            <input
              {...form.register("businessState")}
              placeholder="State or region"
              className="w-full border border-muted rounded-lg p-2 focus:ring-1 focus:ring-primary outline-none"
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold text-sm">
              Postal Code *
            </label>
            <input
              {...form.register("businessZip")}
              placeholder="ZIP / Postal code"
              className="w-full border border-muted rounded-lg p-2 focus:ring-1 focus:ring-primary outline-none"
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold text-sm">
              Country *
            </label>
            <input
              {...form.register("businessCountry")}
              placeholder="Country"
              className="w-full border border-muted rounded-lg p-2 focus:ring-1 focus:ring-primary outline-none"
            />
          </div>
        </div>
      )}

      <div>
        <label className="block mb-1 font-semibold text-sm">
          Business Email *
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <input
            type="email"
            {...form.register("businessEmail")}
            placeholder="business@example.com"
            className="w-full border border-muted rounded-lg p-2 pl-10 focus:ring-1 focus:ring-primary outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block mb-1 font-semibold text-sm">
          Business Phone *
        </label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <input
            type="tel"
            {...form.register("businessPhone")}
            placeholder="Enter business phone"
            className="w-full border border-muted rounded-lg p-2 pl-10 focus:ring-1 focus:ring-primary outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block mb-1 font-semibold text-sm">
          Business Website
        </label>
        <div className="relative">
          <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <input
            type="url"
            {...form.register("businessWebsite")}
            placeholder="https://your-website.com"
            className="w-full border border-muted rounded-lg p-2 pl-10 focus:ring-1 focus:ring-primary outline-none"
          />
        </div>
      </div>
    </div>
  );
};

export default AuthOwner;
