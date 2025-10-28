"use client";

import { User, Mail, Phone, Building } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { SignUpFormData } from "@/libs/auth/auth";

type AuthOwnerProps = {
  form: UseFormReturn<SignUpFormData>;
};

const AuthOwner = ({ form }: AuthOwnerProps) => {
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
    </div>
  );
};

export default AuthOwner;
