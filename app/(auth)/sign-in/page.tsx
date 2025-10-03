"use client";

import React from "react";
import AuthForm from "@/components/Auth/AuthForm";

const SignInPage = () => {
  return (
    <div className="flex justify-center bg-white w-full min-h-screen">
      <AuthForm type="sign-in" />
    </div>
  );
};

export default SignInPage;
