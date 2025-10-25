"use client";

import { useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { SignUpFormData } from "@/libs/auth/auth";

type AuthPasswordProps = {
  form: UseFormReturn<SignUpFormData>;
};

const AuthPassword = ({ form }: AuthPasswordProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <>
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
            className="w-full border border-muted rounded-lg p-2 pl-10 focus:ring-1 focus:ring-primary outline-none"
          />
        </div>
        {form.formState.errors.password && (
          <p className="text-red-500 text-sm">
            {String(form.formState.errors.password.message)}
          </p>
        )}
      </div>

      <div className="font-inter">
        <label className="block mb-1 font-semibold text-sm">
          Confirm Password *
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          {showConfirmPassword ? (
            <EyeOff
              onClick={() => setShowConfirmPassword(false)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4 cursor-pointer"
            />
          ) : (
            <Eye
              onClick={() => setShowConfirmPassword(true)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4 cursor-pointer"
            />
          )}
          <input
            type={showConfirmPassword ? "text" : "password"}
            {...form.register("confirmPassword")}
            placeholder="Confirm password"
            className="w-full border border-muted rounded-lg p-2 pl-10 focus:ring-1 focus:ring-primary outline-none"
          />
        </div>
        {form.formState.errors.confirmPassword && (
          <p className="text-red-500 text-sm">
            {String(form.formState.errors.confirmPassword.message)}
          </p>
        )}
      </div>
    </>
  );
};

export default AuthPassword;
