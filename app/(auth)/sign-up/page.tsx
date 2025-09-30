"use client";

import React from "react";
import AuthForm from "@/components/Auth/AuthForm";

const SignUpPage = () => {
  return (
    <div className="flex justify-center bg-white w-full min-h-screen">
      <AuthForm type="sign-up" />
    </div>
  );
};

export default SignUpPage;
