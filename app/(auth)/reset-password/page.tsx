"use client";

import React, { Suspense } from "react";
import ResetPasswordForm from "@/components/Auth/ResetPasswordForm";

const ResetPasswordPage = () => {
  return (
    <div className="flex justify-center w-full min-h-screen">
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
};

export default ResetPasswordPage;

