"use client";

import React from "react";
import SignInForm from "./SignInForm";
import SignUpForm from "./SignUpForm";

type AuthFormProps = {
  type: "sign-in" | "sign-up";
};

const AuthForm: React.FC<AuthFormProps> = ({ type }) => {
  return type === "sign-in" ? <SignInForm /> : <SignUpForm />;
};

export default AuthForm;
