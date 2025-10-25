"use client";

import React from "react";
import NextImage from "next/image";
import { useRouter } from "next/navigation";
import Icon9 from "@/public/icons/9.png";

const NavBar = () => {
  const router = useRouter();

  return (
    <div className="p-4 sm:px-8 flex justify-between items-center w-full border border-b border-border">
      <div
        className="flex items-center gap-1 cursor-pointer"
        onClick={() => router.push("/")}
      >
        <NextImage src={Icon9} alt="app-icon" width={45} height={45} />
        <h1 className="font-extrabold text-lg">StyGo</h1>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => router.push("/sign-in")}
          className="rounded-lg py-3 px-4 text-sm sm:text-base font-inter font-semibold hover:bg-accent transition-smooth cursor-pointer"
        >
          Login
        </button>

        <button
          onClick={() => router.push("/sign-up")}
          className="border border-border rounded-lg py-3 px-4 text-sm sm:text-base font-inter font-semibold bg-primary-light text-white hover:scale-105 shadow-soft-br transition-smooth cursor-pointer"
        >
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default NavBar;
