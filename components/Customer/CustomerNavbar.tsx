import React from "react";
import Link from "next/link";
import NextImage from "next/image";
import Icon9 from "@/public/icons/9.png";
import { User } from "lucide-react";

const CustomerNavbar = () => {
  return (
    <div className="p-4 sm:px-8 flex justify-between items-center w-full border border-b border-border bg-primary-foreground">
      <Link href="/customer" className="flex items-center gap-1 group">
        <NextImage src={Icon9} alt="app-icon" width={40} height={40} />
        <span className="text-2xl font-bold text-foreground">StyGo</span>
      </Link>
      <div className="flex gap-2">
        <div className=" relative ">
          <User className="absolute w-4 h-4 top-1 left-3 text-foreground" />
          <Link
            href="/customer/my-profile"
            className="hover:bg-accent transition-bounce rounded-lg py-2.5 px-4 text-sm sm:text-base font-inter font-semibold  text-foreground hover:cursor-pointer  hover:shadow-soft-br"
          >
            <span className="ml-6">My Profile</span>
          </Link>
        </div>
        <div className="relative ">
          <Link
            href="/"
            className="border border-border rounded-lg py-2 px-4 text-sm sm:text-base font-inter font-semibold hover:cursor-pointer hover:bg-accent shadow-soft-br hover:shadow-none transition-smooth"
          >
            <span>Logout</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CustomerNavbar;
