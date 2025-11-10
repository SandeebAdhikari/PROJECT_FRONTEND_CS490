"use client";

import React from "react";
import Link from "next/link";
import NextImage from "next/image";
import Icon9 from "@/public/icons/9.png";
import { User } from "lucide-react";
import NotificationBell from "@/components/Notifications/NotificationBell";

const CustomerNavbar = () => {
  return (
    <div className="p-3 sm:p-4 lg:px-8 flex justify-between items-center w-full border border-b border-border bg-primary-foreground sticky top-0 z-40">
      <Link href="/customer" className="flex items-center gap-1 sm:gap-2 group">
        <NextImage src={Icon9} alt="app-icon" width={32} height={32} className="sm:w-10 sm:h-10" />
        <span className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">StyGo</span>
      </Link>
      <div className="flex gap-1 sm:gap-2 items-center">
        <NotificationBell />
        <div className="relative hidden sm:block">
          <User className="absolute w-4 h-4 top-1/2 left-3 -translate-y-1/2 text-foreground" />
          <Link
            href="/customer/my-profile"
            className="hover:bg-accent transition-bounce rounded-lg py-2 px-4 text-sm lg:text-base font-inter font-semibold text-foreground hover:cursor-pointer hover:shadow-soft-br"
          >
            <span className="ml-6">My Profile</span>
          </Link>
        </div>
        <Link
          href="/customer/my-profile"
          className="sm:hidden p-2 hover:bg-accent rounded-lg transition-bounce"
          aria-label="My Profile"
        >
          <User className="w-5 h-5 text-foreground" />
        </Link>
        <button
          onClick={() => {
            localStorage.removeItem('token');
            localStorage.removeItem('tempToken');
            window.location.href = '/sign-in';
          }}
          className="border border-border rounded-lg py-1.5 px-3 sm:py-2 sm:px-4 text-xs sm:text-sm lg:text-base font-inter font-semibold hover:cursor-pointer hover:bg-accent shadow-soft-br hover:shadow-none transition-smooth"
        >
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default CustomerNavbar;
