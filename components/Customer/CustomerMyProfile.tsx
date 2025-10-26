"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, User } from "lucide-react";
import ProfileTabs from "@/components/Customer/CustomerMyProfileTabs";

const CustomerMyProfile = () => {
  return (
    <div className="flex flex-col w-full min-h-screen bg-background">
      <div className="flex justify-between items-center p-4 sm:p-6 border-b border-border">
        <Link
          href="/customer"
          className="flex items-center gap-2 text-foreground hover:text-primary transition-colors font-inter"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Discovery</span>
        </Link>
        <button
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/sign-in";
          }}
          className="border border-border rounded-lg py-2 px-4 text-sm sm:text-base font-inter font-semibold hover:cursor-pointer hover:bg-accent shadow-soft-br"
        >
          Logout
        </button>
      </div>

      <div className="p-4 sm:p-8 flex items-center gap-4 sm:gap-6">
        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
          <User className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
        </div>
        <div className="flex-1">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-1">
            My Profile
          </h1>
          <p className="text-muted-foreground font-inter">
            emailaddress@gmail.com
          </p>
        </div>
      </div>

      <ProfileTabs />
    </div>
  );
};

export default CustomerMyProfile;
